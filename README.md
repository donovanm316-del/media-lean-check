# Media Lean Check

A free, no-API tool that scans an article (by URL or pasted text) for
politically-coded phrasing — e.g. "undocumented immigrants" vs. "illegal
aliens", "gun safety" vs. "second amendment rights" — and shows a transparent
lean score with exactly which phrases drove it.

**No LLM, no paid API, no signup, no rate limits.** The whole thing is a
static term-matching heuristic that runs entirely in a Vercel serverless
function. See [`src/lib/lexicon.ts`](src/lib/lexicon.ts) for the full term
list and [`src/lib/analyze.ts`](src/lib/analyze.ts) for the scoring math.

## How it works

1. You provide a URL or paste article text.
2. If it's a URL, the server fetches the page and extracts the main article
   text with [`@mozilla/readability`](https://github.com/mozilla/readability).
3. The text is scanned against a curated list of partisan-coded phrase pairs
   (immigration, abortion, guns, taxes, healthcare, crime, climate, and more),
   each weighted 1-3 for how strongly it skews toward one side.
4. A score from -100 (Democratic-leaning framing) to +100 (Republican-leaning
   framing) is computed from the weighted balance of matches, damped toward 0
   when there's little evidence so a couple of stray matches in a long
   article can't swing the needle.
5. If the source URL matches a well-known outlet, a general public-perception
   lean reference is shown alongside the score (not folded into it).

## Limitations (read this before trusting a result)

- It's keyword matching, not comprehension — it can't tell a quote from an
  endorsement, doesn't understand sarcasm, and only knows the phrases in its
  list.
- The word list is inherently incomplete and itself a set of editorial
  judgment calls about what counts as "loaded" framing.
- Treat the output as a prompt for your own critical reading, not a
  fact-checked verdict.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables or API keys are required.

## Deploy

Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new) —
zero config needed, it's a stock Next.js app.
