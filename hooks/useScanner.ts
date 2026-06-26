"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  SCAN_MESSAGES,
  WARNING_MESSAGES,
  TERMINAL_LINES,
} from "@/data/scanMessages";
import { shuffleArray, pickRandom } from "@/lib/utils";

interface ScannerState {
  progress: number;
  currentMessage: string;
  terminalLines: string[];
  warning: string | null;
  isComplete: boolean;
}

export function useScanner(onComplete: () => void) {
  const [state, setState] = useState<ScannerState>({
    progress: 0,
    currentMessage: "Initializing...",
    terminalLines: [],
    warning: null,
    isComplete: false,
  });

  const messagesRef = useRef(shuffleArray(SCAN_MESSAGES));
  const messageIndexRef = useRef(0);
  const progressRef = useRef(0);
  const terminalRef = useRef<string[]>([]);
  const completedRef = useRef(false);

  const addTerminalLine = useCallback((line: string) => {
    terminalRef.current = [...terminalRef.current.slice(-12), line];
    return terminalRef.current;
  }, []);

  useEffect(() => {
    // Total duration: 8–12 seconds (pick randomly)
    const totalDuration = Math.random() * 4000 + 8000; // 8000–12000ms
    const startTime = Date.now();

    // Message rotation every ~600ms
    const messageInterval = setInterval(() => {
      const idx = messageIndexRef.current % messagesRef.current.length;
      const message = messagesRef.current[idx];
      messageIndexRef.current++;

      const newLine = pickRandom(TERMINAL_LINES);
      const lines = addTerminalLine(newLine);

      setState((prev) => ({
        ...prev,
        currentMessage: message,
        terminalLines: [...lines],
      }));
    }, 600);

    // Warning flashes at random moments
    const warningInterval = setInterval(() => {
      if (Math.random() < 0.25 && progressRef.current > 15) {
        const warning = pickRandom(WARNING_MESSAGES);
        setState((prev) => ({ ...prev, warning }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, warning: null }));
        }, 1800);
      }
    }, 2500);

    // Progress driver
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = (elapsed / totalDuration) * 100;

      let progress: number;

      // Slow down between 70–95%
      if (rawProgress < 70) {
        progress = rawProgress * 1.05;
      } else if (rawProgress < 95) {
        // Dramatic slowdown
        progress = 70 + (rawProgress - 70) * 0.3;
      } else {
        progress = 95 + (rawProgress - 95) * 2;
      }

      progress = Math.min(progress, 100);
      progressRef.current = progress;

      if (progress >= 100 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(messageInterval);
        clearInterval(warningInterval);
        clearInterval(progressInterval);

        setState((prev) => ({
          ...prev,
          progress: 100,
          currentMessage: "Analysis Complete.",
          isComplete: true,
          warning: null,
        }));

        setTimeout(() => onComplete(), 800);
        return;
      }

      setState((prev) => ({ ...prev, progress }));
    }, 50);

    return () => {
      clearInterval(messageInterval);
      clearInterval(warningInterval);
      clearInterval(progressInterval);
    };
  }, [addTerminalLine, onComplete]);

  return state;
}
