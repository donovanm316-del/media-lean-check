import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";

export interface ExtractedArticle {
  title: string;
  text: string;
  siteUrl: string;
}

export class ExtractError extends Error {}

export async function extractFromUrl(url: string): Promise<ExtractedArticle> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new ExtractError("That doesn't look like a valid URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ExtractError("Only http/https URLs are supported.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let html: string;
  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        // A realistic browser-like request signature — this is a plain text
        // fetch for readability extraction, not an attempt to solve
        // challenges or impersonate an authenticated session. Some sites
        // still block it outright; that's a real limitation, not a bug.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (res.status === 401 || res.status === 403) {
      throw new ExtractError(
        "This site blocked the request (HTTP " +
          res.status +
          "). Many news sites block automated fetches or require a subscription — paste the article text instead."
      );
    }
    if (res.status === 404) {
      throw new ExtractError("That page doesn't exist (HTTP 404) — double-check the URL.");
    }
    if (!res.ok) {
      throw new ExtractError(`Fetching the article failed (HTTP ${res.status}).`);
    }
    html = await res.text();
  } catch (err) {
    if (err instanceof ExtractError) throw err;
    throw new ExtractError("Couldn't fetch that URL. It may block automated requests — try pasting the text instead.");
  } finally {
    clearTimeout(timeout);
  }

  const { document } = parseHTML(html);
  const reader = new Readability(document as unknown as Document);
  const article = reader.parse();

  if (!article || !article.textContent || article.textContent.trim().length < 200) {
    throw new ExtractError(
      "Couldn't extract readable article text from that page (it may be paywalled or JS-rendered)."
    );
  }

  return {
    title: article.title ?? parsed.hostname,
    text: article.textContent.trim(),
    siteUrl: parsed.toString(),
  };
}
