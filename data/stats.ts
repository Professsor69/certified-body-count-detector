export interface StatDefinition {
  name: string;
  emoji: string;
  generate: () => { value: number; label: string; color: string };
}

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getColor = (value: number): string => {
  if (value >= 80) return "#00ff88";
  if (value >= 60) return "#00ccff";
  if (value >= 40) return "#bf00ff";
  if (value >= 20) return "#ff6b00";
  return "#ff0040";
};

const getLabelByValue = (
  value: number,
  labels: [number, string][]
): string => {
  const sorted = [...labels].sort((a, b) => b[0] - a[0]);
  return sorted.find(([threshold]) => value >= threshold)?.[1] ?? labels[0][1];
};

export const STATS: StatDefinition[] = [
  {
    name: "Aura Score",
    emoji: "✨",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Godlike Aura"],
          [70, "Strong Presence"],
          [50, "Questionable Vibes"],
          [30, "Aura Deficit"],
          [0, "Zero Aura"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "IQ Level",
    emoji: "🧠",
    generate: () => {
      const value = randomInt(1, 200);
      return {
        value: Math.min(value, 100),
        label: getLabelByValue(Math.min(value, 100), [
          [90, "Genius Territory"],
          [70, "Above Average"],
          [50, "Functional"],
          [30, "Concerning"],
          [0, "Needs GPS for Life"],
        ]),
        color: getColor(Math.min(value, 100)),
      };
    },
  },
  {
    name: "NPC Level",
    emoji: "🤖",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Full NPC Mode"],
          [70, "Scripted Responses"],
          [50, "Semi-Autonomous"],
          [30, "Low NPC Energy"],
          [0, "Free Thinker"],
        ]),
        color: value > 70 ? "#ff0040" : getColor(100 - value),
      };
    },
  },
  {
    name: "Sigma Level",
    emoji: "😎",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Lone Wolf Supreme"],
          [70, "Sigma Grindset"],
          [50, "Mid Sigma"],
          [30, "Beta Tendencies"],
          [0, "Training Arc"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Gym Consistency",
    emoji: "💪",
    generate: () => {
      const value = randomInt(0, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Absolute Unit"],
          [70, "Actually Goes"],
          [50, "Tried Once"],
          [20, "Starting Monday"],
          [0, "Gym Who?"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Luck Stat",
    emoji: "🍀",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Born Blessed"],
          [70, "Usually Fine"],
          [50, "Coin Flip Life"],
          [30, "Unlucky"],
          [0, "Cursed"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Confidence",
    emoji: "🦁",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Delusionally Confident"],
          [70, "Self-Assured"],
          [50, "Selective Confidence"],
          [30, "Needs Validation"],
          [0, "Zero Self-Esteem"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Sleep Quality",
    emoji: "😴",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Coma-Level Rest"],
          [70, "Decent Sleep"],
          [50, "Survived"],
          [30, "Sleep-Deprived"],
          [0, "Doesn't Sleep"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Academic Damage",
    emoji: "📚",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Catastrophic"],
          [70, "Significant"],
          [50, "Manageable"],
          [30, "Minor"],
          [0, "Nerd Alert"],
        ]),
        color: value > 70 ? "#ff0040" : "#00ff88",
      };
    },
  },
  {
    name: "Social Battery",
    emoji: "🔋",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Fully Charged"],
          [70, "Good Vibes"],
          [50, "Low Energy"],
          [20, "Critical Level"],
          [0, "Power Off"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Chaos Energy",
    emoji: "🌪️",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Absolute Chaos"],
          [70, "Unpredictable"],
          [50, "Controlled Chaos"],
          [30, "Mild Disorder"],
          [0, "Suspiciously Calm"],
        ]),
        color: value > 80 ? "#ff007f" : "#bf00ff",
      };
    },
  },
  {
    name: "Rizz",
    emoji: "🔥",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Unspoken Rizz"],
          [70, "Has Game"],
          [50, "Situational Rizz"],
          [30, "No Rizz"],
          [0, "Negative Rizz"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Delusion Level",
    emoji: "🌈",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Maximum Delusion"],
          [70, "Heavily Deluded"],
          [50, "Mildly Delusional"],
          [30, "Grounded-ish"],
          [0, "Painfully Realistic"],
        ]),
        color: value > 70 ? "#ff007f" : "#bf00ff",
      };
    },
  },
  {
    name: "Productivity",
    emoji: "⚡",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Machine Mode"],
          [70, "On Fire"],
          [50, "Occasionally Works"],
          [30, "Mostly Vibes"],
          [0, "Productive Void"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Brain Cells",
    emoji: "🫠",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Einstein Mode"],
          [70, "Functioning"],
          [50, "Half Working"],
          [20, "Critical Loss"],
          [0, "Total Drain"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Touch Grass Score",
    emoji: "🌿",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Farmer Energy"],
          [70, "Goes Outside"],
          [50, "Rare Sighting"],
          [20, "Basement Dweller"],
          [0, "What Is Outside?"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Overthinking",
    emoji: "💭",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Premium Overthink"],
          [70, "Constant Analysis"],
          [50, "Selective Overthink"],
          [30, "Chill-ish"],
          [0, "Blissfully Unaware"],
        ]),
        color: value > 70 ? "#ff007f" : "#00ccff",
      };
    },
  },
  {
    name: "Wallet Status",
    emoji: "💸",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Generational Wealth"],
          [70, "Comfortable"],
          [50, "Surviving"],
          [20, "Broke but Vibing"],
          [0, "Thoughts & Prayers"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Coffee Dependency",
    emoji: "☕",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "IV Drip Required"],
          [70, "Coffee-Powered"],
          [50, "Functional Addict"],
          [30, "Casual Consumer"],
          [0, "Tea Person"],
        ]),
        color: "#ff6b00",
      };
    },
  },
  {
    name: "Main Character Energy",
    emoji: "⭐",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Full Protagonist"],
          [70, "Strong Energy"],
          [50, "Recurring Character"],
          [30, "Background Extra"],
          [0, "Plot Device"],
        ]),
        color: value > 70 ? "#ffd700" : getColor(value),
      };
    },
  },
  {
    name: "Future CEO Chance",
    emoji: "💼",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "LinkedIn Royalty"],
          [70, "Entrepreneur Energy"],
          [50, "Middle Management"],
          [30, "Employee of the Month"],
          [0, "Freelance Vibes"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Chance of Becoming Rich",
    emoji: "🤑",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Inevitable"],
          [70, "High Potential"],
          [50, "Working On It"],
          [20, "Manifestation Only"],
          [0, "Lottery Dependent"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Motivation Level",
    emoji: "🚀",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Unstoppable Force"],
          [70, "Highly Driven"],
          [50, "Intermittently Motivated"],
          [20, "Demotivated"],
          [0, "Motivation.exe Crashed"],
        ]),
        color: getColor(value),
      };
    },
  },
  {
    name: "Risk of Missing Alarm",
    emoji: "⏰",
    generate: () => {
      const value = randomInt(1, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Guaranteed Miss"],
          [70, "High Risk"],
          [50, "50/50 Gamble"],
          [30, "Usually Awake"],
          [0, "Morning Person"],
        ]),
        color: value > 70 ? "#ff0040" : "#00ff88",
      };
    },
  },
  {
    name: "Ordering Food Probability",
    emoji: "🍕",
    generate: () => {
      const value = randomInt(30, 100);
      return {
        value,
        label: getLabelByValue(value, [
          [90, "Inevitable"],
          [70, "Very Likely"],
          [50, "Considering It"],
          [30, "Maybe Cooking"],
          [0, "Discipline Mode"],
        ]),
        color: "#ff6b00",
      };
    },
  },
];
