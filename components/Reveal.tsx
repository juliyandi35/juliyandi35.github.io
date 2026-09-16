"use client";

import { motion, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * A small scroll-reveal wrapper. Respects the user's motion preference
 * globally via the <MotionConfig reducedMotion="user"> provider in the root
 * layout — Framer Motion disables the animation automatically for anyone
 * with `prefers-reduced-motion: reduce`, so nothing here needs its own
 * media-query check.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
