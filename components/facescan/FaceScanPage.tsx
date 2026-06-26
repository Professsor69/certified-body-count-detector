"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FACE_SCAN_MESSAGES } from "@/data/faceScanMessages";
import { shuffleArray } from "@/lib/utils";
import { Camera, CameraOff, Wifi, AlertTriangle } from "lucide-react";

interface FaceScanPageProps {
  onComplete: () => void;
}

type CameraState = "requesting" | "active" | "denied" | "error";

const SCAN_DURATION = 3800; // 3.8 seconds of scanning

export function FaceScanPage({ onComplete }: FaceScanPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("requesting");
  const [currentMessage, setCurrentMessage] = useState(FACE_SCAN_MESSAGES[0]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLineY, setScanLineY] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [faceDetected, setFaceDetected] = useState(false);
  const messagesRef = useRef(shuffleArray(FACE_SCAN_MESSAGES));
  const messageIndexRef = useRef(0);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Request camera
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraState("active");
      } catch {
        if (mounted) setCameraState("denied");
      }
    };

    startCamera();
    return () => {
      mounted = false;
      stopCamera();
    };
  }, [stopCamera]);

  // Fake face detection pop-in after 0.8s
  useEffect(() => {
    if (cameraState !== "active") return;
    const t = setTimeout(() => setFaceDetected(true), 800);
    return () => clearTimeout(t);
  }, [cameraState]);

  // Scan line animation
  useEffect(() => {
    if (cameraState !== "active" && cameraState !== "denied") return;
    let frame: number;
    let start: number | null = null;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const cycle = elapsed % 1800;
      setScanLineY((cycle / 1800) * 100);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [cameraState]);

  // Progress bar + message rotation
  useEffect(() => {
    if (cameraState !== "active" && cameraState !== "denied") return;

    const startTime = Date.now();
    const msgInterval = setInterval(() => {
      const idx = messageIndexRef.current % messagesRef.current.length;
      setCurrentMessage(messagesRef.current[idx]);
      messageIndexRef.current++;
    }, 900);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SCAN_DURATION) * 100, 100);
      setScanProgress(pct);
      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(msgInterval);
      }
    }, 50);

    const completeTimer = setTimeout(() => {
      stopCamera();
      onComplete();
    }, SCAN_DURATION);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [cameraState, stopCamera, onComplete]);

  // Denied flow — show funny message then auto-continue after 2.5s
  useEffect(() => {
    if (cameraState !== "denied") return;
    const t = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(t);
  }, [cameraState, onComplete]);

  return (
    <div className="relative min-h-screen bg-dark-bg flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background grid */}
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-6 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-xs font-mono mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          CERTIFIED BODY COUNT DETECTOR v2.0.69
        </div>
        <h2
          className="font-display font-black text-xl md:text-2xl"
          style={{
            background: "linear-gradient(135deg, #00ff88, #00ccff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          FACE SCAN INITIATED
        </h2>
      </motion.div>

      {/* Camera / Denied view */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mb-6"
      >
        {/* Camera circle frame */}
        <div
          className="relative overflow-hidden"
          style={{
            width: "min(72vw, 320px)",
            height: "min(72vw, 320px)",
            borderRadius: "50%",
            border: "2px solid rgba(0,255,136,0.4)",
            boxShadow:
              "0 0 40px rgba(0,255,136,0.2), inset 0 0 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Live video */}
          {cameraState === "active" && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          {/* Denied / requesting placeholder */}
          {(cameraState === "denied" || cameraState === "requesting") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-card gap-3">
              {cameraState === "requesting" ? (
                <>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Camera size={48} className="text-neon-green/50" />
                  </motion.div>
                  <p className="text-neon-green/40 text-xs font-mono">Requesting camera...</p>
                </>
              ) : (
                <>
                  <Wifi size={48} className="text-neon-cyan" />
                  <p className="text-neon-cyan text-xs font-mono text-center px-4">
                    Camera denied.<br />Scanning via WiFi instead...
                  </p>
                </>
              )}
            </div>
          )}

          {/* Scan line sweep */}
          {(cameraState === "active" || cameraState === "denied") && (
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: `${scanLineY}%`,
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, rgba(0,255,136,0.9), transparent)",
                boxShadow: "0 0 8px rgba(0,255,136,0.6)",
              }}
            />
          )}

          {/* Dark tint overlay */}
          <div className="absolute inset-0 bg-neon-green/5 pointer-events-none" />
        </div>

        {/* Corner brackets - scan frame decoration */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
          (pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8`} style={{ zIndex: 10 }}>
              <svg width="32" height="32" viewBox="0 0 32 32">
                <path
                  d={
                    i === 0
                      ? "M 2 16 L 2 2 L 16 2"
                      : i === 1
                      ? "M 16 2 L 30 2 L 30 16"
                      : i === 2
                      ? "M 2 16 L 2 30 L 16 30"
                      : "M 16 30 L 30 30 L 30 16"
                  }
                  stroke="#00ff88"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.8"
                />
              </svg>
            </div>
          )
        )}

        {/* Face detection box */}
        <AnimatePresence>
          {faceDetected && cameraState === "active" && (
            <motion.div
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                className="border-2 rounded"
                style={{
                  width: "55%",
                  height: "65%",
                  borderColor: "rgba(0,255,136,0.7)",
                  boxShadow: "0 0 12px rgba(0,255,136,0.3)",
                }}
                animate={{ borderColor: ["rgba(0,255,136,0.7)", "rgba(0,204,255,0.7)", "rgba(0,255,136,0.7)"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Radar rings around the circle */}
        {[1.12, 1.22].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-neon-green/15 pointer-events-none"
            style={{ transform: `scale(${scale})` }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* Status message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center mb-5 h-6"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-neon-green font-mono text-sm"
          >
            {cameraState === "denied"
              ? "📡 Bypassing camera... scanning via satellite..."
              : currentMessage}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Progress bar */}
      {(cameraState === "active" || cameraState === "denied") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 w-full max-w-xs"
        >
          <div className="flex justify-between text-xs font-mono text-neon-green/40 mb-1.5">
            <span>FACE SCAN</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-neon-green/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${scanProgress}%`,
                background: "linear-gradient(90deg, #00ff88, #00ccff)",
                boxShadow: "0 0 10px rgba(0,255,136,0.5)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Warning footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-8 text-white/20 text-xs font-mono text-center"
      >
        ⚠ No data is stored. This is purely for comedy purposes.
      </motion.p>
    </div>
  );
}
