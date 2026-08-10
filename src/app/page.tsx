import AnalyzerForm from "@/components/AnalyzerForm";
import SpectrumMark from "@/components/SpectrumMark";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2.5">
          <SpectrumMark className="h-7 w-7 shrink-0" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Media Lean Check
          </span>
        </div>
        <a
          href="https://github.com/donovanm316-del/media-lean-check"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
          aria-label="View source on GitHub"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
          </svg>
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-center gap-3 pb-8 pt-2 text-center sm:pb-10 sm:pt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            Which way does this article lean?
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste an article or drop in a URL. This tool scans for politically-coded phrasing
            (e.g. &ldquo;undocumented immigrants&rdquo; vs. &ldquo;illegal aliens&rdquo;) commonly
            associated with Democratic- or Republican-leaning framing, and shows you exactly what it
            found — no black box.
          </p>
          <p className="max-w-lg text-xs leading-relaxed text-zinc-400 dark:text-zinc-600">
            A simple keyword-based heuristic, not an AI judgment or a fact-check. It can miss bias
            entirely or misfire on quoted speech. Use it as a starting point, not a conclusion.
          </p>
        </div>

        <AnalyzerForm />
      </main>

      <footer className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-2 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
          <p>Free, no API keys, no tracking — the whole thing runs as a static term-matching heuristic.</p>
          <a
            href="https://github.com/donovanm316-del/media-lean-check"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-500 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700 dark:text-zinc-500 dark:decoration-zinc-700 dark:hover:text-zinc-300"
          >
            View source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
