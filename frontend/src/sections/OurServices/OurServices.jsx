import React, { useEffect, useRef, useState } from "react";
import {
  FlaskConical,
  Apple,
  PersonStanding,
  Smile,
  Sprout,
  Award,
} from "lucide-react";
import "./OurServices.css";
import { mapServiceCard, useCmsList } from "../../lib/cms";

import T from "../../components/T";
/* Seated meditation figure (lucide has no built-in one) */
function MeditationIcon({ size = 24, strokeWidth = 2, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M12 8v5" />
      <path d="M6 12l6-2 6 2" />
      <path d="M4 19c2-3 5-4 8-4s6 1 8 4" />
    </svg>
  );
}

const DEFAULT_SERVICES = [
  {
    title: "Authentic Ayurvedic Treatments",
    description: "For holistic healing",
    icon: FlaskConical,
  },
  {
    title: "Digestive Health",
    description: "Improve gut health naturally",
    icon: Apple,
  },
  {
    title: "Pain & Stress Relief",
    description: "Restore balance and wellbeing",
    icon: MeditationIcon,
  },
  {
    title: "Weight Management",
    description: "Support your natural balance",
    icon: PersonStanding,
  },
  {
    title: "Skin & Hair Care",
    description: "Natural care for healthy skin and hair",
    icon: Smile,
  },
  {
    title: "Personalized Treatment Plan",
    description: "Based on your unique needs and condition",
    icon: Sprout,
  },
];

function OurServicesView({ services }) {
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
      className={`our-services-section ${visible ? "is-visible" : ""}`}
      id="services"
    >
      <div className="our-services-container">
        {/* Heading */}
        <header className="our-services-header">
          <h2 className="svc-reveal" style={{ "--delay": "0s" }}>
            <T k="home.our-services-highlights.our-services-7a77" d={"Our Services"} /></h2>

          <div
            className="our-services-credentials svc-reveal"
            style={{ "--delay": "0.15s" }}
          >
            <span className="credentials-item">
              <Award className="credentials-medal" size={12} />
              <T k="home.our-services-highlights.ayurveda-treatment-8d43" d={"Ayurveda Treatment"} /></span>
          </div>

          <p className="svc-reveal" style={{ "--delay": "0.3s" }}>
            <T k="home.our-services-highlights.rooted-in-ancient-vedic-tr-d16e" d={"Rooted in ancient Vedic traditions and tailored to individual body constitutions for lasting\nholistic wellness."} br={"className=\"services-desktop-break\""} /></p>
        </header>

        {/* Services grid */}
        <div className="our-services-grid">
          {services.map((service, i) => {
            const Icon = service.icon;

            return (
              <article
                className={`our-service-card svc-card ${
                  i % 2 === 0 ? "from-left" : "from-right"
                }`}
                style={{ "--delay": `${0.45 + i * 0.12}s`, "--i": i }}
                key={service.title}
              >
                <div className="our-service-icon">
                  <Icon size={21} strokeWidth={2.1} />
                </div>

                <div className="our-service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function OurServices() {
  // Published "Home page — Our Services highlights" from the CMS (Services → highlight).
  const rows = useCmsList("services", undefined);
  if (rows === null) return null;
  const services =
    rows === undefined
      ? DEFAULT_SERVICES
      : rows.filter((s) => s.kind === "highlight").map((s) => mapServiceCard(s, "sparkles"));
  if (!services.length) return null;
  return <OurServicesView services={services} />;
}
