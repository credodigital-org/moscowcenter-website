import React, { useEffect, useRef, useState } from "react";
import "./TherapeuticDisciplines.css";
import { useHomeSlots } from "../../lib/cms";

import ayurvedaImage from "../../assets/images/authentic-ayurveda1.jpg";
import homeopathyImage from "../../assets/images/clinical-homeopathy1.png";
import cuppingImage from "../../assets/images/medical-cupping.png";

import T from "../../components/T";
const DEFAULT_THERAPIES = [
  {
    title: "Authentic Ayurveda",
    image: ayurvedaImage,
    alt: "Traditional Ayurvedic herbs and herbal preparations",
    description:
      "Assessment dictates alignment. We carefully evaluate individual patient biology before prescribing a structured  Internal & External therapeutic protocol.",
    label: "CLASSICAL VEDIC MEDICINE",
    icon: "✿",
  },
  {
    title: "Clinical Homeopathy",
    image: homeopathyImage,
    alt: "Homeopathic consultation between a practitioner and patient",
    description:
      "Highly customized individual constitutional treatment that stimulates the body's innate vital force to support healing and address acute and chronic illnesses.",
    label: "INDIVIDUALIZED GENTLE HEALING",
    icon: "▣",
  },
  {
    title: "Medical Cupping Therapy",
    image: cuppingImage,
    alt: "Practitioner performing a cupping therapy session",
    description:
      "Traditional suction and wet cupping (Hijama) promoting localized micro-circulation, lymphatic drainage, rapid myofascial release, and systemic pain relief.",
    label: "CIRCULATORY & PAIN DETOX",
    icon: "✥",
  },
];

const THERAPY_SLOTS = ["discipline-ayurveda", "discipline-homeopathy", "discipline-cupping"];

const directions = ["from-left", "from-up", "from-right"];

function TherapeuticDisciplinesView({ slots }) {
  // Each card can be customised in the CMS (Home Page → Therapeutic discipline cards).
  const therapies = DEFAULT_THERAPIES.map((t, i) => {
    const key = THERAPY_SLOTS[i];
    return {
      ...t,
      title: slots.text(key, "title", t.title),
      label: slots.text(key, "eyebrow", t.label),
      description: slots.text(key, "body", t.description),
      image: slots.image(key, t.image),
    };
  });
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
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`therapeutic-section ${visible ? "is-visible" : ""}`}
      id="therapies"
    >
      <div className="therapeutic-container">
        {/* Section heading */}
        <header className="therapeutic-header">
          <h2 className="th-reveal" style={{ "--delay": "0s" }}>
            <T k="home.therapeutic-disciplines.specialized-therapeutic-di-92f2" d={"Specialized Therapeutic Disciplines"} /></h2>

          <p className="th-reveal" style={{ "--delay": "0.2s" }}>
            <T k="home.therapeutic-disciplines.harmonizing-time-tested-cl-9604" d={"Harmonizing time-tested classical wisdom with physician-led clinical protocols to restore\nnatural vitality, balance metabolic pathways, and facilitate lifelong healing."} br={"className=\"therapeutic-desktop-break\""} /></p>
        </header>

        {/* Therapy cards */}
        <div className="therapeutic-grid">
          {therapies.map((therapy, i) => (
            <article
              className={`therapy-card th-card ${directions[i % 3]}`}
              style={{ "--delay": `${0.4 + i * 0.18}s`, "--i": i }}
              key={therapy.title}
            >
              <div className="therapy-image-wrapper">
                <img
                  className="therapy-image"
                  src={therapy.image}
                  alt={therapy.alt}
                  loading="lazy"
                />
              </div>

              <div className="therapy-card-content">
                <h3>{therapy.title}</h3>

                <p className="therapy-description">{therapy.description}</p>

                <span className="therapy-label">
                  <span className="therapy-label-icon" aria-hidden="true">
                    {therapy.icon}
                  </span>
                  {therapy.label}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TherapeuticDisciplines() {
  const slots = useHomeSlots();
  if (!slots) return null;
  return <TherapeuticDisciplinesView slots={slots} />;
}
