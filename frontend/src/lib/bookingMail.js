/* Builds the prefilled appointment e-mail for the "Book Consultation" forms.
   Pure functions (no React, no browser APIs) so they can be unit-tested:
   node scripts/test-booking-mail.mjs */

export const DEFAULT_BOOKING_EMAIL = "info@moscowcenter.ae";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Most mail apps accept ~2,000 characters in a mailto: link; stay below that.
const MAX_MAILTO_LENGTH = 1800;

/** The configured recipient (Admin → Site-wide → Contact details) or the default. */
export function resolveRecipient(configured) {
  const value = String(configured || "").trim();
  return EMAIL_RE.test(value) ? value : DEFAULT_BOOKING_EMAIL;
}

/** Normalises a phone number to international format. Local UAE numbers get +971. */
export function normalizePhone(raw) {
  const text = String(raw || "").trim();
  if (!text) return { ok: false, message: "Please enter your phone number." };
  if (/[^\d\s+()\-.]/.test(text)) return { ok: false, message: "The phone number may only contain digits, spaces and + ( ) -." };

  const international = /^(\+|00)/.test(text);
  let digits = text.replace(/\D/g, "");

  if (international) {
    digits = digits.replace(/^00/, "");
    if (digits.length < 8 || digits.length > 15) {
      return { ok: false, message: "Please enter a valid phone number with country code, e.g. +971 50 123 4567." };
    }
  } else {
    digits = digits.replace(/^0+/, "");
    if (digits.length < 7 || digits.length > 10) {
      return { ok: false, message: "Please enter a valid UAE phone number, e.g. 50 123 4567 — or include your country code (+44 …)." };
    }
    digits = `971${digits}`;
  }

  let value = `+${digits}`;
  if (digits.startsWith("971")) {
    const rest = digits.slice(3);
    value = `+971 ${rest.slice(0, rest.length - 7)}${rest.length > 7 ? " " : ""}${rest.slice(-7, -4)} ${rest.slice(-4)}`.replace(/\s+/g, " ").trim();
  }
  return { ok: true, value, digits };
}

function parseDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(String(value || "").trim());
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d), h ? Number(h) : 23, mi ? Number(mi) : 59);
  return Number.isNaN(date.getTime()) ? null : { date, hasTime: Boolean(h) };
}

/** True when the chosen date (or date + time) is already over. */
export function isPastAppointment(value, now = new Date()) {
  const parsed = parseDate(value);
  if (!parsed) return false;
  if (parsed.hasTime) return parsed.date.getTime() < now.getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const chosen = new Date(parsed.date.getFullYear(), parsed.date.getMonth(), parsed.date.getDate());
  return chosen.getTime() < today.getTime();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-12T10:30" → "12 Nov 2026, 10:30 AM"; "2026-11-12" → "12 Nov 2026". */
export function formatAppointment(value) {
  const parsed = parseDate(value);
  if (!parsed) return String(value || "").trim();
  const d = parsed.date;
  const day = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  if (!parsed.hasTime) return day;
  const h = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}, ${((h + 11) % 12) + 1}:${minutes} ${h < 12 ? "AM" : "PM"}`;
}

const clean = (value, max) => String(value || "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

/**
 * payload: { full_name, phone, email, department, preferred_date, preferred_time, concern }
 * Returns the subject, body and the links to open the draft.
 */
export function buildBookingEmail(payload, recipient = DEFAULT_BOOKING_EMAIL) {
  const to = resolveRecipient(recipient);
  const name = clean(payload.full_name, 120);
  const time = clean(payload.preferred_time, 60);
  const day = formatAppointment(payload.preferred_date);
  const when = day ? [day, time].filter(Boolean).join(" — ") : "";

  const make = (concern) => {
    const rows = [
      ["Patient name", name],
      ["Phone", clean(payload.phone, 40)],
      ["Email", clean(payload.email, 120)],
      ["Department / treatment", clean(payload.department, 120)],
      [day ? "Preferred date and time" : "Preferred time of day", when || time],
      ["Message / health concern", concern],
    ].filter(([, v]) => v);
    return [
      "Hello Moscow Centre team,",
      "",
      "I would like to request an appointment. Please contact me to confirm a suitable time.",
      "",
      ...rows.map(([label, v]) => `${label}: ${v}`),
      "",
      "Sent from the Moscow Centre website booking form.",
    ].join("\n");
  };

  const subject = `Appointment Request - Moscow Centre${name ? ` - ${name}` : ""}`;
  const crlf = (text) => text.replace(/\n/g, "\r\n");
  const links = (body) => {
    const q = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(crlf(body))}`;
    return {
      mailto: `mailto:${to}?${q}`,
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(crlf(body))}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(crlf(body))}`,
    };
  };

  const fullConcern = clean(payload.concern, 2000);
  const fullBody = make(fullConcern);
  let body = fullBody;
  let shortened = false;

  // Keep the link within what mail apps accept by shortening only the free-text message.
  if (links(body).mailto.length > MAX_MAILTO_LENGTH) {
    shortened = true;
    const note = " … (message shortened - please see the website form)";
    let lo = 0;
    let hi = fullConcern.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (links(make(fullConcern.slice(0, mid).trimEnd() + note)).mailto.length <= MAX_MAILTO_LENGTH) lo = mid;
      else hi = mid - 1;
    }
    body = make(fullConcern.slice(0, lo).trimEnd() + note);
  }

  return { to, subject, body, fullBody, shortened, ...links(body), text: `To: ${to}\nSubject: ${subject}\n\n${fullBody}` };
}

/**
 * The whole "Book Consultation" click, with the browser parts passed in so it can be tested:
 *  - honeypot: value of the hidden spam-trap field
 *  - payload: { full_name, phone, email, department, preferred_date, preferred_time, concern }
 *  - getField(name): the form control (or null)
 *  - markInvalid(control, message): shows the browser's validation bubble, returns true if shown
 *  - openDraft(href, desktop): opens Gmail in a new desktop tab or the mobile e-mail app
 * Returns the status the form should display.
 */
export function processBookingSubmit({ honeypot, payload, getField, recipient, openDraft, markInvalid, desktop = false, now = new Date() }) {
  const idle = { state: "idle", message: "" };
  if (String(honeypot || "").trim()) return idle;

  const phone = normalizePhone(payload.phone);
  if (!phone.ok) {
    return markInvalid(getField("phone"), phone.message) ? idle : { state: "error", message: phone.message };
  }

  if (isPastAppointment(payload.preferred_date, now)) {
    const message = "Please choose a date and time that is not in the past.";
    const field = getField("appointmentDate") || getField("date");
    return markInvalid(field, message) ? idle : { state: "error", message };
  }

  const mail = buildBookingEmail({ ...payload, phone: phone.value }, resolveRecipient(recipient));
  // Desktop opens Gmail Compose in a new tab; phones/tablets use the native email app.
  openDraft(desktop ? mail.gmail : mail.mailto, desktop);
  return {
    state: "draft",
    message: desktop
      ? `Gmail Compose should open in a new tab with a message to ${mail.to}. Check the details and press Send — your request is only sent when you press Send.`
      : `Your phone or tablet's email app should open with a message to ${mail.to}. Check the details and press Send — your request is only sent when you press Send.`,
    mail,
  };
}

