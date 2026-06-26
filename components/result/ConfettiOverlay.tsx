"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  duration: number;
  rotation: number;
}

const COLORS = [
  "#00ff88",
  "#00ccff",
  "#bf00ff",
  "#ff007f",
  "#ffd700",
  "#ff6b00",
  "#ffffff",
];

export function ConfettiOverlay() {
  const pieces: ConfettiPiece[] = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 1.5,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 2 + 2.5,
    rotation: Math.random() * 720 - 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size * 0.5,
            backgroundColor: piece.color,
            boxShadow: `0 0 6px ${piece.color}`,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, piece.rotation],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
