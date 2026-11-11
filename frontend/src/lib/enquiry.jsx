import React, { useState } from "react";

const BOOKING_WHATSAPP_NUMBER = "919567559094";
const BOOKING_EMAIL = "codeleaf.tech@gmail.com";

/* Appointment forms hand off to WhatsApp on phones/tablets and email on desktop.
   No appointment data is posted to or stored by the backend. */

function isPhoneOrTablet() {
  const ua = navigator.userAgent || "";
  const touchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua) || touchMac;
}

export function useEnquiryForm(_source, toPayload) {
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    // Keep the honeypot behavior: silently accept bot submissions without opening an app.
    if (String(data.get("website") || "").trim()) {
      setStatus({ state: "sent", message: "Thank you." });
      return;
    }

    const payload = toPayload(data);
    const labels = {
      full_name: "Name",
      phone: "Phone",
      email: "Email",
      department: "Department / treatment",
      preferred_date: "Preferred date",
      preferred_time: "Preferred time",
      concern: "Health concern / note",
    };
    const lines = ["Appointment request", ...Object.entries(labels)
      .filter(([key]) => payload[key])
      .map(([key, label]) => `${label}: ${payload[key]}`)];
    const message = lines.join("\n");
    const subject = "Appointment request";
    const emailBody = encodeURIComponent(message);
    const emailHref = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
    const whatsappHref = `https://wa.me/${BOOKING_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const useWhatsApp = isPhoneOrTablet();
    if (useWhatsApp) {
      // Keep the app handoff directly in the submit gesture so browsers are less likely to block it.
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    } else {
      // Desktop opens the visitor's email app; they review the draft and press Send.
      window.location.href = emailHref;
    }
    form.reset();
    setStatus({
      state: "sent",
      message: useWhatsApp
        ? "WhatsApp opened with your request for +91 95675 59094. Review it and tap Send. If WhatsApp isn’t available, email codeleaf.tech@gmail.com instead:"
        : "Your email app should open with the request addressed to codeleaf.tech@gmail.com. Review it and tap Send. If no email app opens, use WhatsApp +91 95675 59094 instead:",
      primary: useWhatsApp ? "whatsapp" : "email",
      emailHref,
      whatsappHref,
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
    <p
      role={status.state === "error" ? "alert" : "status"}
      style={{
        margin: "14px 0 0",
        textAlign: "center",
        fontSize: 14,
        lineHeight: 1.5,
        color: status.state === "error" ? "#a52a2a" : "#145a38",
      }}
    >
      {status.message}
      {status.emailHref && status.primary === "whatsapp" && (
        <> {" "}<a href={status.emailHref}>Email the request instead</a>.{" "}
          <a href={status.whatsappHref} target="_blank" rel="noreferrer">Open WhatsApp again</a>.</>
      )}
      {status.whatsappHref && status.primary === "email" && (
        <> {" "}<a href={status.whatsappHref} target="_blank" rel="noreferrer">Open WhatsApp instead</a>.{" "}
          <a href={status.emailHref}>Open email again</a>.</>
      )}
    </p>
  );
}
