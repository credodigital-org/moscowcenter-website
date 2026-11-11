import React, { createContext, useContext, useMemo } from "react";
import { useCms } from "../lib/cms";

/* Editable website text.

   <T k="home.top-banner.book-a-consultation-ab12" d="Book a Consultation" />

   renders the original wording `d` unless the admin has saved a replacement for
   key `k` (Admin → page → Page text). It renders plain text (or text with <br />
   line breaks) and adds no wrapper element, so layout and animation are exactly
   those of the original design. */

export const TextContext = createContext({});

export function SiteTextProvider({ children }) {
  const { data } = useCms("site-texts");
  const map = useMemo(
    () => (Array.isArray(data) ? Object.fromEntries(data.map((row) => [row.key, row.value])) : {}),
    [data],
  );
  return <TextContext.Provider value={map}>{children}</TextContext.Provider>;
}

/** Replacement text for a key, or null (used by code that needs the string itself). */
export function useSiteText(key) {
  const map = useContext(TextContext);
  const value = map[key];
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

export default function T({ k, d, br }) {
  const stored = useSiteText(k);
  // A stored text identical to the original wording (e.g. written by `seed_clinic`)
  // renders exactly the original markup; only a real edit changes the output.
  const override = stored !== null && stored.trim() !== d.trim() ? stored : null;
  const value = override ?? d;

  if (br === undefined) return value;

  const className = /className="([^"]*)"/.exec(br)?.[1];
  const lines = value.split(/\r?\n/);
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {/* an edited text gets a space before each break so lines never run together where the break is hidden */}
      {i < lines.length - 1 && (override ? " " : null)}
      {i < lines.length - 1 && <br className={className || undefined} />}
    </React.Fragment>
  ));
}

/** A numeric setting (statistics counters): the edited number, or `fallback`. */
export function useNumberText(key, fallback) {
  const raw = useSiteText(key);
  const n = raw === null ? NaN : parseFloat(raw.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

/* ---- text that lives in data arrays (cards, chips, lists) ---- */

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 26);

/** Stable key for a data-array text: scope + its original wording. */
export function textKey(scope, text) {
  let h = 5381;
  for (const ch of text) h = ((h << 5) + h + ch.codePointAt(0)) >>> 0;
  return `${scope}.${slugify(text) || "text"}-${h.toString(16).slice(-5)}`;
}

/** Editable version of a string from a data array: <TX s="contact.trust" d={title} /> */
export function TX({ s, d }) {
  return <T k={textKey(s, d)} d={d} />;
}
