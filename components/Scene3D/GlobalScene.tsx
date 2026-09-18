"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { graph, rootEdgeVertices, projectEdgeVertices, CORE_BACKDROP } from "@/lib/graph";
import { applicationFraming, approachFraming, type CameraFraming } from "@/lib/camera";
import { useSceneContext } from "@/components/Exploration/SceneContext";

/** Vertical clearance above each application hub, just past its largest possible scale. */
const LABEL_OFFSET = 1.75;
/** Drag sensitivity, in radians per pixel of pointer movement. */
const DRAG_SENSITIVITY = 0.0055;
/** Pitch is clamped so the visitor can't spin the camera through the poles and lose orientation. */
const MAX_PITCH = 1.1;
/** How far a mouse wheel "tick" moves the zoom multiplier. */
const WHEEL_ZOOM_SENSITIVITY = 0.0012;
/**
 * Zoom is a multiplier on whatever radius the current framing (the scroll
 * approach or a focused application) already computed, clamped so a visitor
 * can get meaningfully closer or farther without zooming through the core or
 * out past the fog. 0.55 still keeps the camera outside the graph's own
 * radius (~19 units) when zoomed all the way in from the arrival distance.
 */
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.1;

const PROJECT_COUNT = graph.projects.length;
const APP_COUNT = graph.applications.length;

const DIM = 0.14;

// Scratch objects reused every frame / rebuild, so nothing allocates in the render loop.
const scratchObject = new THREE.Object3D();
const scratchColor = new THREE.Color();
const scratchSpherical = new THREE.Spherical();
/**
 * "Dimmed" has to mean "recedes into the backdrop," not "darker" — blending
 * toward the backdrop colour achieves that on a light or a dark stage alike,
 * whereas multiplying toward black (the previous approach) only read as
 * dimming against the old near-black backdrop and would make nodes stand out
 * *more* against this light one.
 */
const DIM_TARGET = new THREE.Color(CORE_BACKDROP);
/** Keeps the orbit just off the poles so it can't flip upside down mid-drag. */
const POLE_GUARD = 0.05;

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Gentle logarithmic size encoding so repository size reads as a difference without becoming noise. */
function projectScale(sizeKb: number): number {
  const normalized = Math.log10(Math.max(1, sizeKb)) / 5; // ~0 for tiny, ~1 for the largest
  return 0.62 + 0.55 * Math.min(1, Math.max(0, normalized));
}

