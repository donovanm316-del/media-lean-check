import { scanText, type MatchedTerm } from "./lexicon";
import { lookupOutletLean, type OutletLean } from "./outlets";

export interface AnalysisResult {
  score: number; // -100 (Democratic-leaning framing) .. +100 (Republican-leaning framing)
  label: string;
  confidence: "low" | "moderate" | "high";
  wordCount: number;
  leftWeight: number;
  rightWeight: number;
  matched: MatchedTerm[];
  outlet: { domain: string; lean: OutletLean } | null;
}

// Smoothing constant: dampens the score toward 0 when there's little evidence,
// so 1-2 stray matches in a long article can't swing the needle to the extreme.
const SMOOTHING = 4;
// Weighted-match total needed to reach "high" confidence.
const HIGH_CONFIDENCE_AT = 10;
const MODERATE_CONFIDENCE_AT = 4;

function labelFor(score: number): string {
  const abs = Math.abs(score);
  const dir = score > 0 ? "Republican-leaning" : "Democratic-leaning";
  if (abs < 5) return "Balanced — no strong partisan framing detected";
  if (abs < 20) return `Slight ${dir} framing`;
  if (abs < 50) return `Moderate ${dir} framing`;
  return `Strong ${dir} framing`;
}

export function analyzeText(text: string, sourceUrl?: string): AnalysisResult {
  const matched = scanText(text);
  const leftWeight = matched
    .filter((m) => m.side === "left")
    .reduce((sum, m) => sum + m.weight * m.count, 0);
  const rightWeight = matched
    .filter((m) => m.side === "right")
    .reduce((sum, m) => sum + m.weight * m.count, 0);

  const totalWeight = leftWeight + rightWeight;
  const raw = rightWeight - leftWeight;
  const score =
    totalWeight === 0 ? 0 : Math.max(-100, Math.min(100, Math.round((100 * raw) / (totalWeight + SMOOTHING))));

  const confidence: AnalysisResult["confidence"] =
    totalWeight >= HIGH_CONFIDENCE_AT ? "high" : totalWeight >= MODERATE_CONFIDENCE_AT ? "moderate" : "low";

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return {
    score,
    label: labelFor(score),
    confidence,
    wordCount,
    leftWeight,
    rightWeight,
    matched,
    outlet: sourceUrl ? lookupOutletLean(sourceUrl) : null,
  };
}
