"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useScanner } from "@/hooks/useScanner";
import { Terminal, AlertTriangle, Cpu, Wifi } from "lucide-react";

interface ScannerPageProps {
  onComplete: () => void;
}

export function ScannerPage({ onComplete }: ScannerPageProps) {
  const { progress, currentMessage, terminalLines, warning } =
    useScanner(onComplete);

  return (
    <div className="relative min-h-screen bg-dark-bg flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Warning Flash Overlay */}
      <AnimatePresence>
        {warning && (
          <motion.div
            key={warning}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            style={{ background: "rgba(255,0,0,0.08)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border border-red-500/50 bg-red-950/40 backdrop-blur-md"
            >
              <AlertTriangle className="text-red-400 w-8 h-8" />
              <span className="text-red-300 font-mono font-bold text-lg md:text-2xl text-center">
                {warning}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanner Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-10 flex items-center gap-3 text-neon-green font-mono text-sm"
      >
        <Cpu size={14} className="animate-pulse" />
        <span>CERTIFIED DETECTOR v2.0.69</span>
        <Wifi size={14} className="animate-pulse" />
        <span className="text-neon-green/50">SCANNING...</span>
      </motion.div>

      {/* Radar / Circle Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-10"
      >
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          {/* Outer rings */}
          {[1, 0.75, 0.5].map((scale, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-neon-green/20"
              style={{ transform: `scale(${scale})`, top: 0, left: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            />
          ))}

          {/* Spinning sweep */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 270deg, rgba(0,255,136,0.4) 360deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-3 h-3 rounded-full bg-neon-green"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ boxShadow: "0 0 20px rgba(0,255,136,0.8)" }}
            />
          </div>

          {/* Progress percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black font-display text-neon-green mt-8">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 w-full max-w-md mb-6"
      >
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-neon-green/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #00ff88, #00ccff)",
              boxShadow: "0 0 12px rgba(0,255,136,0.6)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </motion.div>

      {/* Current Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 text-center mb-8 h-8"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-neon-green font-mono text-sm md:text-base"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Terminal Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-xl border border-neon-green/10 bg-black/40 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-neon-green/10">
            <Terminal size={12} className="text-neon-green/60" />
            <span className="text-neon-green/40 text-xs font-mono">
              system.log
            </span>
            <div className="ml-auto flex gap-1.5">
              {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((c) => (
                <div key={c} className={`w-2 h-2 rounded-full ${c} opacity-60`} />
              ))}
            </div>
          </div>
          <div className="p-4 h-40 overflow-hidden flex flex-col-reverse">
            <AnimatePresence initial={false}>
              {[...terminalLines].reverse().map((line, i) => (
                <motion.div
                  key={line + i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1 - i * 0.12, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xs leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{
                    color:
                      line.includes("[ERROR]") || line.includes("ERROR")
                        ? "#ff4040"
                        : line.includes("[WARN]") || line.includes("warning")
                        ? "#ffaa00"
                        : line.includes("[OK]") || line.includes("success")
                        ? "#00ff88"
                        : "rgba(0,255,136,0.5)",
                  }}
                >
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-8 text-white/20 text-xs font-mono text-center"
      >
        ⚠ Results are randomly generated for entertainment only
      </motion.p>
    </div>
  );
}
