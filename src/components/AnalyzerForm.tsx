"use client";

import { useId, useState, type FormEvent } from "react";

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
  explanation: string[];
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
  const inputId = useId();

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
    <div className="flex w-full flex-col gap-6">
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div
            role="tablist"
            aria-label="Input mode"
            className="inline-flex w-fit gap-1 rounded-full bg-zinc-100 p-1 text-sm dark:bg-zinc-800/80"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "url"}
              onClick={() => setMode("url")}
              className={`min-h-9 rounded-full px-4 py-1.5 font-medium transition-colors ${
                mode === "url"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Article URL
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "text"}
              onClick={() => setMode("text")}
              className={`min-h-9 rounded-full px-4 py-1.5 font-medium transition-colors ${
                mode === "text"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Paste text
            </button>
          </div>

          <label htmlFor={inputId} className="sr-only">
            {mode === "url" ? "Article URL" : "Article text"}
          </label>
          {mode === "url" ? (
            <input
              id={inputId}
              type="url"
              required
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
            />
          ) : (
            <textarea
              id={inputId}
              required
              placeholder="Paste the article text here…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 sm:w-fit dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </form>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {result && <Results result={result} />}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-zinc-200 dark:bg-zinc-800" />;
}

function Results({ result }: { result: AnalysisResponse }) {
  const clamped = Math.max(-100, Math.min(100, result.score));
  const markerPct = (clamped + 100) / 2;

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
      {result.title && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
            Article
          </div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{result.title}</div>
        </div>
      )}

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{result.label}</span>
          <ConfidenceBadge confidence={result.confidence} />
        </div>
        <div className="relative h-3.5 w-full rounded-full bg-gradient-to-r from-blue-500 via-zinc-300 to-red-500 dark:via-zinc-600">
          <div className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-white/60 dark:bg-black/30" />
          <div
            className="absolute top-1/2 h-6 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 shadow ring-2 ring-white dark:bg-white dark:ring-zinc-950"
            style={{ left: `${markerPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-zinc-500 sm:text-xs dark:text-zinc-400">
          <span>Democratic-leaning</span>
          <span>Republican-leaning</span>
        </div>
      </div>

      {result.explanation.length > 0 && (
        <>
          <Divider />
          <div>
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Why</div>
            <div className="flex flex-col gap-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {result.explanation.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </>
      )}

      {result.outlet && (
        <div className="rounded-lg bg-zinc-50 px-4 py-2.5 text-sm text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
          Reference: <strong className="font-semibold">{result.outlet.domain}</strong> is generally perceived
          as <strong className="font-semibold">{OUTLET_LEAN_LABEL[result.outlet.lean]}</strong>. A general
          public-perception reference, not a judgment on this specific article.
        </div>
      )}

      <Divider />

      {result.matched.length > 0 ? (
        <div>
          <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Loaded phrases found ({result.matched.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matched.map((m) => (
              <span
                key={m.phrase}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  m.side === "left"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                }`}
                title={`topic: ${m.topic}, weight: ${m.weight}, occurrences: ${m.count}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${m.side === "left" ? "bg-blue-500" : "bg-red-500"}`}
                  aria-hidden="true"
                />
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
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${styles[confidence]}`}>
      {text[confidence]}
    </span>
  );
}
