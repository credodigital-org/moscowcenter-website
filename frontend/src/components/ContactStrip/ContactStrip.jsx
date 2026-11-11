import React, { useEffect, useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { useSiteInfo } from "../../lib/siteInfo";
import "./ContactStrip.css";

const phoneText = "+971 50 780 0163";
const locationText = "Khalifa street, Abu Dhabi";
const mapLink = "https://maps.google.com/maps?q=24.491975784301758%2C54.36055374145508&z=17&hl=en";

function useTypingText(text, delay = 60, startDelay = 0) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let intervalId;
    let timeoutId;

    setDisplayedText("");

    timeoutId = setTimeout(() => {
      let index = 0;

      intervalId = setInterval(() => {
        index += 1;
        setDisplayedText(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(intervalId);
        }
      }, delay);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, delay, startDelay]);

  return displayedText;
}

export default function ContactStrip() {
  const site = useSiteInfo();
  const phone = useTypingText(site.phone ?? phoneText, 65, 300);
  const location = useTypingText(site.location ?? locationText, 45, 1000);

  return (
    <div className="contact-top-bar">
      <div className="contact-top-container">
        <a
          href={site.tel ?? "tel:+971507800163"}
          className="contact-top-item contact-phone"
        >
          <Phone
            className="contact-strip-icon"
            size={15}
            fill="currentColor"
            strokeWidth={2.5}
          />
          <span className="typing-text">
            {phone}
            <span className="typing-cursor" aria-hidden="true">
              |
            </span>
          </span>
        </a>

        <a
          href={mapLink}
          className="contact-top-item contact-location"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Khalifa Street, Abu Dhabi in Google Maps"
        >
          <MapPin
            className="contact-strip-icon"
            size={15}
            strokeWidth={2.5}
          />
          <span className="typing-text">
            {location}
            <span className="typing-cursor" aria-hidden="true">
              |
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}