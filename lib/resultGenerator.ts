import { StatDefinition, STATS } from "@/data/stats";
import { VERDICTS } from "@/data/verdicts";
import { OBSERVATIONS } from "@/data/observations";
import { pickRandom, pickMultipleRandom, shuffleArray, rollRareEvent } from "@/lib/utils";

export interface StatResult {
  name: string;
  emoji: string;
  value: number;
  label: string;
  color: string;
}

export interface ScanResult {
  verdict: string;
  bodyCount: number;
  bodyCountTier: "zero" | "low" | "mid" | "high" | "danger" | "legendary";
  stats: StatResult[];
  observations: string[];
  rareEvent: "gold" | "rainbow" | null;
  timestamp: string;
}

// Iconic numbers that appear slightly more often for meme effect
const ICONIC_NUMBERS = [0, 1, 69, 100, 420, 666, 999];

function generateBodyCount(): number {
  // 8% chance of getting an iconic number
  if (Math.random() < 0.08) {
    return ICONIC_NUMBERS[Math.floor(Math.random() * ICONIC_NUMBERS.length)];
  }
  // Otherwise weighted towards lower numbers (funnier contrast with high verdict)
  const roll = Math.random();
  if (roll < 0.25) return Math.floor(Math.random() * 5);          // 0–4
  if (roll < 0.50) return Math.floor(Math.random() * 20) + 5;     // 5–24
  if (roll < 0.70) return Math.floor(Math.random() * 50) + 25;    // 25–74
  if (roll < 0.85) return Math.floor(Math.random() * 125) + 75;   // 75–199
  if (roll < 0.95) return Math.floor(Math.random() * 300) + 200;  // 200–499
  return Math.floor(Math.random() * 500) + 500;                   // 500–999
}

function getBodyCountTier(count: number): ScanResult["bodyCountTier"] {
  if (count === 0) return "zero";
  if (count <= 5) return "low";
  if (count <= 50) return "mid";
  if (count <= 150) return "high";
  if (count <= 500) return "danger";
  return "legendary";
}

export function generateResult(): ScanResult {
  // Pick 8 random stats
  const shuffledStats = shuffleArray(STATS) as StatDefinition[];
  const selectedStats = shuffledStats.slice(0, 8);

  const stats: StatResult[] = selectedStats.map((stat) => {
    const generated = stat.generate();
    return {
      name: stat.name,
      emoji: stat.emoji,
      ...generated,
    };
  });

  const rareEvent = rollRareEvent();
  const bodyCount = generateBodyCount();
  const bodyCountTier = getBodyCountTier(bodyCount);

  let verdict = pickRandom(VERDICTS);
  if (rareEvent === "rainbow") {
    verdict = "THE CHOSEN ONE";
  } else if (rareEvent === "gold") {
    verdict = pickRandom([
      "Certified Legend",
      "Golden-Tier Human",
      "Ultra Rare Specimen",
      "The Golden One",
    ]);
  }

  const observations = pickMultipleRandom(OBSERVATIONS, 3);

  return {
    verdict,
    bodyCount,
    bodyCountTier,
    stats,
    observations,
    rareEvent,
    timestamp: new Date().toLocaleString(),
  };
}
