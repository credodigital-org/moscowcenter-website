
import React from "react";
import { MessageCircle } from "lucide-react";
import { useSiteInfo } from "../../lib/siteInfo";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  const site = useSiteInfo();
  const phoneNumber = site.whatsappNumber ? `+${site.whatsappNumber}` : "+971507800163";
  const message = "Hello! I would like to know more about your services.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      className="floating-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg
        viewBox="0 0 32 32"
        className="whatsapp-icon"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M16.02 3C8.85 3 3.02 8.82 3.02 15.99c0 2.29.6 4.53 1.75 6.5L3 29l6.68-1.75a13 13 0 0 0 6.33 1.62h.01C23.19 28.87 29 23.05 29 15.88A12.84 12.84 0 0 0 16.02 3Zm0 23.65h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.96 1.04 1.06-3.86-.25-.4a10.68 10.68 0 0 1-1.64-5.72c0-5.88 4.79-10.66 10.67-10.66 2.85 0 5.53 1.11 7.55 3.13a10.59 10.59 0 0 1 3.12 7.54c0 5.88-4.78 10.65-10.7 10.65Zm5.86-7.98c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.58-1.59-.95-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.49-.57.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.57-.08-.16-.73-1.75-1-2.39-.26-.63-.53-.54-.73-.55l-.62-.01c-.22 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.68 0 1.59 1.16 3.12 1.32 3.34.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.67.77.25 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37Z"
        />
      </svg>

      <span className="whatsapp-tooltip">Chat with us</span>
    </a>
  );
}
