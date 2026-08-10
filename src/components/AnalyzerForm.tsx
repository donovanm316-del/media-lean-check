"use client";

import { useState, type FormEvent } from "react";

type Mode = "url" | "text";

interface MatchedTerm {
  phrase: string;
  side: "left" | "right";
  weight: number;
  topic: string;
  count: number;
}

interface AnalysisResponse {
  score: number;
  label: string;
  confidence: "low" | "moderate" | "high";
  wordCount: number;
  leftWeight: number;
  rightWeight: number;
  matched: MatchedTerm[];
  outlet: { domain: string; lean: string } | null;
  title: string | null;
  truncated: boolean;
}

const OUTLET_LEAN_LABEL: Record<string, string> = {
  left: "Left",
  "lean-left": "Lean Left",
  center: "Center",
  "lean-right": "Lean Right",
  right: "Right",
};

export default function AnalyzerForm() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "url" ? { url } : { text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error — couldn't reach the analyzer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              mode === "url"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            Article URL
          </button>
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              mode === "text"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            Paste text
          </button>
        </div>

        {mode === "url" ? (
          <input
            type="url"
            required
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        ) : (
          <textarea
            required
            placeholder="Paste the article text here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {result && <Results result={result} />}
    </div>
  );
}

function Results({ result }: { result: AnalysisResponse }) {
  const clamped = Math.max(-100, Math.min(100, result.score));
  const markerPct = (clamped + 100) / 2;

  return (
    <div className="mt-8 flex flex-col gap-6 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      {result.title && (
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{result.title}</div>
      )}

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-lg font-semibold">{result.label}</span>
          <ConfidenceBadge confidence={result.confidence} />
        </div>
        <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-blue-500 via-zinc-300 to-red-500 dark:via-zinc-600">
          <div
            className="absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow dark:bg-white"
            style={{ left: `${markerPct}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Democratic-leaning framing</span>
          <span>Republican-leaning framing</span>
        </div>
      </div>

      {result.outlet && (
        <div className="rounded-lg bg-zinc-50 px-4 py-2 text-sm dark:bg-zinc-900">
          Reference: <strong>{result.outlet.domain}</strong> is generally perceived as{" "}
          <strong>{OUTLET_LEAN_LABEL[result.outlet.lean]}</strong>. This is a general public-perception
          reference, not a judgment on this specific article.
        </div>
      )}

      {result.matched.length > 0 ? (
        <div>
          <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Loaded phrases found ({result.matched.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matched.map((m) => (
              <span
                key={m.phrase}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  m.side === "left"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                }`}
                title={`topic: ${m.topic}, weight: ${m.weight}, occurrences: ${m.count}`}
              >
                {m.phrase}
                {m.count > 1 ? ` ×${m.count}` : ""}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          No politically-loaded phrases from the reference list were found in this text.
        </div>
      )}

      <div className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {result.wordCount.toLocaleString()} words analyzed{result.truncated ? " (truncated to first 50,000 characters)" : ""}.
        This tool counts known partisan-coded phrases — it doesn&apos;t understand context, sarcasm, or
        quotation vs. endorsement, and its word list is necessarily incomplete. Treat the result as a
        rough signal to prompt your own critical reading, not a verdict.
      </div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: AnalysisResponse["confidence"] }) {
  const styles: Record<AnalysisResponse["confidence"], string> = {
    low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    moderate: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    high: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  };
  const text: Record<AnalysisResponse["confidence"], string> = {
    low: "Low evidence",
    moderate: "Moderate evidence",
    high: "High evidence",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[confidence]}`}>{text[confidence]}</span>;
}
