"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ScanResult } from "@/lib/resultGenerator";
import { Sounds } from "@/lib/sounds";

interface BodyCountRevealProps {
  result: ScanResult;
  onComplete: () => void;
}

const TIER_CONFIG = {
  zero: {
    color: "#00ff88",
    glow: "rgba(0,255,136,0.4)",
    label: "Absolutely Pure",
    emoji: "😇",
    message: "Certified angel. Touch grass confirmed.",
    bg: "rgba(0,255,136,0.08)",
    border: "rgba(0,255,136,0.3)",
  },
  low: {
    color: "#00ccff",
    glow: "rgba(0,204,255,0.4)",
    label: "Mild Activity",
    emoji: "🤔",
    message: "Suspiciously low. The streets don't believe you.",
    bg: "rgba(0,204,255,0.08)",
    border: "rgba(0,204,255,0.3)",
  },
  mid: {
    color: "#bf00ff",
    glow: "rgba(191,0,255,0.4)",
    label: "Industry Standard",
    emoji: "😏",
    message: "Right in the average zone. Nothing to see here.",
    bg: "rgba(191,0,255,0.08)",
    border: "rgba(191,0,255,0.3)",
  },
  high: {
    color: "#ff6b00",
    glow: "rgba(255,107,0,0.4)",
    label: "Concerning Levels",
    emoji: "🤯",
    message: "Sir/Ma'am, this is a Wendy's.",
    bg: "rgba(255,107,0,0.08)",
    border: "rgba(255,107,0,0.3)",
  },
  danger: {
    color: "#ff2244",
    glow: "rgba(255,34,68,0.5)",
    label: "DANGER ZONE",
    emoji: "💀",
    message: "The streets are not safe. You ARE the streets.",
    bg: "rgba(255,34,68,0.08)",
    border: "rgba(255,34,68,0.4)",
  },
  legendary: {
    color: "#ff007f",
    glow: "rgba(255,0,127,0.6)",
    label: "LEGENDARY STATUS",
    emoji: "👑",
    message: "At this point you should be writing a book.",
    bg: "rgba(255,0,127,0.1)",
    border: "rgba(255,0,127,0.5)",
  },
};

// Special messages for iconic numbers
const ICONIC_MESSAGES: Record<number, string> = {
  0: "Zero? Really? 🤨 The algorithm doesn't believe you.",
  1: "One? First time? Sure buddy.",
  69: "Of course it's 69. The algorithm knew. We all knew.",
  420: "Certified stoner energy. The count is 420. Classic.",
  666: "The mark of the beast. The streets are scared of you.",
  999: "999?! You are legally required to write a memoir.",
};

export function BodyCountReveal({ result, onComplete }: BodyCountRevealProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [countingDone, setCountingDone] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const config = TIER_CONFIG[result.bodyCountTier];
  const target = result.bodyCount;
  const iconicMessage = ICONIC_MESSAGES[target];

  // Count-up animation
  useEffect(() => {
    const duration = 1800; // ms
    const startTime = Date.now();
    let frame: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplayCount(current);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCountingDone(true);
        Sounds.complete();
        setTimeout(() => setShowDetails(true), 400);
        setTimeout(() => onComplete(), 2800);
      }
    };

    // Small delay before counting starts for drama
    const startDelay = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, 600);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(frame);
    };
  }, [target, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center px-6"
      style={{ background: "#030712" }}
    >
      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${config.color}22 1px, transparent 1px),
            linear-gradient(90deg, ${config.color}22 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Pulsing glow behind number */}
      {countingDone && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          animate={{
            background: [
              `radial-gradient(ellipse at center, ${config.glow} 0%, transparent 60%)`,
              `radial-gradient(ellipse at center, ${config.glow.replace("0.4", "0.15")} 0%, transparent 60%)`,
              `radial-gradient(ellipse at center, ${config.glow} 0%, transparent 60%)`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Header label */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-mono text-sm uppercase tracking-widest mb-4"
        style={{ color: `${config.color}aa` }}
      >
        🔬 Body Count Detected
      </motion.p>

      {/* The big number */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        className="font-display font-black text-center mb-2"
        style={{
          fontSize: "clamp(5rem, 25vw, 10rem)",
          lineHeight: 1,
          color: config.color,
          filter: countingDone ? `drop-shadow(0 0 30px ${config.glow})` : "none",
          transition: "filter 0.5s ease",
        }}
      >
        {displayCount}
      </motion.div>

      {/* Tier label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="px-5 py-1.5 rounded-full font-bold font-mono text-sm uppercase tracking-wide mb-6"
        style={{
          background: config.bg,
          border: `1px solid ${config.border}`,
          color: config.color,
        }}
      >
        {config.emoji} {config.label}
      </motion.div>

      {/* Detail card — appears after counting done */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full rounded-2xl p-5 text-center"
        style={{
          background: config.bg,
          border: `1px solid ${config.border}`,
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          className="font-mono text-base leading-relaxed"
          style={{ color: config.color }}
        >
          {iconicMessage ?? config.message}
        </p>
      </motion.div>

      {/* "Loading full report" hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-white/20 font-mono text-xs"
      >
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ▊
        </motion.span>
        Loading full analysis report...
      </motion.div>
    </motion.div>
  );
}
