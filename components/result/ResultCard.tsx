"use client";

import { motion } from "framer-motion";
import type { ScanResult } from "@/lib/resultGenerator";
import { ShareButtons } from "./ShareButtons";
import { Quote, Star } from "lucide-react";

interface ResultCardProps {
  result: ScanResult;
  onRegenerate: () => void;
}

const TIER_COLORS = {
  zero: "#00ff88",
  low: "#00ccff",
  mid: "#bf00ff",
  high: "#ff6b00",
  danger: "#ff2244",
  legendary: "#ff007f",
};

const TIER_LABELS = {
  zero: "😇 Certified Pure",
  low: "🤔 Mild Activity",
  mid: "😏 Industry Standard",
  high: "🤯 Concerning",
  danger: "💀 DANGER ZONE",
  legendary: "👑 LEGENDARY",
};

export function ResultCard({ result, onRegenerate }: ResultCardProps) {
  const isGold = result.rareEvent === "gold";
  const isRainbow = result.rareEvent === "rainbow";
  const bodyCountColor = TIER_COLORS[result.bodyCountTier];
  const isHighCount = result.bodyCountTier === "danger" || result.bodyCountTier === "legendary";

  return (
    <div id="result-card">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(10,15,26,0.9)",
          backdropFilter: "blur(20px)",
          border: isRainbow
            ? "2px solid rgba(255,255,255,0.2)"
            : isGold
            ? "2px solid rgba(255,215,0,0.4)"
            : isHighCount
            ? `2px solid ${bodyCountColor}55`
            : "1px solid rgba(0,255,136,0.2)",
          boxShadow: isHighCount
            ? `0 0 60px ${bodyCountColor}30, 0 25px 50px rgba(0,0,0,0.5)`
            : isGold
            ? "0 0 60px rgba(255,215,0,0.2), 0 0 120px rgba(255,215,0,0.05)"
            : "0 0 40px rgba(0,255,136,0.08), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="relative px-6 pt-8 pb-4 text-center"
          style={{
            background: isRainbow
              ? "linear-gradient(135deg, rgba(255,0,127,0.08), rgba(191,0,255,0.08), rgba(0,204,255,0.08))"
              : isGold
              ? "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.04))"
              : "linear-gradient(135deg, rgba(0,255,136,0.04), rgba(0,204,255,0.04))",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono mb-4"
            style={{
              background: "rgba(0,255,136,0.08)",
              border: "1px solid rgba(0,255,136,0.25)",
              color: "#00ff88",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            CERTIFIED ANALYSIS COMPLETE
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="text-5xl mb-4 select-none"
          >
            🧬
          </motion.div>

          {/* Verdict Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-5 py-2.5 rounded-2xl font-display font-black text-lg md:text-xl mb-2"
            style={
              isRainbow
                ? {
                    background: "linear-gradient(135deg, #ff007f, #bf00ff, #00ccff, #00ff88)",
                    color: "white",
                    boxShadow: "0 0 30px rgba(191,0,255,0.4)",
                  }
                : isGold
                ? {
                    background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                    color: "#030712",
                    boxShadow: "0 0 30px rgba(255,215,0,0.4)",
                  }
                : {
                    background: "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,204,255,0.15))",
                    border: "1px solid rgba(0,255,136,0.35)",
                    color: "#00ff88",
                    boxShadow: "0 0 20px rgba(0,255,136,0.15)",
                  }
            }
          >
            {result.verdict}
          </motion.div>
        </div>

        {/* ===== BODY COUNT PINNED STAT ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mx-4 mb-1 rounded-2xl overflow-hidden"
          style={{
            border: `1px solid ${bodyCountColor}40`,
            background: `linear-gradient(135deg, ${bodyCountColor}08, ${bodyCountColor}04)`,
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💀</span>
              <div>
                <p className="font-mono text-xs text-white/40 uppercase tracking-wide">
                  Body Count
                </p>
                <p
                  className="font-display font-black text-2xl leading-none"
                  style={{
                    color: bodyCountColor,
                    filter: isHighCount
                      ? `drop-shadow(0 0 8px ${bodyCountColor})`
                      : "none",
                  }}
                >
                  {result.bodyCount}
                </p>
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold"
              style={{
                background: `${bodyCountColor}18`,
                border: `1px solid ${bodyCountColor}30`,
                color: bodyCountColor,
              }}
            >
              {TIER_LABELS[result.bodyCountTier]}
            </div>
          </div>
          {/* Red danger pulse bar for high counts */}
          {isHighCount && (
            <motion.div
              className="h-0.5 w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${bodyCountColor}, transparent)` }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Stats section */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-white/25 text-xs font-mono mb-3 uppercase tracking-widest px-2">
            Analysis Results
          </p>
          <div className="space-y-2.5">
            {result.stats.map((stat, i) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className="flex items-center gap-3 px-2"
              >
                <span className="text-base shrink-0 w-6 text-center">{stat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/60 text-xs font-mono truncate">
                      {stat.name}
                    </span>
                    <span
                      className="text-xs font-bold font-mono ml-2 shrink-0"
                      style={{ color: stat.color }}
                    >
                      {stat.value}% · {stat.label}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ delay: 0.65 + i * 0.05, duration: 0.5 }}
                      style={{
                        backgroundColor: stat.color,
                        boxShadow: `0 0 6px ${stat.color}`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="px-4 py-3 border-t border-white/5">
          <p className="text-white/25 text-xs font-mono mb-3 uppercase tracking-widest px-2">
            Field Observations
          </p>
          <div className="space-y-2">
            {result.observations.map((obs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="flex gap-3 items-start p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Quote size={11} className="text-neon-green/30 shrink-0 mt-0.5" />
                <p className="text-white/55 text-sm leading-relaxed">{obs}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 flex items-center justify-between">
          <span className="text-white/20 text-xs font-mono">{result.timestamp}</span>
          <div className="flex items-center gap-1 text-white/20 text-xs font-mono">
            <Star size={9} />
            <span>certifieddetector.fun</span>
          </div>
        </div>
      </motion.div>

      {/* Share buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-5"
        id="share-buttons"
      >
        <ShareButtons result={result} onRegenerate={onRegenerate} />
      </motion.div>
    </div>
  );
}
