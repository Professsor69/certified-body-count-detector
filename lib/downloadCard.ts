import type { ScanResult } from "@/lib/resultGenerator";

/**
 * Download the result card as a PNG image.
 * Works around html2canvas's lack of oklch/oklab support (Tailwind v4)
 * by rendering the card content onto a custom canvas instead.
 */
export async function downloadResultCard(
  result: ScanResult,
  elementId = "result-card"
): Promise<void> {
  if (typeof window === "undefined") return;

  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Temporarily force all computed colors to safe hex values
    // by injecting a style override that replaces oklab/oklch
    const style = document.createElement("style");
    style.id = "__download-patch__";
    style.textContent = `
      #result-card, #result-card * {
        --tw-bg-opacity: 1 !important;
        color: inherit !important;
      }
    `;
    document.head.appendChild(style);

    // Walk every element and replace any oklch/oklab background/color
    // with their computed fallback
    const allEls = element.querySelectorAll<HTMLElement>("*");
    const overrides: Array<{ el: HTMLElement; props: Record<string, string> }> = [];

    allEls.forEach((el) => {
      const cs = window.getComputedStyle(el);
      const propsToCheck = [
        "backgroundColor",
        "color",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
        "outlineColor",
        "boxShadow",
      ] as const;

      const patch: Record<string, string> = {};
      let needsPatch = false;

      propsToCheck.forEach((prop) => {
        const val = cs[prop];
        if (val && (val.includes("oklch") || val.includes("oklab"))) {
          patch[prop] = "transparent";
          needsPatch = true;
        }
      });

      if (needsPatch) {
        const saved: Record<string, string> = {};
        Object.keys(patch).forEach((prop) => {
          saved[prop] = (el.style as any)[prop];
          (el.style as any)[prop] = patch[prop];
        });
        overrides.push({ el, props: saved });
      }
    });

    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(element, {
      backgroundColor: "#030712",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      ignoreElements: (el) =>
        el.id === "share-buttons" || el.tagName === "VIDEO",
      onclone: (doc) => {
        // In cloned doc, forcibly replace any oklch colors on all elements
        doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
          const style = el.getAttribute("style") || "";
          if (style.includes("oklch") || style.includes("oklab")) {
            el.setAttribute(
              "style",
              style
                .replace(/oklch\([^)]+\)/g, "transparent")
                .replace(/oklab\([^)]+\)/g, "transparent")
            );
          }
        });
      },
    });

    // Restore overridden styles
    overrides.forEach(({ el, props }) => {
      Object.keys(props).forEach((prop) => {
        (el.style as any)[prop] = props[prop];
      });
    });

    // Remove style patch
    document.getElementById("__download-patch__")?.remove();

    // Add watermark
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "bold 22px monospace";
      ctx.fillStyle = "rgba(0, 255, 136, 0.4)";
      ctx.textAlign = "right";
      ctx.fillText(
        "✦ CertifiedBodyCountDetector",
        canvas.width - 24,
        canvas.height - 24
      );
    }

    const link = document.createElement("a");
    link.download = `body-count-${result.bodyCount}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Download failed:", err);
    alert(
      "Screenshot download failed. Try right-clicking the card and saving the image manually."
    );
  }
}
