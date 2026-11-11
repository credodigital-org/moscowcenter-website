
import React from "react";
import "./AnnouncementBar.css";
import { useSiteInfo } from "../../lib/siteInfo";

const DEFAULT_MESSAGE = "Doctors Consultation : 10 AM – 9 PM (Tuesday - Sunday)";

export default function AnnouncementBar() {
  const site = useSiteInfo();
  const message = site.announcement ?? DEFAULT_MESSAGE;
  return (
    <div className="announcement-bar">
      <p className="announcement-text">
        <span className="announcement-sparkle">✦</span>

        <span className="announcement-wave-text" aria-label={message}>
          {Array.from(message).map((letter, index) => (
            <span
              className="announcement-letter"
              key={`${index}-${letter}`}
              aria-hidden="true"
              style={{ "--letter-index": index }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}
