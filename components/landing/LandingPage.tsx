"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/landing/ParticleBackground";
import { GlowOrbs } from "@/components/landing/GlowOrbs";
import { Zap, Shield, Star } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark-bg">
      <ParticleBackground />
      <GlowOrbs />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-sm font-mono"
        >
          <Shield size={14} />
          <span>CLASSIFIED SYSTEM v2.0.69</span>
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-none mb-4"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          <span
            style={{
              background:
                "linear-gradient(135deg, #00ff88 0%, #00ccff 40%, #bf00ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(0,255,136,0.4))",
            }}
          >
            Certified
          </span>
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #ff007f 0%, #bf00ff 50%, #00ccff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(255,0,127,0.3))",
            }}
          >
            Body Count
          </span>
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #00ff88 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Detector
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/60 font-mono mb-3 tracking-wide"
        >
          100% Fake.{" "}
          <span className="text-neon-green font-bold">1000% Accurate.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-white/30 text-sm font-mono mb-12"
        >
          Powered by advanced AI. Scanning faces worldwide. Definitely not random.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="relative group px-12 py-5 text-xl font-bold font-display rounded-2xl text-dark-bg overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00ff88, #00ccff)",
              boxShadow:
                "0 0 40px rgba(0,255,136,0.4), 0 0 80px rgba(0,255,136,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            {/* Animated shimmer */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative flex items-center gap-3">
              <Zap size={22} />
              Start Scan
            </span>
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-16 flex items-center gap-8 md:gap-12"
        >
          {[
            { label: "Faces Scanned", value: "4.20M+" },
            { label: "Verdicts Issued", value: "200+" },
            { label: "Accuracy", value: "∞%" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-black text-neon-green font-display">
                {stat.value}
              </span>
              <span className="text-white/40 text-xs font-mono mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {[
            "📷 Face Scan",
            "🔒 Private",
            "⚡ Instant",
            "😂 100% Funny",
            "💀 Meme Only",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-mono border border-white/10 bg-white/5 text-white/50"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs font-mono flex items-center gap-2"
      >
        <Star size={10} />
        <span>For entertainment purposes only</span>
        <Star size={10} />
      </motion.div>
    </div>
  );
}
