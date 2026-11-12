// Run:  node scripts/test-booking-mail.mjs
import assert from "node:assert/strict";
import {
  DEFAULT_BOOKING_EMAIL, buildBookingEmail, formatAppointment, isPastAppointment,
  normalizePhone, processBookingSubmit, resolveRecipient,
} from "../src/lib/bookingMail.js";

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log("  ok  ", name); } catch (e) { console.error("  FAIL", name, "\n      ", e.message); process.exitCode = 1; } };
const NOW = new Date(2026, 10, 12, 9, 0); // 12 Nov 2026, 09:00

const base = { full_name: "Mariam Al Mansoori", phone: "50 123 4567", email: "m@example.com", department: "Classical Homeopathy", preferred_date: "2026-11-20", preferred_time: "Morning", concern: "Back pain" };
const run = (over = {}, extra = {}) => {
  const opened = []; const shown = [];
  const status = processBookingSubmit({
    honeypot: "", payload: { ...base, ...over }, getField: (n) => ({ name: n }), recipient: undefined,
    openDraft: (h) => opened.push(h), markInvalid: (el, m) => { shown.push([el && el.name, m]); return true; }, now: NOW, ...extra,
  });
  return { status, opened, shown };
};

console.log("Recipient");
test("defaults to info@moscowcenter.ae", () => assert.equal(DEFAULT_BOOKING_EMAIL, "info@moscowcenter.ae"));
test("uses a valid configured address", () => assert.equal(resolveRecipient(" bookings@clinic.ae "), "bookings@clinic.ae"));
test("falls back when the configured address is invalid or empty", () => { assert.equal(resolveRecipient("not an email"), DEFAULT_BOOKING_EMAIL); assert.equal(resolveRecipient(""), DEFAULT_BOOKING_EMAIL); });

console.log("Phone");
test("local UAE number gets +971", () => assert.equal(normalizePhone("50 123 4567").value, "+971 50 123 4567"));
test("leading 0 is dropped", () => assert.equal(normalizePhone("050 123 4567").value, "+971 50 123 4567"));
test("international number is kept", () => assert.equal(normalizePhone("+44 7700 900123").value, "+447700900123"));
test("00 prefix is understood as international", () => assert.equal(normalizePhone("0044 7700 900123").value, "+447700900123"));
test("letters rejected", () => assert.equal(normalizePhone("abc").ok, false));
test("too short rejected", () => assert.equal(normalizePhone("123").ok, false));
test("empty rejected", () => assert.equal(normalizePhone("  ").ok, false));
test("too long international rejected", () => assert.equal(normalizePhone("+1234567890123456").ok, false));

console.log("Dates");
test("past date-only is rejected, today is allowed", () => { assert.equal(isPastAppointment("2026-11-11", NOW), true); assert.equal(isPastAppointment("2026-11-12", NOW), false); });
test("past date-time is rejected, later today allowed", () => { assert.equal(isPastAppointment("2026-11-12T08:00", NOW), true); assert.equal(isPastAppointment("2026-11-12T10:30", NOW), false); });
test("empty date is not 'past'", () => assert.equal(isPastAppointment("", NOW), false));
test("formats date-time", () => assert.equal(formatAppointment("2026-11-12T10:30"), "12 Nov 2026, 10:30 AM"));
test("formats afternoon / midnight / noon", () => { assert.equal(formatAppointment("2026-11-12T15:05"), "12 Nov 2026, 3:05 PM"); assert.equal(formatAppointment("2026-11-12T00:00"), "12 Nov 2026, 12:00 AM"); assert.equal(formatAppointment("2026-11-12T12:00"), "12 Nov 2026, 12:00 PM"); });
test("formats date-only", () => assert.equal(formatAppointment("2026-11-20"), "20 Nov 2026"));

