"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateResult, type ScanResult } from "@/lib/resultGenerator";
import { ResultCard } from "./ResultCard";
import { ConfettiOverlay } from "./ConfettiOverlay";
import { RareEventOverlay } from "./RareEventOverlay";
import { BodyCountReveal } from "./BodyCountReveal";
import { Sounds } from "@/lib/sounds";

interface ResultPageProps {
  onRestart: () => void;
}

type SubPhase = "analysisComplete" | "bodyCount" | "card";

export function ResultPage({ onRestart }: ResultPageProps) {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [subPhase, setSubPhase] = useState<SubPhase>("analysisComplete");
  const [showConfetti, setShowConfetti] = useState(false);
  const [key, setKey] = useState(0);

  const runReveal = (res: ScanResult) => {
    setResult(res);
    setSubPhase("analysisComplete");
    setShowConfetti(false);

    Sounds.complete();

    // "ANALYSIS COMPLETE" → body count reveal
    setTimeout(() => {
      setSubPhase("bodyCount");
    }, 2000);
  };

  useEffect(() => {
    const res = generateResult();
    runReveal(res);
  }, [key]);

  const handleBodyCountDone = () => {
    setSubPhase("card");
    setShowConfetti(true);
    if (result?.rareEvent === "rainbow") Sounds.rare();
    else if (result?.rareEvent === "gold") Sounds.gold();
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleRegenerate = () => {
    Sounds.click();
    setSubPhase("analysisComplete");
    setResult(null);
    setKey((k) => k + 1);
  };

  return (
    <div className="relative min-h-screen bg-dark-bg overflow-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Confetti */}
      <AnimatePresence>{showConfetti && <ConfettiOverlay />}</AnimatePresence>

      {/* Rare event overlay */}
      <AnimatePresence>
        {subPhase === "card" && result?.rareEvent && (
          <RareEventOverlay type={result.rareEvent} />
        )}
      </AnimatePresence>

      {/* Phase 1: ANALYSIS COMPLETE */}
      <AnimatePresence>
        {subPhase === "analysisComplete" && (
          <motion.div
            key="analysis-complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center"
          >
            <motion.p
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "0.5em", opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-neon-green/60 font-mono text-sm mb-4 uppercase"
            >
              Scan Complete
            </motion.p>
            <motion.h1
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 150 }}
              className="font-display font-black text-center"
              style={{
                fontSize: "clamp(2rem, 8vw, 5rem)",
                background:
                  "linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #bf00ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(0,255,136,0.5))",
              }}
            >
              ANALYSIS
              <br />
              COMPLETE
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-px mt-6"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #00ff88, transparent)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Body Count Reveal */}
      <AnimatePresence>
        {subPhase === "bodyCount" && result && (
          <BodyCountReveal result={result} onComplete={handleBodyCountDone} />
        )}
      </AnimatePresence>

      {/* Phase 3: Full Result Card */}
      <AnimatePresence>
        {subPhase === "card" && result && (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 min-h-screen flex flex-col items-center justify-start py-12 px-4"
          >
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-center"
            >
              <h2
                className="font-display font-black text-2xl md:text-4xl"
                style={{
                  background: "linear-gradient(135deg, #00ff88, #00ccff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Certified Body Count Detector
              </h2>
              <p className="text-white/30 text-sm font-mono mt-1">
                100% Fake · 1000% Accurate
              </p>
            </motion.div>

            <div className="w-full max-w-lg">
              <ResultCard result={result} onRegenerate={handleRegenerate} />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 text-white/20 text-xs font-mono text-center"
            >
              ★ For entertainment purposes only. Results are randomly generated. ★
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
