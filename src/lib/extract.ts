import { JSDOM } from "jsdom";
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
        "User-Agent":
          "Mozilla/5.0 (compatible; MediaLeanCheckBot/1.0; +https://github.com/)",
      },
    });
    if (!res.ok) {
      throw new ExtractError(`Fetching the article failed (HTTP ${res.status}).`);
    }
    html = await res.text();
  } catch (err) {
    if (err instanceof ExtractError) throw err;
    throw new ExtractError("Couldn't fetch that URL. It may block automated requests.");
  } finally {
    clearTimeout(timeout);
  }

  const dom = new JSDOM(html, { url: parsed.toString() });
  const reader = new Readability(dom.window.document);
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
