import { useEffect, useRef, useState } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4'
const POSTER_URL = '/hero-poster.jpg'

const MAX_FRAMES = 90
const MIN_FRAMES = 24
const FRAMES_PER_SECOND = 12
const MAX_FRAME_WIDTH = 960
// Fraction of the remaining distance covered per 60 Hz frame; lower = silkier, laggier.
const LERP = 0.075
const SEEK_EPSILON = 0.04

function waitFor(el: HTMLVideoElement, event: string) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      el.removeEventListener(event, onOk)
      el.removeEventListener('error', onErr)
    }
    const onOk = () => (cleanup(), resolve())
    const onErr = () => (cleanup(), reject(new Error('video error')))
    el.addEventListener(event, onOk)
    el.addEventListener('error', onErr)
  })
}

// Seeks an offscreen copy of the video and snapshots evenly spaced frames.
async function extractFrames(isCancelled: () => boolean): Promise<ImageBitmap[]> {
  const v = document.createElement('video')
  v.muted = true
  v.playsInline = true
  v.preload = 'auto'
  v.src = VIDEO_URL
  const frames: ImageBitmap[] = []
  try {
    if (v.readyState < 1) await waitFor(v, 'loadedmetadata')
    if (v.readyState < 2) await waitFor(v, 'loadeddata')

    const { duration, videoWidth, videoHeight } = v
    const count = Math.min(MAX_FRAMES, Math.max(MIN_FRAMES, Math.round(duration * FRAMES_PER_SECOND)))
    const w = Math.min(MAX_FRAME_WIDTH, videoWidth)
    const h = Math.round((w * videoHeight) / videoWidth)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!

    for (let i = 0; i < count; i++) {
      if (isCancelled()) return []
      const t = (i / (count - 1)) * Math.max(duration - 0.05, 0)
      if (Math.abs(v.currentTime - t) > 0.001) {
        const seeked = waitFor(v, 'seeked')
        v.currentTime = t
        await seeked
      }
      ctx.drawImage(v, 0, 0, w, h)
      frames.push(await createImageBitmap(canvas))
    }
    return frames
  } catch (err) {
    frames.forEach((f) => f.close())
    throw err
  } finally {
    v.removeAttribute('src')
    v.load()
  }
}

function drawCover(ctx: CanvasRenderingContext2D, src: ImageBitmap, cw: number, ch: number) {
  const scale = Math.max(cw / src.width, ch / src.height)
  const dw = src.width * scale
  const dh = src.height * scale
  ctx.drawImage(src, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
}

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<ImageBitmap[]>([])
  const [hasFrame, setHasFrame] = useState(false)
  const [cacheReady, setCacheReady] = useState(false)

  // Frame cache: starts once the visible video has a decoded frame, after a 300ms yield.
  useEffect(() => {
    if (!hasFrame) return
    let cancelled = false
    const timer = setTimeout(() => {
      extractFrames(() => cancelled)
        .then((frames) => {
          if (cancelled || !frames.length) return
          framesRef.current = frames
          setCacheReady(true)
        })
        .catch((err) => console.warn('frame cache unavailable, scrubbing video directly', err))
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [hasFrame])

  // Scroll -> smoothed progress -> canvas frame (or video seek until the cache is ready).
  useEffect(() => {
    const video = videoRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let target = 0
    let smoothed = 0
    let lastPos = -1
    let dirty = true
    let raf = 0
    let last = performance.now()
    ctx.imageSmoothingQuality = 'high'

    if (video.readyState >= 2) setHasFrame(true)

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    const onResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      dirty = true
      onScroll()
    }
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      smoothed += (target - smoothed) * (1 - Math.pow(1 - LERP, dt * 60))
      if (Math.abs(target - smoothed) < 1e-5) smoothed = target
      const frames = framesRef.current
      if (frames.length) {
        // Cross-fade the two neighbouring cached frames so motion is continuous between snapshots.
        const pos = smoothed * (frames.length - 1)
        if (Math.abs(pos - lastPos) > 0.002 || dirty) {
          const i = Math.floor(pos)
          const f = pos - i
          ctx.globalAlpha = 1
          drawCover(ctx, frames[i], canvas.width, canvas.height)
          if (f > 0.01 && frames[i + 1]) {
            ctx.globalAlpha = f
            drawCover(ctx, frames[i + 1], canvas.width, canvas.height)
            ctx.globalAlpha = 1
          }
          lastPos = pos
          dirty = false
        }
      } else if (video.duration) {
        const t = smoothed * (video.duration - 0.05)
        if (Math.abs(video.currentTime - t) > SEEK_EPSILON) video.currentTime = t
      }
      raf = requestAnimationFrame(tick)
    }

    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-mist">
      <img
        src={POSTER_URL}
        alt=""
        onError={(e) => (e.currentTarget.style.display = 'none')}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          hasFrame || cacheReady ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setHasFrame(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          hasFrame && !cacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          cacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
