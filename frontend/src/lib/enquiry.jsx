import React, { useState } from "react";
import { useSiteText } from "../components/T";
import { processBookingSubmit } from "./bookingMail";

/* "Book Consultation" forms (home page and Contact page).

   Pressing the button checks the details and opens the visitor's e-mail app with a
   ready-to-send message addressed to the clinic (info@moscowcenter.ae by default; the
   address can be changed in Admin → Site-wide → Contact details). The visitor reviews
   the draft and presses Send in their mail app.

   The website cannot know whether the e-mail was sent, so it never says the request
   was delivered. If no mail app opens (common on desktop computers), the message
   offers Gmail, Outlook and "copy the details" as alternatives. */

function isMobileOrTablet() {
  const ua = navigator.userAgent || "";
  const touchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua) || touchMac;
}

/** Open Gmail on desktop or hand off to the device's native mail app on mobile. */
function openBookingDraft(href, desktop) {
  if (desktop) {
    // This runs synchronously inside the submit gesture to avoid popup blockers.
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.href = href;
}

/** Shows the browser's own validation bubble on a field and clears it when edited. */
function markInvalid(element, message) {
  if (!element || typeof element.setCustomValidity !== "function") return false;
  element.setCustomValidity(message);
  element.reportValidity();
  const clear = () => element.setCustomValidity("");
  element.addEventListener("input", clear, { once: true });
  element.addEventListener("change", clear, { once: true });
  return true;
}

export function useEnquiryForm(_source, toPayload) {
  const configuredRecipient = useSiteText("site.booking-email");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus(
      processBookingSubmit({
        honeypot: data.get("website"),
        payload: toPayload(data),
        getField: (name) => form.elements.namedItem(name),
        recipient: configuredRecipient,
        openDraft: openBookingDraft,
        markInvalid,
        desktop: !isMobileOrTablet(),
      }),
    );
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

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

const linkStyle = {
  background: "none",
  border: 0,
  padding: 0,
  font: "inherit",
  color: "inherit",
  textDecoration: "underline",
  cursor: "pointer",
};

export function EnquiryStatus({ status }) {
  const [copied, setCopied] = useState("");
  if (!status.message) return null;
  const mail = status.mail;
  const isError = status.state === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      style={{ margin: "14px 0 0", textAlign: "center", fontSize: 14, lineHeight: 1.55, color: isError ? "#a52a2a" : "#145a38" }}
    >
      <p style={{ margin: 0 }}>{status.message}</p>
      {mail && (
        <p style={{ margin: "6px 0 0" }}>
          Email app did not open?{" "}
          <a href={mail.gmail} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>Open in Gmail</a>
          {" · "}
          <a href={mail.outlook} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>Open in Outlook</a>
          {" · "}
          <button
            type="button"
            style={linkStyle}
            onClick={async () => setCopied((await copyText(mail.text)) ? "Details copied — paste them into an email to " + mail.to : "Could not copy. Please write to " + mail.to)}
          >
            Copy the details
          </button>
        </p>
      )}
      {copied && <p style={{ margin: "4px 0 0" }}>{copied}</p>}
    </div>
  );
}
