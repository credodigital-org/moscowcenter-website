/* Icon registry — the CMS stores an icon *key* (a short name) and the website
   turns it into one of these components. Keys are the lucide icon names. */
import {
  Accessibility,
  Activity,
  Apple,
  Award,
  Baby,
  BadgeCheck,
  Bone,
  BriefcaseMedical,
  Brain,
  CircleDot,
  CircleUserRound,
  ClipboardList,
  Droplet,
  FlaskConical,
  Flower2,
  HeartPulse,
  Leaf,
  Mic,
  PersonStanding,
  Scale,
  ShieldCheck,
  ShieldPlus,
  Smile,
  Sparkles,
  Sprout,
  Stethoscope,
  Waves,
  Wind,
} from "lucide-react";

/* Seated meditation figure (lucide has no built-in one) */
export function MeditationIcon({ size = 24, strokeWidth = 2, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M12 8v5" />
      <path d="M6 12l6-2 6 2" />
      <path d="M4 19c2-3 5-4 8-4s6 1 8 4" />
    </svg>
  );
}

export const ICONS = {
  accessibility: Accessibility,
  activity: Activity,
  apple: Apple,
  award: Award,
  baby: Baby,
  "badge-check": BadgeCheck,
  bone: Bone,
  brain: Brain,
  "briefcase-medical": BriefcaseMedical,
  "circle-dot": CircleDot,
  "circle-user-round": CircleUserRound,
  "clipboard-list": ClipboardList,
  droplet: Droplet,
  "flask-conical": FlaskConical,
  "flower-2": Flower2,
  "heart-pulse": HeartPulse,
  leaf: Leaf,
  meditation: MeditationIcon,
  mic: Mic,
  "person-standing": PersonStanding,
  scale: Scale,
  "shield-check": ShieldCheck,
  "shield-plus": ShieldPlus,
  smile: Smile,
  sparkles: Sparkles,
  sprout: Sprout,
  stethoscope: Stethoscope,
  waves: Waves,
  wind: Wind,
};

export const ICON_KEYS = Object.keys(ICONS);

/** Resolve a stored icon key; falls back to `fallback` (a key or component). */
export function iconFor(key, fallback = "sparkles") {
  if (key && ICONS[key]) return ICONS[key];
  if (typeof fallback === "string") return ICONS[fallback] || Sparkles;
  return fallback || Sparkles;
}
