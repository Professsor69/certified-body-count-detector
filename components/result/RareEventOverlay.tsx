"use client";

import { motion } from "framer-motion";

interface RareEventOverlayProps {
  type: "gold" | "rainbow";
}

export function RareEventOverlay({ type }: RareEventOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-start pt-24"
    >
      {/* Background glow */}
      <motion.div
        className="fixed inset-0"
        animate={
          type === "rainbow"
            ? {
                background: [
                  "radial-gradient(ellipse at center, rgba(255,0,127,0.15) 0%, transparent 70%)",
                  "radial-gradient(ellipse at center, rgba(191,0,255,0.15) 0%, transparent 70%)",
                  "radial-gradient(ellipse at center, rgba(0,204,255,0.15) 0%, transparent 70%)",
                  "radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, transparent 70%)",
                  "radial-gradient(ellipse at center, rgba(255,215,0,0.15) 0%, transparent 70%)",
                ],
              }
            : {
                background:
                  "radial-gradient(ellipse at center, rgba(255,215,0,0.2) 0%, transparent 70%)",
              }
        }
        transition={
          type === "rainbow"
            ? { duration: 3, repeat: Infinity, ease: "linear" }
            : {}
        }
      />

      {/* Badge */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="relative px-8 py-4 rounded-2xl text-center border-2"
        style={
          type === "rainbow"
            ? {
                borderColor: "rgba(255,255,255,0.3)",
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(12px)",
              }
            : {
                borderColor: "rgba(255,215,0,0.5)",
                background: "rgba(255,215,0,0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 40px rgba(255,215,0,0.3)",
              }
        }
      >
        <motion.p
          className="text-xs font-mono mb-1"
          style={{ color: type === "rainbow" ? "#ffffff" : "#ffd700" }}
          animate={
            type === "rainbow"
              ? { filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"] }
              : {}
          }
          transition={
            type === "rainbow"
              ? { duration: 2, repeat: Infinity, ease: "linear" }
              : {}
          }
        >
          ★ {type === "rainbow" ? "ULTRA RARE — 1 IN 1000" : "GOLDEN RESULT — 1 IN 500"} ★
        </motion.p>
        <motion.p
          className="text-2xl font-black font-display"
          style={
            type === "rainbow"
              ? {
                  background: "linear-gradient(90deg, #ff007f, #bf00ff, #00ccff, #00ff88, #ffd700)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }
              : { color: "#ffd700" }
          }
          animate={
            type === "rainbow"
              ? { backgroundPosition: ["0%", "100%", "0%"] }
              : { filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          {type === "rainbow" ? "YOU ARE THE CHOSEN ONE" : "GOLDEN SPECIMEN DETECTED"}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
