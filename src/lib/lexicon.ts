// Curated pairs of politically-loaded framing terms.
//
// These are not "bad words" — they're phrasing choices that U.S. political
// journalism and linguistics research (e.g. framing studies on immigration,
// abortion, and gun-policy coverage) commonly associate with one side's
// preferred framing over the other's neutral-sounding alternative. A single
// match means very little; the tool only speaks in terms of overall density
// and balance across many matches. Weight is a rough 1-3 scale for how
// strongly a term skews toward one side (3 = strongly associated, 1 = mild).

export type Side = "left" | "right";

export interface LexiconEntry {
  phrase: string;
  side: Side;
  weight: 1 | 2 | 3;
  topic: string;
}

// Matching is case-insensitive, word-boundary-aware, on the raw phrase text.
export const LEXICON: LexiconEntry[] = [
  // Immigration
  { phrase: "undocumented immigrants", side: "left", weight: 2, topic: "immigration" },
  { phrase: "undocumented workers", side: "left", weight: 2, topic: "immigration" },
  { phrase: "asylum seekers", side: "left", weight: 1, topic: "immigration" },
  { phrase: "newcomers", side: "left", weight: 1, topic: "immigration" },
  { phrase: "pathway to citizenship", side: "left", weight: 1, topic: "immigration" },
  { phrase: "illegal aliens", side: "right", weight: 3, topic: "immigration" },
  { phrase: "illegal immigrants", side: "right", weight: 2, topic: "immigration" },
  { phrase: "illegals", side: "right", weight: 3, topic: "immigration" },
  { phrase: "border crisis", side: "right", weight: 2, topic: "immigration" },
  { phrase: "invasion at the border", side: "right", weight: 3, topic: "immigration" },
  { phrase: "open borders", side: "right", weight: 2, topic: "immigration" },
  { phrase: "chain migration", side: "right", weight: 2, topic: "immigration" },
  { phrase: "sanctuary city", side: "right", weight: 1, topic: "immigration" },

  // Abortion
  { phrase: "pro-choice", side: "left", weight: 2, topic: "abortion" },
  { phrase: "reproductive rights", side: "left", weight: 2, topic: "abortion" },
  { phrase: "reproductive freedom", side: "left", weight: 2, topic: "abortion" },
  { phrase: "abortion rights", side: "left", weight: 1, topic: "abortion" },
  { phrase: "bodily autonomy", side: "left", weight: 2, topic: "abortion" },
  { phrase: "forced birth", side: "left", weight: 3, topic: "abortion" },
  { phrase: "pro-life", side: "right", weight: 2, topic: "abortion" },
  { phrase: "unborn child", side: "right", weight: 2, topic: "abortion" },
  { phrase: "unborn baby", side: "right", weight: 2, topic: "abortion" },
  { phrase: "partial-birth abortion", side: "right", weight: 3, topic: "abortion" },
  { phrase: "abortion on demand", side: "right", weight: 3, topic: "abortion" },
  { phrase: "sanctity of life", side: "right", weight: 2, topic: "abortion" },

  // Guns
  { phrase: "gun violence", side: "left", weight: 1, topic: "guns" },
  { phrase: "gun safety", side: "left", weight: 2, topic: "guns" },
  { phrase: "assault weapon", side: "left", weight: 2, topic: "guns" },
  { phrase: "common-sense gun laws", side: "left", weight: 3, topic: "guns" },
  { phrase: "gun lobby", side: "left", weight: 2, topic: "guns" },
  { phrase: "second amendment rights", side: "right", weight: 2, topic: "guns" },
  { phrase: "law-abiding gun owners", side: "right", weight: 3, topic: "guns" },
  { phrase: "gun grab", side: "right", weight: 3, topic: "guns" },
  { phrase: "right to bear arms", side: "right", weight: 1, topic: "guns" },
  { phrase: "self-defense rights", side: "right", weight: 2, topic: "guns" },

  // Taxes / economy
  { phrase: "tax cuts for the rich", side: "left", weight: 3, topic: "economy" },
  { phrase: "fair share", side: "left", weight: 2, topic: "economy" },
  { phrase: "income inequality", side: "left", weight: 1, topic: "economy" },
  { phrase: "corporate greed", side: "left", weight: 3, topic: "economy" },
  { phrase: "billionaire class", side: "left", weight: 3, topic: "economy" },
  { phrase: "living wage", side: "left", weight: 2, topic: "economy" },
  { phrase: "job creators", side: "right", weight: 3, topic: "economy" },
  { phrase: "tax relief", side: "right", weight: 2, topic: "economy" },
  { phrase: "big government", side: "right", weight: 2, topic: "economy" },
  { phrase: "government overreach", side: "right", weight: 2, topic: "economy" },
  { phrase: "free market", side: "right", weight: 1, topic: "economy" },
  { phrase: "job-killing regulations", side: "right", weight: 3, topic: "economy" },
  { phrase: "welfare state", side: "right", weight: 2, topic: "economy" },

  // Healthcare
  { phrase: "medicare for all", side: "left", weight: 1, topic: "healthcare" },
  { phrase: "universal healthcare", side: "left", weight: 1, topic: "healthcare" },
  { phrase: "healthcare is a human right", side: "left", weight: 3, topic: "healthcare" },
  { phrase: "government-run healthcare", side: "right", weight: 2, topic: "healthcare" },
  { phrase: "socialized medicine", side: "right", weight: 3, topic: "healthcare" },
  { phrase: "death panels", side: "right", weight: 3, topic: "healthcare" },
  { phrase: "obamacare", side: "right", weight: 1, topic: "healthcare" },

  // Crime / policing
  { phrase: "mass incarceration", side: "left", weight: 2, topic: "crime" },
  { phrase: "police brutality", side: "left", weight: 2, topic: "crime" },
  { phrase: "systemic racism", side: "left", weight: 2, topic: "crime" },
  { phrase: "criminal justice reform", side: "left", weight: 1, topic: "crime" },
  { phrase: "defund the police", side: "left", weight: 2, topic: "crime" },
  { phrase: "law and order", side: "right", weight: 2, topic: "crime" },
  { phrase: "soft on crime", side: "right", weight: 3, topic: "crime" },
  { phrase: "tough on crime", side: "right", weight: 1, topic: "crime" },
  { phrase: "backing the blue", side: "right", weight: 2, topic: "crime" },
  { phrase: "thin blue line", side: "right", weight: 2, topic: "crime" },
  { phrase: "career criminal", side: "right", weight: 2, topic: "crime" },

  // Climate / energy
  { phrase: "climate crisis", side: "left", weight: 2, topic: "climate" },
  { phrase: "climate emergency", side: "left", weight: 3, topic: "climate" },
  { phrase: "green new deal", side: "left", weight: 1, topic: "climate" },
  { phrase: "big oil", side: "left", weight: 2, topic: "climate" },
  { phrase: "climate deniers", side: "left", weight: 3, topic: "climate" },
  { phrase: "energy independence", side: "right", weight: 2, topic: "climate" },
  { phrase: "drill baby drill", side: "right", weight: 3, topic: "climate" },
  { phrase: "climate alarmists", side: "right", weight: 3, topic: "climate" },
  { phrase: "war on coal", side: "right", weight: 2, topic: "climate" },
  { phrase: "green agenda", side: "right", weight: 2, topic: "climate" },

  // LGBTQ+ / social
  { phrase: "gender-affirming care", side: "left", weight: 2, topic: "social" },
  { phrase: "marriage equality", side: "left", weight: 1, topic: "social" },
  { phrase: "lgbtq rights", side: "left", weight: 1, topic: "social" },
  { phrase: "book bans", side: "left", weight: 2, topic: "social" },
  { phrase: "gender ideology", side: "right", weight: 3, topic: "social" },
  { phrase: "biological sex", side: "right", weight: 2, topic: "social" },
  { phrase: "parental rights", side: "right", weight: 2, topic: "social" },
  { phrase: "traditional family values", side: "right", weight: 2, topic: "social" },
  { phrase: "woke agenda", side: "right", weight: 3, topic: "social" },
  { phrase: "woke ideology", side: "right", weight: 3, topic: "social" },
  { phrase: "cancel culture", side: "right", weight: 2, topic: "social" },
  { phrase: "critical race theory", side: "right", weight: 2, topic: "social" },
  { phrase: "dei", side: "right", weight: 1, topic: "social" },
  { phrase: "radical left", side: "right", weight: 3, topic: "social" },
  { phrase: "far-left", side: "right", weight: 2, topic: "social" },
  { phrase: "far-right", side: "left", weight: 2, topic: "social" },
  { phrase: "maga extremists", side: "left", weight: 3, topic: "social" },
  { phrase: "extremist agenda", side: "left", weight: 2, topic: "social" },
  { phrase: "threat to democracy", side: "left", weight: 2, topic: "social" },
  { phrase: "insurrection", side: "left", weight: 2, topic: "social" },
  { phrase: "deep state", side: "right", weight: 3, topic: "social" },
  { phrase: "fake news", side: "right", weight: 2, topic: "social" },
  { phrase: "mainstream media bias", side: "right", weight: 2, topic: "social" },
  { phrase: "election deniers", side: "left", weight: 2, topic: "social" },
  { phrase: "stolen election", side: "right", weight: 3, topic: "social" },
  { phrase: "big lie", side: "left", weight: 2, topic: "social" },
];

const LOOKUP = LEXICON.map((e) => ({
  ...e,
  regex: new RegExp(`\\b${e.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
}));

export interface MatchedTerm {
  phrase: string;
  side: Side;
  weight: number;
  topic: string;
  count: number;
}

export function scanText(text: string): MatchedTerm[] {
  const matches: MatchedTerm[] = [];
  for (const entry of LOOKUP) {
    const found = text.match(entry.regex);
    if (found && found.length > 0) {
      matches.push({
        phrase: entry.phrase,
        side: entry.side,
        weight: entry.weight,
        topic: entry.topic,
        count: found.length,
      });
    }
  }
  return matches.sort((a, b) => b.weight * b.count - a.weight * a.count);
}
