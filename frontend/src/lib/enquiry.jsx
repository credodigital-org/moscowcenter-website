import React, { useState } from "react";

const BOOKING_EMAIL = "info@moscowcenter.ae";

/* Appointment forms open a prefilled email draft. They do not submit to or
   store appointment details in Django, Render, WhatsApp, or another service. */
export function useEnquiryForm(_source, toPayload) {
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // A real visitor never sees or fills this anti-spam field.
    if (String(data.get("website") || "").trim()) {
      setStatus({ state: "idle", message: "" });
      return;
    }

    const payload = toPayload(data);
    const fields = [
      ["full_name", "Patient name"],
      ["email", "Patient email"],
      ["phone", "Phone number"],
      ["department", "Department / treatment"],
      ["preferred_date", "Preferred date"],
      ["preferred_time", "Preferred time"],
      ["concern", "Health concern / note"],
    ];
    const lines = [
      "Appointment Request — Moscow International Holistic Medical Centre",
      "",
      ...fields
        .filter(([key]) => String(payload[key] || "").trim())
        .map(([key, label]) => `${label}: ${String(payload[key]).trim()}`),
    ];
    const subject = "Appointment Request — Moscow Centre";
    const emailHref = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

    // Keep this within the submit gesture so browsers can launch the visitor's email app.
    window.location.href = emailHref;
    setStatus({
      state: "draft",
      message: `Your email app should open with the booking details addressed to ${BOOKING_EMAIL}. Review the draft and tap Send to submit your request.`,
      emailHref,
    });
  }

  return { status, submit };
}

/** Hidden field that only spam bots fill in; real visitors never see it. */
export function EnquiryHoneypot() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
    />
  );
}

export function EnquiryStatus({ status }) {
  if (!status.message) return null;
  return (
    <div
      role={status.state === "error" ? "alert" : "status"}
      aria-live={status.state === "error" ? "assertive" : "polite"}
      style={{
        margin: "14px 0 0",
        textAlign: "center",
        fontSize: 14,
        lineHeight: 1.5,
        color: status.state === "error" ? "#a52a2a" : "#145a38",
      }}
    >
      <p style={{ margin: 0 }}>{status.message}</p>
      {status.emailHref && (
        <p style={{ margin: "5px 0 0" }}>
          If your email app did not open, <a href={status.emailHref}>open the booking email draft</a>.
        </p>
      )}
    </div>
  );
}
