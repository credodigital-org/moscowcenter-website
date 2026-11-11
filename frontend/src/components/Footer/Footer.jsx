import React, { useEffect, useRef } from "react";
import { MapPin, Phone, Clock, Mail, BadgeCheck } from "lucide-react";
import "./Footer.css";

// Update this path to match your actual logo file.
import logo from "../../assets/images/moscow-logo.png";
import { useSlotImage } from "../../lib/cms";
import { useSiteInfo } from "../../lib/siteInfo";

import T from "../../components/T";
/* ------------------------------------------
   Social links: replace the Instagram and
   Facebook URLs with your real profile pages.
------------------------------------------- */
/* Social links can be changed in Admin → Site-wide → Contact details. */
function socialHref(item, site) {
  const overrides = {
    Gmail: site.footerMailto,
    Instagram: site.instagram,
    Facebook: site.facebook,
    WhatsApp: site.waLink,
    TikTok: site.tiktok,
  };
  return overrides[item.name] ?? item.href;
}

const SOCIAL_LINKS = [
  {
    name: "Gmail",
    href: "mailto:care@moscowholistic.ae",
    external: false,
    className: "is-gmail",
    icon: (
      <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
        <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75V40h7a3 3 0 0 0 3-3V16.2z" />
        <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6a3 3 0 0 1-3-3V16.2z" />
        <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
        <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859A3.9 3.9 0 0 0 3 12.298z" />
        <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A3.9 3.9 0 0 1 45 12.298z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/moscowinternationalholistic?dlrf=enlrNWx4YnQ5aG93", // TODO: replace
    external: true,
    className: "is-instagram",
    icon: (
      <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
        <defs>
          <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
            <stop offset="0" stopColor="#fdf497" />
            <stop offset="0.05" stopColor="#fdf497" />
            <stop offset="0.45" stopColor="#fd5949" />
            <stop offset="0.6" stopColor="#d6249f" />
            <stop offset="0.9" stopColor="#285aeb" />
          </radialGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#ig-grad)" />
        <rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="24" cy="24" r="5.6" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="31.3" cy="16.7" r="1.8" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/moscowholistic", // TODO: replace
    external: true,
    className: "is-facebook",
    icon: (
      <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#1877f2" />
        <path
          fill="#fff"
          d="M26.6 44V28.4h5.2l.8-6.1h-6v-3.9c0-1.8.5-3 3-3h3.2v-5.4c-.6-.1-2.5-.2-4.7-.2-4.6 0-7.7 2.8-7.7 7.9v4.6h-5.2v6.1h5.2V44h4.2z"
        />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/9710588081863",
    external: true,
    className: "is-whatsapp",
    icon: (
      <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#25d366" />
        <path
          fill="#fff"
          d="M34.2 13.7A14.1 14.1 0 0 0 11.1 30.5L9.5 38.5l8.2-1.6a14.1 14.1 0 0 0 6.7 1.7h.1a14.1 14.1 0 0 0 9.7-24.9zM24.4 36.2a11.7 11.7 0 0 1-6-1.6l-.4-.3-4.9.9 1-4.8-.3-.5a11.7 11.7 0 1 1 10.6 6.3zm6.4-8.7c-.4-.2-2.1-1-2.4-1.2s-.6-.2-.8.2-.9 1.2-1.1 1.4-.4.3-.8.1a9.6 9.6 0 0 1-4.8-4.2c-.4-.6.4-.6 1.1-2a.7.7 0 0 0 0-.6l-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7a1.3 1.3 0 0 0-.9.4 3.9 3.9 0 0 0-1.2 2.9 6.8 6.8 0 0 0 1.4 3.6 15.5 15.5 0 0 0 6 5.3c2.2.9 3 1 4.1.8a3.5 3.5 0 0 0 2.3-1.6 2.9 2.9 0 0 0 .2-1.6c-.1-.2-.3-.3-.7-.5z"
        />
      </svg>
    ),
  },
    {
    name: "TikTok",
    href: "https://www.tiktok.com/@moscowinternationaluae?is_from_webapp=1&sender_device=pc", // TODO: replace with your real profile
    external: true,
    className: "is-tiktok",
    icon: (
      <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#000" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
        <g transform="translate(13.2 13.2) scale(0.9)">
          {/* cyan and red offset layers give the classic TikTok glitch edge */}
          <path
            transform="translate(-0.9 -0.9)"
            fill="#25f4ee"
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
          />
          <path
            transform="translate(0.9 0.9)"
            fill="#fe2c55"
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
          />
          <path
            fill="#fff"
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
          />
        </g>
      </svg>
    ),
  },
];

export default function Footer() {
  const logoSrc = useSlotImage("site-logo", logo);
  const site = useSiteInfo();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);

  // Scroll reveal: content fades in when the footer enters the screen.
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Show everything straight away if motion is reduced or the
    // browser has no IntersectionObserver.
    if (reduceMotion || !("IntersectionObserver" in window)) {
      footer.classList.add("is-revealed");
      return;
    }

    footer.classList.add("is-armed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footer.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="moscow-footer" id="footer" ref={footerRef}>
      <div className="moscow-footer-container">
        {/* Main footer columns */}
        <div className="moscow-footer-main">
          {/* Brand column */}
          <div className="moscow-footer-brand">
            <a href="/" className="moscow-footer-logo-link reveal" style={{ "--d": 0 }}>
              <img
                src={logoSrc}
                alt="Moscow International Holistic Centre"
                className="moscow-footer-logo"
              />
            </a>

            <p className="moscow-footer-description reveal" style={{ "--d": 1 }}>
              <T k="site.footer.integrating-authentic-vedi-2053" d={"Integrating authentic Vedic healing, Panchakarma restoration, and rigorous clinical safety licensed under UAE health regulatory directives."} /></p>

            <div className="moscow-footer-certified reveal" style={{ "--d": 2 }}>
              <BadgeCheck size={12} />
              <span><T k="site.footer.medical-center-068f" d={"Medical Center"} /></span>
            </div>

            {/* Social links */}
            <ul className="moscow-footer-social" aria-label="Social media">
              {SOCIAL_LINKS.map((item, index) => (
                <li key={item.name} style={{ "--i": index }}>
                  <a
                    href={socialHref(item, site)}
                    className={`moscow-social-link ${item.className}`}
                    aria-label={item.name}
                    data-label={item.name}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="moscow-footer-links reveal" style={{ "--d": 2 }}>
            <h3><T k="site.footer.quick-access-8525" d={"Quick Access"} /></h3>

            <nav aria-label="Footer navigation">
              <a href="/"><T k="site.footer.home-70f8" d={"Home"} /></a>
              <a href="/services"><T k="site.footer.services-5cbd" d={"Services"} /></a>
              <a href="/treatments"><T k="site.footer.treatments-1091" d={"Treatments"} /></a>
              <a href="/doctors"><T k="site.footer.doctors-09df" d={"Doctors"} /></a>
              <a href="/contact"><T k="site.footer.contacts-b0dd" d={"Contacts"} /></a>
            </nav>
          </div>

          {/* Hospital information */}
          <div className="moscow-footer-location reveal" style={{ "--d": 3 }}>
            <h3><T k="site.footer.hospital-location-94f5" d={"Hospital Location"} /></h3>

            <ul>
              <li>
                <MapPin size={12} />
                <span><T k="site.footer.shabeeb-al-deheri-building-2319" d={"Shabeeb Al Deheri Building Khalifa Street"} /></span>
              </li>

              <li>
                <Phone size={12} />
                <a href={site.tel ?? "tel:+971507800163"}>{site.phone ?? "+971 50 780 0163"}</a>
              </li>

              <li>
                <Clock size={12} />
                <span><T k="site.footer.tuesday-sunday-10-00-am-9--59bb" d={"Tuesday – Sunday: 10:00 AM – 9:00 PM"} /></span>
              </li>

              <li>
                <Mail size={12} />
                <a href={site.mailto ?? "mailto:info@moscowcenter.ae"}>
                  {site.email ?? "info@moscowcenter.ae"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="moscow-footer-bottom reveal" style={{ "--d": 5 }}>
          <p className="moscow-footer-copyright">
            © {currentYear} Moscow International Holistic Centre, Abu Dhabi.
          </p>

          <nav className="moscow-footer-legal" aria-label="Legal information">
            <a href="/privacy-policy"><T k="site.footer.privacy-policy-9db1" d={"Privacy Policy"} /></a>
            <span className="moscow-footer-dot">•</span>
            <a href="/patient-care-charter"><T k="site.footer.patient-care-charter-e55d" d={"Patient Care Charter"} /></a>
            <span className="moscow-footer-dot">•</span>
            <a href="/terms-of-care"><T k="site.footer.terms-of-care-d1d5" d={"Terms of Care"} /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