export default function GlobalScene({ reducedMotion }: { reducedMotion: boolean }) {
  const { arrival, focusedApp, selectedProject, setSelectedProject, setFocusedApp } = useSceneContext();
  const { camera, scene, gl } = useThree();

  const projectMeshRef = useRef<THREE.InstancedMesh>(null);
  const appMeshRef = useRef<THREE.InstancedMesh>(null);
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const orbitRef = useRef(0);

  // Visitor-driven orbit: drag horizontally to spin the core sideways, drag
  // vertically to tilt up/down. Stored as yaw/pitch offsets applied on top of
  // whatever framing the scroll/focus state already computed, so dragging
  // never fights the scroll-driven approach or an application focus — it
  // just turns the camera around whichever point it is currently aimed at.
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  // Zoom multiplier on the current framing's radius — mouse wheel on desktop,
  // pinch (two active pointers moving apart/together) on touch. Independent
  // of yaw/pitch, and applied even while an application is focused, unlike
  // orbiting, which stays locked to that application's own framing.
  const zoomRef = useRef(1);
  const draggingRef = useRef(false);
  const arrivedRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const suppressClickRef = useRef(false);

  const rootEdges = useMemo(() => rootEdgeVertices(), []);
  const projectEdges = useMemo(() => projectEdgeVertices(), []);

  /** Edges belonging to the focused application, drawn brightly on top of the dimmed graph. */
  const focusEdges = useMemo(() => {
    if (focusedApp === null) return null;
    const app = graph.applications[focusedApp];
    if (!app) return null;

    const segments: number[] = [
      graph.root[0], graph.root[1], graph.root[2],
      app.position[0], app.position[1], app.position[2],
    ];
    for (const projectIndex of app.projectIndices) {
      const project = graph.projects[projectIndex];
      if (!project) continue;
      segments.push(
        app.position[0], app.position[1], app.position[2],
        project.position[0], project.position[1], project.position[2],
      );
    }
    return new Float32Array(segments);
  }, [focusedApp]);

  // Fog has to attach to the scene itself — nesting <fog> inside a <group>
  // silently does nothing, since a Group has no fog property.
  useEffect(() => {
    scene.fog = new THREE.Fog(CORE_BACKDROP, 40, 190);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // Drag-to-orbit: only armed once the visitor has actually arrived (the
  // same threshold that makes nodes clickable), so a drag never fights the
  // scroll-driven approach. Reduced-motion visitors keep node clicking but
  // get no drag orbit or zoom, consistent with every other camera motion here.
  useEffect(() => {
    arrivedRef.current = arrival > 0.6;
  }, [arrival]);

  useEffect(() => {
    if (reducedMotion) return;
    const element = gl.domElement;
    // Pointer Events unify mouse, pen and touch, so this map also carries
    // pinch-to-zoom: a second simultaneous pointer means two fingers, and its
    // distance-to-the-first-pointer replaces yaw/pitch dragging for as long
    // as both stay down.
    const activePointers = new Map<number, { x: number; y: number }>();
    let pinchStartDistance: number | null = null;
    let pinchStartZoom = 1;

    const onPointerDown = (event: PointerEvent) => {
      if (!arrivedRef.current) return;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      element.setPointerCapture(event.pointerId);

      if (activePointers.size === 1) {
        draggingRef.current = true;
        dragDistanceRef.current = 0;
      } else if (activePointers.size === 2) {
        draggingRef.current = false;
        const [a, b] = [...activePointers.values()];
        pinchStartDistance = distanceBetween(a!, b!);
        pinchStartZoom = zoomRef.current;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const previous = activePointers.get(event.pointerId);
      if (!previous) return;
      const current = { x: event.clientX, y: event.clientY };
      activePointers.set(event.pointerId, current);

      if (activePointers.size >= 2) {
        const [a, b] = [...activePointers.values()];
        const distance = distanceBetween(a!, b!);
        if (pinchStartDistance !== null && pinchStartDistance > 1) {
          // Fingers moving apart (distance grows) zooms in — the multiplier
          // shrinks — matching the same pinch convention as maps and photos.
          zoomRef.current = clampZoom(pinchStartZoom * (pinchStartDistance / distance));
        }
        return;
      }

      if (!draggingRef.current) return;
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);
      yawRef.current += dx * DRAG_SENSITIVITY;
      pitchRef.current = Math.min(MAX_PITCH, Math.max(-MAX_PITCH, pitchRef.current + dy * DRAG_SENSITIVITY));
    };

    const endPointer = (event: PointerEvent) => {
      activePointers.delete(event.pointerId);
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);

      if (activePointers.size < 2) pinchStartDistance = null;

      if (activePointers.size === 0) {
        // A drag of any real distance should not also register as a node
        // click once the pointer lifts — the browser still fires `click`
        // after a drag unless something suppresses it.
        if (draggingRef.current && dragDistanceRef.current > 6) {
          suppressClickRef.current = true;
          queueMicrotask(() => {
            suppressClickRef.current = false;
          });
        }
        draggingRef.current = false;
      } else if (activePointers.size === 1) {
        // Lifted one of two pinching fingers: resume single-finger orbit
        // fresh from here, rather than replaying the pinch's drag distance.
        draggingRef.current = true;
        dragDistanceRef.current = 0;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!arrivedRef.current) return;
      // The graph is the last thing on the page, so trading page scroll for
      // zoom here never strands a visitor unable to reach content below it.
      event.preventDefault();
      zoomRef.current = clampZoom(zoomRef.current * (1 + event.deltaY * WHEEL_ZOOM_SENSITIVITY));
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", endPointer);
    element.addEventListener("pointercancel", endPointer);
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", endPointer);
      element.removeEventListener("pointercancel", endPointer);
      element.removeEventListener("wheel", onWheel);
    };
  }, [gl, reducedMotion]);

  // Instance transforms never change, so they are written exactly once.
  useEffect(() => {
    const projectMesh = projectMeshRef.current;
    if (projectMesh) {
      graph.projects.forEach((project, i) => {
        scratchObject.position.set(project.position[0], project.position[1], project.position[2]);
        const scale = projectScale(project.sizeKb);
        scratchObject.scale.set(scale, scale, scale);
        scratchObject.updateMatrix();
        projectMesh.setMatrixAt(i, scratchObject.matrix);
      });
      projectMesh.instanceMatrix.needsUpdate = true;
      projectMesh.computeBoundingSphere();
    }

    const appMesh = appMeshRef.current;
    if (appMesh) {
      graph.applications.forEach((app, i) => {
        scratchObject.position.set(app.position[0], app.position[1], app.position[2]);
        // Larger applications get visibly larger hubs.
        const scale = 0.85 + 0.5 * Math.min(1, app.count / 112);
        scratchObject.scale.set(scale, scale, scale);
        scratchObject.updateMatrix();
        appMesh.setMatrixAt(i, scratchObject.matrix);
      });
      appMesh.instanceMatrix.needsUpdate = true;
      appMesh.computeBoundingSphere();
    }
  }, []);

  // Colours change with focus and selection, so they are rewritten whenever those change.
  useEffect(() => {
    const projectMesh = projectMeshRef.current;
    if (projectMesh) {
      graph.projects.forEach((project, i) => {
        const app = graph.applications[project.primaryApp];
        scratchColor.set(app?.color ?? "#2E8F68");
        const isMember = focusedApp === null || project.appIndices.includes(focusedApp);
        if (!isMember) scratchColor.lerp(DIM_TARGET, 1 - DIM);
        if (selectedProject === i) scratchColor.set("#154B3B");
        projectMesh.setColorAt(i, scratchColor);
      });
      if (projectMesh.instanceColor) projectMesh.instanceColor.needsUpdate = true;
    }

    const appMesh = appMeshRef.current;
    if (appMesh) {
      graph.applications.forEach((app, i) => {
        scratchColor.set(app.color);
        if (focusedApp !== null && focusedApp !== i) scratchColor.lerp(DIM_TARGET, 1 - DIM);
        appMesh.setColorAt(i, scratchColor);
      });
      if (appMesh.instanceColor) appMesh.instanceColor.needsUpdate = true;
    }
  }, [focusedApp, selectedProject]);

  useFrame((_, delta) => {
    const focused = focusedApp === null ? null : applicationFraming(focusedApp);
    let target: CameraFraming = focused ?? approachFraming(arrival);

    // Once arrived and not inspecting a single application, drift slowly
    // around the core so the structure reads in three dimensions rather than
    // as a flat picture — paused while the visitor is dragging, and stopped
    // entirely under reduced motion. The visitor's own drag (yaw/pitch,
    // accumulated by the pointer handlers above) always applies on top of
    // that drift, using three.js's own spherical coordinates rather than
    // hand-rolled trig for the combined rotation. Zoom applies regardless of
    // focus — spin and pitch stay locked to an application's own framing,
    // but getting closer to or farther from it is always available.
    if (!focused && arrival > 0.95 && !reducedMotion && !draggingRef.current) {
      orbitRef.current += delta * 0.055;
    }

    const spinAngle = focused ? 0 : orbitRef.current + yawRef.current;
    const pitchOffset = focused ? 0 : pitchRef.current;

    if (spinAngle !== 0 || pitchOffset !== 0 || zoomRef.current !== 1) {
      scratchSpherical.setFromVector3(
        scratchObject.position.set(target.position[0], target.position[1], target.position[2]),
      );
      scratchSpherical.theta += spinAngle;
      scratchSpherical.phi = Math.min(
        Math.PI - POLE_GUARD,
        Math.max(POLE_GUARD, scratchSpherical.phi - pitchOffset),
      );
      scratchSpherical.radius *= zoomRef.current;
      scratchObject.position.setFromSpherical(scratchSpherical);
      target = {
        position: [scratchObject.position.x, scratchObject.position.y, scratchObject.position.z],
        lookAt: target.lookAt,
      };
    }

    // Critically damped follow, frame-rate independent. Reduced motion snaps.
    const k = reducedMotion ? 1 : 1 - Math.pow(0.0015, delta);
    camera.position.lerp(
      scratchObject.position.set(target.position[0], target.position[1], target.position[2]),
      k,
    );
    lookAtRef.current.lerp(
      scratchObject.position.set(target.lookAt[0], target.lookAt[1], target.lookAt[2]),
      k,
    );
    camera.lookAt(lookAtRef.current);
  });

  const handleProjectClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (suppressClickRef.current) return;
    const id = event.instanceId;
    if (id === undefined) return;
    setSelectedProject(selectedProject === id ? null : id);
  };

  const handleAppClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (suppressClickRef.current) return;
    const id = event.instanceId;
    if (id === undefined) return;
    setFocusedApp(focusedApp === id ? null : id);
  };

  const setCursor = (value: string) => {
    gl.domElement.style.cursor = value;
  };

  // Nodes are only clickable once the visitor has actually arrived at the core.
  const interactive = arrival > 0.6;

  return (
    <group>
      {/* Root: the single core every application hangs from. Solid oxide —
          the site's own accent colour, used everywhere else for buttons,
          links and active states — not black, so the core reads as part of
          the same live, applied-colour world as everything hanging off it. */}
      <mesh position={graph.root}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial color="#1E6B55" />
      </mesh>
      <mesh position={graph.root}>
        <icosahedronGeometry args={[2.6, 2]} />
        <meshBasicMaterial color="#3B9880" transparent opacity={0.16} />
      </mesh>

      {/* Every application→project edge, faint. */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[projectEdges.positions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#59605B"
          transparent
          opacity={focusedApp === null ? 0.28 : 0.08}
        />
      </lineSegments>

      {/* Root→application spokes, slightly stronger so the hierarchy reads. */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[rootEdges, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#1E6B55"
          transparent
          opacity={focusedApp === null ? 0.45 : 0.15}
        />
      </lineSegments>

      {focusEdges && (
        <lineSegments key={`focus-${focusedApp}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[focusEdges, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#154B3B" transparent opacity={0.85} />
        </lineSegments>
      )}

      {/* Every application hub carries its own name directly on the node,
          always facing the camera, so the identity is readable in the scene
          itself and not only in the side navigation. */}
      {graph.applications.map((app) => (
        <Billboard key={app.name} position={app.position}>
          <Text
            position={[0, LABEL_OFFSET, 0]}
            fontSize={0.62}
            color="#171B18"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.03}
            outlineColor="#F4F6F1"
          >
            {app.name}
          </Text>
        </Billboard>
      ))}

      <instancedMesh
        ref={projectMeshRef}
        args={[undefined, undefined, PROJECT_COUNT]}
        onClick={interactive ? handleProjectClick : undefined}
        onPointerOver={interactive ? () => setCursor("pointer") : undefined}
        onPointerOut={interactive ? () => setCursor("auto") : undefined}
      >
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <instancedMesh
        ref={appMeshRef}
        args={[undefined, undefined, APP_COUNT]}
        onClick={interactive ? handleAppClick : undefined}
        onPointerOver={interactive ? () => setCursor("pointer") : undefined}
        onPointerOut={interactive ? () => setCursor("auto") : undefined}
      >
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
