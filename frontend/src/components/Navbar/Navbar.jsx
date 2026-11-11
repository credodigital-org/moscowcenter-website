import React, { useEffect, useState } from "react";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import "./Navbar.css";

import logo from "../../assets/images/moscow-logo.png";
import LogoMark from "../LogoMark";
import { useSlotImage } from "../../lib/cms";
import { useSiteInfo } from "../../lib/siteInfo";

import T from "../../components/T";
const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/services" },
  { label: "Treatments", href: "/treatments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Contact Us", href: "/contact" },
];

/* =========================================
   WAVE LETTER REVEAL COMPONENT
========================================= */

function WaveText({ children, delay = 0, className = "" }) {
  const text = String(children);

  return (
    <span className={`moscow-wave-text ${className}`} aria-label={text}>
      {Array.from(text).map((letter, index) => (
        <span
          className="moscow-wave-letter"
          key={`${index}-${letter}`}
          aria-hidden="true"
          style={{ "--wave-delay": `${delay + index * 28}ms` }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

/* =========================================
   NAVBAR COMPONENT
========================================= */

export default function Navbar() {
  const logoSrc = useSlotImage("site-logo", logo);
  const site = useSiteInfo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();

  /* Scroll progress line (spring-smoothed) */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  const closeMenu = () => setMenuOpen(false);

  /* Close menu with Escape and prevent background scrolling */
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("moscow-menu-is-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("moscow-menu-is-open");
    };
  }, [menuOpen]);

  /* Active route detection */
  const isActivePage = (item) => {
    if (item.href === "/") {
      return location.pathname === "/" && !location.hash;
    }

    if (item.href.startsWith("/")) {
      return (
        location.pathname === item.href ||
        location.pathname.startsWith(`${item.href}/`)
      );
    }

    return location.hash === item.href;
  };

  /* Navigation handling */
  const handleNavigation = (event, item) => {
    closeMenu();

    if (!item.href.startsWith("#")) return;

    const target = document.getElementById(item.href.slice(1));

    if (target) {
      event.preventDefault();

      if (location.hash !== item.href) {
        window.history.pushState(null, "", item.href);
      }

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });

      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  /* Floating-pill state: header stays fixed and always visible */
  useEffect(() => {
    let ticking = false;

    const update = () => {
      setScrolled(window.scrollY > 30);
      ticking = false;

      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 10 : y > 60)); // gap prevents toggling
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`moscow-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="moscow-header-container">
          <a
            href="/"
            className="moscow-logo"
            aria-label="Moscow Medical Center Home"
            onClick={closeMenu}
          >
            <LogoMark src={logoSrc} alt="Moscow Medical Center" />
          </a>

          <div className="moscow-header-actions">
            <a
              href="#appointment"
              className="moscow-header-btn consultation-btn"
              onClick={closeMenu}
            >
              <T k="site.navigation-bar.book-a-consultation-685a" d={"Book a Consultation"} /></a>

            <a href="tel:+971026310746" className="moscow-header-btn call-btn">
              <T k="site.navigation-bar.call-us-8420" d={"Call Us"} /></a>

            <button
              type="button"
              className={`moscow-menu-btn ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="moscow-side-menu"
            >
              <span
                key={menuOpen ? "close" : "open"}
                className="moscow-menu-icon"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </span>
            </button>
          </div>
        </div>

        {/* SCROLL PROGRESS LINE */}
        <motion.span
          className="moscow-scroll-progress"
          style={{ scaleX: reduce ? 0 : progress, originX: 0 }}
          aria-hidden="true"
        />
      </header>

      {/* BLURRED BACKDROP */}
      <div
        className={`moscow-menu-backdrop ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* SIDE NAVIGATION */}
      <nav
        id="moscow-side-menu"
        className={`moscow-side-menu ${menuOpen ? "open" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <button
          type="button"
          className="moscow-menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        >
          <X size={25} />
        </button>

        <div className="moscow-side-menu-links">
          {navItems.map((item, itemIndex) => {
            const active = isActivePage(item);

            return (
              <a
                key={item.label}
                href={item.href}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                onClick={(event) => handleNavigation(event, item)}
                tabIndex={menuOpen ? 0 : -1}
                style={{ "--item-i": itemIndex }}
              >
                <WaveText delay={itemIndex * 100}>{item.label}</WaveText>
              </a>
            );
          })}
        </div>

        <div className="moscow-side-menu-contact">
          <a href={site.tel ?? "tel:+971 50 780 0163"} style={{ "--item-i": 0 }}>
            <Phone size={16} />
            <WaveText delay={250}>{site.phone ?? "+971 50 780 0163"}</WaveText>
          </a>

          <span style={{ "--item-i": 1 }}>
            <MapPin size={16} />
            <WaveText delay={350}>Khalifa Street, Abu Dhabi</WaveText>
          </span>
        </div>
      </nav>
    </>
  );
}
