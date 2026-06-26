"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export function GlowButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled,
  icon,
}: GlowButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-bold rounded-xl cursor-pointer border transition-all duration-300 overflow-hidden select-none";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  const variants = {
    primary:
      "bg-neon-green/10 border-neon-green/40 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/80",
    secondary:
      "bg-neon-purple/10 border-neon-purple/40 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple/80",
    ghost:
      "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={cn(base, sizes[size], variants[variant], className)}
      style={
        variant === "primary"
          ? {
              boxShadow: "0 0 20px rgba(0, 255, 136, 0.15)",
            }
          : variant === "secondary"
          ? { boxShadow: "0 0 20px rgba(191, 0, 255, 0.15)" }
          : {}
      }
    >
      {/* Shimmer overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
