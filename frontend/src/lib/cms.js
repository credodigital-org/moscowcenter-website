/* Data layer between the Django CMS API and the website components.

   Design rule: the page must look and animate exactly like the original design
   from the very first paint. So components always start with the original
   content that ships with the frontend (or, on a repeat visit, the last content
   received from the API) and switch to live CMS data the moment it arrives.

   - useCmsList / useHomeSlots / useSlotImage never block rendering.
   - "Never configured" (an empty, un-seeded database) keeps the original content;
     "everything hidden on purpose" shows nothing — see /api/site-status/.
   - The map* helpers turn API records into the exact shapes the original
     components already render, so layout and animation are untouched. */

import { useEffect, useState } from "react";
import { apiGet, mediaUrl } from "../api";
import { iconFor } from "./icons";

const RETRY_AFTER_MS = 15000;
const STORAGE_PREFIX = "mihmc_cms_v1:";
const cache = new Map();

function readStored(path) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + path);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStored(path, data) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + path, JSON.stringify(data));
  } catch {
    /* storage full or blocked — the live data still works */
  }
}

export function clearCmsCache() {
  cache.clear();
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}

function load(path) {
  let entry = cache.get(path);
  if (entry && entry.status === "error" && Date.now() - entry.at > RETRY_AFTER_MS) {
    cache.delete(path);
    entry = undefined;
  }
  if (!entry) {
    const stored = readStored(path);
    entry = { status: "loading", data: stored, at: Date.now() };
    const current = entry;
    current.promise = apiGet(path)
      .then((data) => {
        current.status = "ready";
        current.data = data;
        writeStored(path, data);
      })
      .catch(() => {
        current.status = "error";
        current.at = Date.now();
      });
    cache.set(path, entry);
  }
  return entry;
}

/** Fetch a public endpoint once and share it. `data` is the live response, or the
 *  last stored one while the request is in flight, or null if neither exists. */
export function useCms(path) {
  const [, rerender] = useState(0);
  const entry = load(path);

  useEffect(() => {
    let alive = true;
    if (entry.status === "loading") {
      entry.promise.then(() => alive && rerender((n) => n + 1));
    }
    return () => {
      alive = false;
    };
  }, [entry]);

  return { status: entry.status, data: entry.data };
}

const STATUS_KEYS = { doctors: true, treatments: true, services: true, "about-protocols": true, testimonials: true };

/** List endpoint -> array of API records, or `fallback` (use the original design
 *  content) while nothing usable is known, if the API is down, or if the site has
 *  never been configured. Never returns null, so rendering is never blocked. */
export function useCmsList(path, fallback) {
  const { data } = useCms(path);
  const { data: counts } = useCms("site-status");
  if (!Array.isArray(data)) return fallback;
  if (data.length === 0 && STATUS_KEYS[path] && !(counts && counts[path] > 0)) return fallback;
  return data;
}

/* ------------------------------------------------------------------ */
/* Home page slots (images / videos / text on the original design)     */
/* ------------------------------------------------------------------ */

/** Helper to read a customised slot; always usable (original design when empty). */
export function useHomeSlots() {
  const { data } = useCms("home-sections");
  const rows = Array.isArray(data) ? data : [];
  const byKey = Object.fromEntries(rows.map((row) => [row.key, row]));
  return {
    image: (key, fallback) => mediaUrl(byKey[key]?.image) || fallback,
    video: (key, fallback) => mediaUrl(byKey[key]?.video) || fallback,
    text: (key, field, fallback) => byKey[key]?.[field]?.trim() || fallback,
  };
}

/** One replaceable image (page banners, maps, logo): the original until customised. */
export function useSlotImage(key, fallback) {
  const { data } = useCms("home-sections");
  const row = Array.isArray(data) ? data.find((r) => r.key === key) : null;
  return mediaUrl(row?.image) || fallback;
}

/** Props for an <img>; kept so every call site stays the same. */
export function slotImgProps(src) {
  return src ? { src } : { style: { visibility: "hidden" } };
}

/* ------------------------------------------------------------------ */
/* Mappers                                                              */
/* ------------------------------------------------------------------ */

/** Home page "Meet our team" slider card. */
export function mapDoctorCard(d) {
  return {
    name: d.name,
    role: d.role,
    specialty: d.specialty,
    experience: d.experience,
    qualification: d.qualification,
    description: d.card_description,
    image: mediaUrl(d.photo),
    alt: `${d.name}${d.specialty ? `, ${d.specialty.toLowerCase()}` : ""}`,
    availability: d.availability,
  };
}

/** Full profile on the Doctors page. */
export function mapDoctorProfile(d) {
  const cards = (d.cards_list || []).map((c, i) => ({
    icon: iconFor(c.icon, ["sparkles", "leaf", "activity", "flower-2", "brain", "droplet"][i % 6]),
    title: c.title,
    text: c.text,
  }));
  return {
    id: d.slug,
    tag: d.tag,
    name: d.name,
    sub: d.subtitle,
    quote: d.quote,
    quoteBy: d.quote_by,
    paragraphs: d.bio_paragraphs || [],
    highlight: d.highlight_title
      ? { icon: iconFor("flask-conical"), title: d.highlight_title, text: d.highlight_text }
      : null,
    stages:
      d.stages_list && d.stages_list.length
        ? { heading: d.stages_heading, items: d.stages_list }
        : null,
    sections: cards.length ? [{ heading: d.section_heading, cards }] : [],
    note: d.note ? { icon: iconFor("mic"), text: d.note } : null,
    languages: d.languages_list && d.languages_list.length ? d.languages_list : null,
    badge: d.badge,
    photo: mediaUrl(d.photo),
    photoLabel: d.photo_label,
    facts: (d.facts_list || []).map((f) => [f.label, f.value]),
    book: d.book_label || `Book with ${d.name}`,
    whatsapp: {
      label: d.whatsapp_label || "Direct WhatsApp Inquiry",
      href: d.whatsapp_url || "https://wa.me/971507800163",
    },
  };
}

/** Home page "Ayurvedic treatments" card. */
export function mapHomeTreatment(t) {
  return {
    title: t.home_title || t.title,
    description: t.home_description || t.description,
    image: mediaUrl(t.home_image) || mediaUrl(t.image),
    alt: t.image_alt || t.title,
  };
}

/** Treatments page cards. */
export function mapTreatmentCard(t) {
  return {
    img: mediaUrl(t.image),
    mins: t.duration,
    tag: t.tag,
    title: t.title,
    sub: t.subtitle,
    text: t.description,
    chips: t.chips_list || [],
  };
}

/** Services page department card. */
export function mapDepartment(s) {
  return {
    image: mediaUrl(s.image),
    alt: s.image_alt || s.title,
    tag: s.tag,
    title: s.title,
    by: s.supervised_by,
    text: s.description,
    conditions: s.conditions_list || [],
    cta: s.cta_label || "Book a Consultation",
  };
}

/** Home page service / condition card. */
export function mapServiceCard(s, fallbackIcon = "sparkles") {
  return {
    id: s.id,
    title: s.title,
    description: s.short_description,
    icon: iconFor(s.icon_key, fallbackIcon),
  };
}

/** Renders text where line breaks matter (headings that wrap on purpose). */
export function splitLines(text) {
  return String(text || "").split(/\r?\n/);
}
