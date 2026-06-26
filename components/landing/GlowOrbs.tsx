"use client";

import { motion } from "framer-motion";

const ORBS = [
  {
    color: "rgba(0,255,136,0.12)",
    size: 600,
    x: "10%",
    y: "20%",
    delay: 0,
    duration: 8,
  },
  {
    color: "rgba(191,0,255,0.1)",
    size: 500,
    x: "75%",
    y: "60%",
    delay: 2,
    duration: 10,
  },
  {
    color: "rgba(0,204,255,0.08)",
    size: 400,
    x: "50%",
    y: "10%",
    delay: 1,
    duration: 7,
  },
  {
    color: "rgba(255,0,127,0.06)",
    size: 350,
    x: "85%",
    y: "5%",
    delay: 3,
    duration: 12,
  },
];

export function GlowOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
