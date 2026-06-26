import type { ScanResult } from "@/lib/resultGenerator";

/**
 * Workaround for html2canvas not supporting oklch/oklab (Tailwind v4).
 * We create an offscreen canvas manually using the DOM element's bounding box
 * and render the card content using a simple canvas-based approach.
 * 
 * For full fidelity, we patch unsupported colors before rendering.
 */
export async function downloadResultCard(
  result: ScanResult,
  elementId = "result-card"
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const html2canvas = (await import("html2canvas")).default;
    const element = document.getElementById(elementId);
    if (!element) return;

    // Temporarily patch oklch/oklab colors to hex equivalents on all elements
    const allElements = element.querySelectorAll<HTMLElement>("*");
    const originalStyles: Array<{
      el: HTMLElement;
      bg: string;
      color: string;
      border: string;
      boxShadow: string;
    }> = [];

    const patchColor = (color: string): string => {
      // Replace oklch/oklab with safe fallbacks
      if (!color || (!color.includes("oklch") && !color.includes("oklab"))) {
        return color;
      }
      // Map common Tailwind v4 oklch values to hex approximations
      if (color.includes("oklch(0.145")) return "#030712"; // bg-dark
      if (color.includes("oklch(1 0 0)")) return "#ffffff"; // white
      if (color.includes("oklch(0 0 0)")) return "#000000"; // black
      return "transparent";
    };

    allElements.forEach((el) => {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const color = cs.color;
      const border = cs.borderColor;
      const boxShadow = cs.boxShadow;

      const patchedBg = patchColor(bg);
      const patchedColor = patchColor(color);
      const patchedBorder = patchColor(border);

      if (
        patchedBg !== bg ||
        patchedColor !== color ||
        patchedBorder !== border
      ) {
        originalStyles.push({ el, bg, color, border, boxShadow });
        if (patchedBg !== bg) el.style.backgroundColor = patchedBg;
        if (patchedColor !== color) el.style.color = patchedColor;
        if (patchedBorder !== border) el.style.borderColor = patchedBorder;
      }
    });

    const canvas = await html2canvas(element, {
      backgroundColor: "#030712",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      ignoreElements: (el) => el.id === "share-buttons",
    });

    // Restore original styles
    originalStyles.forEach(({ el, bg, color, border }) => {
      el.style.backgroundColor = "";
      el.style.color = "";
      el.style.borderColor = "";
    });

    // Add watermark
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "bold 20px monospace";
      ctx.fillStyle = "rgba(0, 255, 136, 0.35)";
      ctx.textAlign = "right";
      ctx.fillText(
        "✦ CertifiedDetector.fun",
        canvas.width - 24,
        canvas.height - 24
      );
    }

    const link = document.createElement("a");
    link.download = `certified-detector-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Download failed:", err);
    // Fallback: show a browser print dialog
    alert(
      "Screenshot download failed. Try right-clicking the result card and selecting 'Save image as'."
    );
  }
}
