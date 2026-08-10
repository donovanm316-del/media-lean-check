import { NextResponse } from "next/server";
import { extractFromUrl, ExtractError } from "@/lib/extract";
import { analyzeText } from "@/lib/analyze";

export const runtime = "nodejs";

interface AnalyzeBody {
  url?: string;
  text?: string;
}

const MAX_TEXT_LENGTH = 50_000;

export async function POST(request: Request) {
  let body: AnalyzeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  const pastedText = typeof body.text === "string" ? body.text.trim() : "";

  if (!url && !pastedText) {
    return NextResponse.json({ error: "Provide either a URL or pasted article text." }, { status: 400 });
  }

  let text: string;
  let title: string | null = null;
  let sourceUrl: string | undefined;

  if (url) {
    try {
      const article = await extractFromUrl(url);
      text = article.text;
      title = article.title;
      sourceUrl = article.siteUrl;
    } catch (err) {
      const message = err instanceof ExtractError ? err.message : "Failed to fetch or parse that URL.";
      return NextResponse.json({ error: message }, { status: 422 });
    }
  } else {
    text = pastedText;
  }

  if (text.length < 100) {
    return NextResponse.json(
      { error: "Not enough text to analyze — need at least ~100 characters." },
      { status: 422 }
    );
  }

  const truncated = text.length > MAX_TEXT_LENGTH;
  const analyzed = truncated ? text.slice(0, MAX_TEXT_LENGTH) : text;

  const result = analyzeText(analyzed, sourceUrl);

  return NextResponse.json({
    ...result,
    title,
    truncated,
  });
}
