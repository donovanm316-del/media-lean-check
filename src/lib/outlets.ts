// Static reference table of general public perception of outlet lean.
//
// These categories reflect broad, commonly-cited public perception (the
// kind of consensus you'd see triangulating multiple published media-bias
// trackers) — NOT a scrape or reproduction of any single ranking service,
// and not this tool's own editorial judgment. Treat it as a rough prior,
// not a verdict: individual articles from any outlet can cut against its
// typical house lean. Shown as a secondary reference alongside the text
// analysis, never as the headline result.

export type OutletLean =
  | "left"
  | "lean-left"
  | "center"
  | "lean-right"
  | "right";

export const OUTLET_LEAN: Record<string, OutletLean> = {
  "motherjones.com": "left",
  "thenation.com": "left",
  "huffpost.com": "left",
  "jacobin.com": "left",
  "msnbc.com": "left",
  "vox.com": "lean-left",
  "slate.com": "lean-left",
  "salon.com": "left",
  "nytimes.com": "lean-left",
  "washingtonpost.com": "lean-left",
  "cnn.com": "lean-left",
  "theguardian.com": "lean-left",
  "npr.org": "lean-left",
  "theatlantic.com": "lean-left",
  "politico.com": "center",
  "axios.com": "center",
  "apnews.com": "center",
  "reuters.com": "center",
  "bbc.com": "center",
  "usatoday.com": "center",
  "thehill.com": "center",
  "wsj.com": "lean-right",
  "nypost.com": "lean-right",
  "washingtonexaminer.com": "lean-right",
  "foxnews.com": "right",
  "foxbusiness.com": "right",
  "breitbart.com": "right",
  "dailywire.com": "right",
  "nationalreview.com": "lean-right",
  "theblaze.com": "right",
  "newsmax.com": "right",
  "oann.com": "right",
  "washingtontimes.com": "lean-right",
};

export function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function lookupOutletLean(url: string): { domain: string; lean: OutletLean } | null {
  try {
    const hostname = normalizeHostname(new URL(url).hostname);
    if (OUTLET_LEAN[hostname]) {
      return { domain: hostname, lean: OUTLET_LEAN[hostname] };
    }
    return null;
  } catch {
    return null;
  }
}
