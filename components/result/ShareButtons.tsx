"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Download, RefreshCw, Check, Copy } from "lucide-react";
import type { ScanResult } from "@/lib/resultGenerator";
import { downloadResultCard } from "@/lib/downloadCard";

interface ShareButtonsProps {
  result: ScanResult;
  onRegenerate: () => void;
}

export function ShareButtons({ result, onRegenerate }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareText = `🔬 My Certified Detector Results:\n✅ Verdict: ${result.verdict}\n\nFor entertainment only — certifieddetector.fun`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "Certified Detector" });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    await downloadResultCard(result);
    setTimeout(() => setDownloading(false), 1500);
  };

  const buttons = [
    {
      label: "Generate Again",
      icon: <RefreshCw size={16} />,
      onClick: onRegenerate,
      style: {
        background: "linear-gradient(135deg, #00ff88, #00ccff)",
        color: "#030712",
        boxShadow: "0 0 20px rgba(0,255,136,0.3)",
      },
    },
    {
      label: copied ? "Copied!" : "Share Result",
      icon: copied ? <Check size={16} /> : <Share2 size={16} />,
      onClick: handleShare,
      style: {
        background: "rgba(191,0,255,0.15)",
        color: "#bf00ff",
        border: "1px solid rgba(191,0,255,0.4)",
        boxShadow: "0 0 20px rgba(191,0,255,0.15)",
      },
    },
    {
      label: downloading ? "Generating..." : "Download Image",
      icon: <Download size={16} />,
      onClick: handleDownload,
      style: {
        background: "rgba(255,255,255,0.05)",
        color: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.1)",
      },
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {buttons.map((btn, i) => (
        <motion.button
          key={btn.label}
          onClick={btn.onClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          style={btn.style}
        >
          {btn.icon}
          {btn.label}
        </motion.button>
      ))}
    </div>
  );
}
