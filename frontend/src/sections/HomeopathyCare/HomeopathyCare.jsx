import React, { useEffect, useRef, useState } from "react";
import "./HomeopathyCare.css";

import defaultHomeopathyImage from "../../assets/images/homeopathy-care1.png";
import { useHomeSlots } from "../../lib/cms";

import T from "../../components/T";
function HomeopathyCareView({ slots }) {
  const homeopathyImage = slots.image("homeopathy-care", defaultHomeopathyImage);
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`homeopathy-care-section ${visible ? "is-visible" : ""}`}
      id="homeopathy-care"
    >
      <div className="homeopathy-care-container">
        {/* Left image */}
        <div
          className="homeopathy-care-image-wrapper hc-reveal hc-left"
          style={{ "--delay": "0s" }}
        >
          <img
            src={homeopathyImage}
            alt="Homeopathic doctor consulting a patient with natural remedies"
            className="homeopathy-care-image"
            loading="lazy"
          />
        </div>

        {/* Right content */}
        <div className="homeopathy-care-content">
          <h2 className="hc-reveal hc-right" style={{ "--delay": "0.2s" }}>
            <T k="home.personalised-homeopathy-ca.personalised-c43a" d={"Personalised\nHomeopathy Care"} br={"className=\"homeopathy-desktop-break\""} /></h2>

          <p className="hc-reveal hc-right" style={{ "--delay": "0.4s" }}>
            <T k="home.personalised-homeopathy-ca.at-moscow-international-ho-0d6e" d={"At Moscow International Holistic Medical Center, our homeopathy care is designed around each individual’s health needs, concerns, and overall well-being. We focus on understanding the person as a whole and providing a personalized approach to care."} /></p>

          <p className="hc-reveal hc-right" style={{ "--delay": "0.6s" }}>
            <T k="home.personalised-homeopathy-ca.your-unique-dna-your-perso-8cbd" d={"Your unique DNA your personlised medicine. Homeopathic medicine is personalized medicine. It is an approach to healthcare that tailors disease prevention, diagnosis, and treatment to each individual by considering their unique genetic, biological, medical, nutritional, and lifestyle characteristics and prescribing the medicine accordingly."} /></p>

          <div className="hc-reveal hc-up" style={{ "--delay": "0.85s" }}>
            <a href="#appointment" className="homeopathy-consultation-button">
              <T k="home.personalised-homeopathy-ca.book-a-consultation-685a" d={"Book a Consultation"} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeopathyCare() {
  const slots = useHomeSlots();
  if (!slots) return null;
  return <HomeopathyCareView slots={slots} />;
}