console.log("Click flow");
test("valid booking opens exactly one draft to info@moscowcenter.ae", () => {
  const { status, opened } = run();
  assert.equal(opened.length, 1);
  assert.ok(opened[0].startsWith("mailto:info@moscowcenter.ae?subject="));
  assert.equal(status.state, "draft");
});
test("desktop opens Gmail Compose with the booking details", () => {
  const { status, opened } = run({}, { desktop: true });
  assert.equal(opened.length, 1);
  assert.ok(opened[0].startsWith("https://mail.google.com/mail/?view=cm"));
  assert.ok(opened[0].includes("to=info%40moscowcenter.ae"));
  assert.match(status.message, /new tab/i);
});
test("draft contains every detail, with CRLF line breaks", () => {
  const { opened } = run();
  const url = new URL(opened[0].replace("mailto:", "http://x/"));
  const body = url.searchParams.get("body"); const subject = url.searchParams.get("subject");
  assert.equal(subject, "Appointment Request - Moscow Centre - Mariam Al Mansoori");
  for (const piece of ["Mariam Al Mansoori", "+971 50 123 4567", "m@example.com", "Classical Homeopathy", "20 Nov 2026 — Morning", "Back pain"]) assert.ok(body.includes(piece), piece);
  assert.ok(body.includes("\r\n"));
  assert.ok(!/[^\r]\n/.test(body), "every line break must be CRLF");
});
test("home-page style date-time value is shown nicely", () => {
  const { opened } = run({ preferred_date: "2026-11-20T14:30", preferred_time: "", email: "" });
  const body = new URL(opened[0].replace("mailto:", "http://x/")).searchParams.get("body");
  assert.ok(body.includes("Preferred date and time: 20 Nov 2026, 2:30 PM")); assert.ok(!body.includes("Email:"));
});
test("no date: only the time of day is mentioned", () => {
  const { opened } = run({ preferred_date: "", preferred_time: "Evening" });
  const body = new URL(opened[0].replace("mailto:", "http://x/")).searchParams.get("body");
  assert.ok(body.includes("Preferred time of day: Evening")); assert.ok(!body.includes("Preferred date and time"));
});
test("configured recipient is used", () => { const { opened } = run({}, { recipient: "reception@moscowcenter.com" }); assert.ok(opened[0].startsWith("mailto:reception@moscowcenter.com?")); });
test("spam trap filled → nothing opens", () => { const { opened, status } = run({}, { honeypot: "http://spam" }); assert.equal(opened.length, 0); assert.equal(status.state, "idle"); });
test("invalid phone → validation bubble on the phone field, nothing opens", () => {
  const { opened, shown } = run({ phone: "abc" }); assert.equal(opened.length, 0); assert.equal(shown[0][0], "phone");
});
test("past date → validation bubble on the date field, nothing opens", () => {
  const home = run({ preferred_date: "2026-11-01T10:00" }); assert.equal(home.opened.length, 0); assert.equal(home.shown[0][0], "appointmentDate");
});
test("when no bubble can be shown an error message is returned", () => {
  const { status } = run({ phone: "abc" }, { markInvalid: () => false }); assert.equal(status.state, "error"); assert.ok(status.message.length > 10);
});

console.log("Link building");
test("special characters survive encoding (& ? # = + % quotes, Arabic, emoji)", () => {
  const concern = "Pain & stiffness? #1 issue = 50% worse + \"quotes\" 'x' — مرحبا 🙂";
  const m = buildBookingEmail({ ...base, full_name: "Ahmed Al Suwaidi & Sons", concern });
  const parsed = new URL(m.mailto.replace("mailto:", "http://x/"));
  assert.ok(parsed.searchParams.get("body").includes(concern));
  assert.ok(parsed.searchParams.get("subject").includes("Ahmed Al Suwaidi & Sons"));
});
test("very long message is shortened to keep the link under 1,800 characters", () => {
  const m = buildBookingEmail({ ...base, concern: "word ".repeat(2000) });
  assert.ok(m.mailto.length <= 1800, String(m.mailto.length)); assert.equal(m.shortened, true); assert.ok(m.body.includes("shortened"));
  assert.ok(m.fullBody.length > m.body.length, "the copy-details text keeps the full message");
});
test("Gmail / Outlook / copy fallbacks point at the same recipient", () => {
  const m = buildBookingEmail(base);
  assert.ok(m.gmail.startsWith("https://mail.google.com/mail/?view=cm") && m.gmail.includes("to=info%40moscowcenter.ae"));
  assert.ok(m.outlook.startsWith("https://outlook.live.com/mail/0/deeplink/compose") && m.outlook.includes("to=info%40moscowcenter.ae"));
  assert.ok(m.text.startsWith("To: info@moscowcenter.ae\nSubject: Appointment Request"));
});
test("control characters and over-long fields are cleaned", () => {
  const m = buildBookingEmail({ ...base, full_name: "A\u0000B".repeat(200), concern: "x\u0007y" });
  assert.ok(!m.body.includes("\u0000") && !m.body.includes("\u0007"));
});

console.log(`\n${passed} checks passed${process.exitCode ? " — SOME FAILED" : ""}`);
