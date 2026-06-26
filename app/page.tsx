"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Sounds } from "@/lib/sounds";

// Lazy-load all phases
const LandingPage = dynamic(
  () =>
    import("@/components/landing/LandingPage").then((m) => ({
      default: m.LandingPage,
    })),
  { ssr: false }
);

const FaceScanPage = dynamic(
  () =>
    import("@/components/facescan/FaceScanPage").then((m) => ({
      default: m.FaceScanPage,
    })),
  { ssr: false }
);

const ScannerPage = dynamic(
  () =>
    import("@/components/scanner/ScannerPage").then((m) => ({
      default: m.ScannerPage,
    })),
  { ssr: false }
);

const ResultPage = dynamic(
  () =>
    import("@/components/result/ResultPage").then((m) => ({
      default: m.ResultPage,
    })),
  { ssr: false }
);

type Phase = "landing" | "facescan" | "scanning" | "result";

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>("landing");

  const handleStart = useCallback(() => {
    Sounds.click();
    setTimeout(() => Sounds.scanStart(), 100);
    setPhase("facescan");
  }, []);

  const handleFaceScanComplete = useCallback(() => {
    setPhase("scanning");
  }, []);

  const handleScanComplete = useCallback(() => {
    setPhase("result");
  }, []);

  const handleRestart = useCallback(() => {
    Sounds.click();
    setPhase("landing");
  }, []);

  return (
    <>
      {/* Scanline effect */}
      <div className="scanline" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}

        {phase === "facescan" && (
          <motion.div
            key="facescan"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <FaceScanPage onComplete={handleFaceScanComplete} />
          </motion.div>
        )}

        {phase === "scanning" && (
          <motion.div
            key="scanning"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <ScannerPage onComplete={handleScanComplete} />
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <ResultPage onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
