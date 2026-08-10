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
  explanation: string[];
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

function phraseList(terms: MatchedTerm[]): string {
  return terms.map((t) => `"${t.phrase}"${t.count > 1 ? ` (×${t.count})` : ""}`).join(", ");
}

function buildExplanation(
  matched: MatchedTerm[],
  leftWeight: number,
  rightWeight: number,
  score: number,
  confidence: AnalysisResult["confidence"]
): string[] {
  if (matched.length === 0) {
    return [
      "No politically-loaded phrases from this tool's reference list showed up in the text, so no lean — in either direction — could be detected.",
      "That's a statement about this word list, not a certificate of neutrality: framing can happen through story selection, sourcing, and tone in ways no keyword list catches.",
    ];
  }

  const paragraphs: string[] = [];

  if (Math.abs(score) < 5) {
    paragraphs.push(
      `Democratic-coded and Republican-coded phrasing were roughly balanced (${leftWeight} vs. ${rightWeight} weighted points), so the overall score sits near neutral even though loaded language is present on both sides.`
    );
  } else {
    const winningSide = score > 0 ? "Republican" : "Democratic";
    const winningWeight = score > 0 ? rightWeight : leftWeight;
    const losingWeight = score > 0 ? leftWeight : rightWeight;
    paragraphs.push(
      `The text leans ${winningSide}-coded: ${winningWeight} weighted points of ${winningSide}-associated phrasing versus ${losingWeight} points the other way, across ${matched.length} matched phrase${matched.length === 1 ? "" : "s"}.`
    );
  }

  const topicMap = new Map<string, { left: MatchedTerm[]; right: MatchedTerm[]; leftW: number; rightW: number }>();
  for (const m of matched) {
    if (!topicMap.has(m.topic)) topicMap.set(m.topic, { left: [], right: [], leftW: 0, rightW: 0 });
    const t = topicMap.get(m.topic)!;
    if (m.side === "left") {
      t.left.push(m);
      t.leftW += m.weight * m.count;
    } else {
      t.right.push(m);
      t.rightW += m.weight * m.count;
    }
  }

  const topics = [...topicMap.entries()]
    .sort((a, b) => b[1].leftW + b[1].rightW - (a[1].leftW + a[1].rightW))
    .slice(0, 5);

  for (const [topic, t] of topics) {
    if (t.left.length > 0 && t.right.length > 0) {
      if (t.leftW === t.rightW) {
        paragraphs.push(
          `On ${topic}, phrasing is evenly split: ${phraseList(t.left)} (Democratic-coded) against ${phraseList(t.right)} (Republican-coded).`
        );
      } else {
        const stronger = t.rightW > t.leftW ? "Republican" : "Democratic";
        paragraphs.push(
          `On ${topic}, ${stronger}-coded phrasing outweighs the other side: ${phraseList(t.right)} vs. ${phraseList(t.left)}.`
        );
      }
    } else if (t.right.length > 0) {
      paragraphs.push(`On ${topic}, only Republican-coded phrasing appeared: ${phraseList(t.right)}.`);
    } else {
      paragraphs.push(`On ${topic}, only Democratic-coded phrasing appeared: ${phraseList(t.left)}.`);
    }
  }

  const confidenceNote: Record<AnalysisResult["confidence"], string> = {
    low: "Only a handful of loaded phrases were found relative to typical article length, so treat this score as low-confidence — a single quoted speaker could be driving most of it.",
    moderate: "There's a moderate amount of evidence behind this score. Worth skimming the matched phrases yourself before drawing conclusions.",
    high: "This score is backed by a substantial number of matches, though the method still can't distinguish a reporter's framing from a quoted source's words.",
  };
  paragraphs.push(confidenceNote[confidence]);

  return paragraphs;
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
    explanation: buildExplanation(matched, leftWeight, rightWeight, score, confidence),
  };
}
