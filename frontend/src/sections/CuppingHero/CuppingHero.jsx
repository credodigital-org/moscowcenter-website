import React, { useEffect, useRef, useState } from "react";
import "./CuppingHero.css";

import defaultCuppingHeroImage from "../../assets/images/cupping-hero.png";
import { useHomeSlots } from "../../lib/cms";

import T from "../../components/T";
function CuppingHeroView({ slots }) {
  const cuppingHeroImage = slots.image("cupping-hero", defaultCuppingHeroImage);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`cupping-hero-section ${visible ? "is-visible" : ""}`}
      id="cupping-therapy"
    >
      <img
        className="cupping-hero-background"
        src={cuppingHeroImage}
        alt="Traditional cupping therapy treatment session"
      />

      <div className="cupping-hero-shade" />

      <div className="cupping-hero-container">
        <div className="cupping-hero-panel ch-panel">
          <h1>
            <span className="ch-reveal" style={{ "--delay": "0.5s" }}>
              <T k="home.cupping-therapy-banner.cupping-eedf" d={"Cupping"} /></span>
            <span
              className="cupping-heading-accent ch-reveal"
              style={{ "--delay": "0.7s" }}
            >
              <T k="home.cupping-therapy-banner.therapy-ff82" d={"Therapy."} /></span>
          </h1>

          <p className="ch-reveal" style={{ "--delay": "0.9s" }}>
            <T k="home.cupping-therapy-banner.traditional-suction-therap-69f9" d={"Traditional suction therapy for relaxation and wellness. Cupping therapy is a traditional therapy where special cups are placed on the skin to create suction. The suction gently pulls the skin upward and may leave temporary circular marks."} /></p>

          <div className="ch-reveal" style={{ "--delay": "1.1s" }}>
            <a href="#appointment" className="cupping-hero-button">
              <T k="home.cupping-therapy-banner.book-a-consultation-685a" d={"Book a Consultation"} /></a>
          </div>

          <div className="cupping-panel-divider" />
        </div>
      </div>
    </section>
  );
}

export default function CuppingHero() {
  const slots = useHomeSlots();
  if (!slots) return null;
  return <CuppingHeroView slots={slots} />;
}
