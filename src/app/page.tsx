import AnalyzerForm from "@/components/AnalyzerForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Media Lean Check
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste an article or drop in a URL. This tool scans for politically-coded phrasing
            (e.g. &ldquo;undocumented immigrants&rdquo; vs. &ldquo;illegal aliens&rdquo;) commonly
            associated with Democratic- or Republican-leaning framing, and shows you exactly what it
            found — no black box.
          </p>
          <p className="max-w-lg text-xs leading-relaxed text-zinc-400 dark:text-zinc-600">
            This is a simple keyword-based heuristic, not an AI judgment or a fact-check. It can miss
            bias entirely or misfire on quoted speech. Use it as a starting point, not a conclusion.
          </p>
        </div>

        <AnalyzerForm />
      </main>
    </div>
  );
}
