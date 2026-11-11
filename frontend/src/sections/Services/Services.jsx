import React, { useEffect, useRef, useState } from "react";
import {
  HeartPulse,
  ShieldPlus,
  Activity,
  Accessibility,
  PersonStanding,
  CircleUserRound,
} from "lucide-react";
import "./Services.css";
import { mapServiceCard, useCmsList } from "../../lib/cms";

import T from "../../components/T";
const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "Stress-Related Metabolic and Weight Disorders",
    description: "Natural support for stress, weight, and metabolism.",
    icon: HeartPulse,
  },
  {
    id: 2,
    title: "Allergies and Immunology",
    description: "Natural support for allergies and immune system health.",
    icon: ShieldPlus,
  },
  {
    id: 3,
    title: "Stress-Related Gastrointestinal Disorders",
    description: "Natural support for stress-related digestive issues.",
    icon: Accessibility,
  },
  {
    id: 4,
    title: "Renal care",
    description: "Safe and gentle support for kidney health.",
    icon: Activity,
  },
  {
    id: 5,
    title: "Women’s Health and Emotional Well-Being",
    description: "Supporting women’s health and emotional balance.",
    icon: PersonStanding,
  },
  {
    id: 6,
    title: "Dermatological Care",
    description: "Natural care to support healthy skin and overall skin wellness.",
    icon: CircleUserRound,
  },
];

// true  = animation plays every time the section scrolls into view
// false = animation plays only the first time
const REPLAY_ON_SCROLL = true;

function ConditionsView({ services }) {
  const sectionRef = useRef(null);
  // "ready" = JS is running, so it is safe to hide items before revealing them.
  // "inView" = section is on screen, so play the reveal animation.
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setReady(true);

    const el = sectionRef.current;
    if (!el) return;

    // Very old browsers: just show everything.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!REPLAY_ON_SCROLL) observer.disconnect();
        } else if (REPLAY_ON_SCROLL) {
          setInView(false); // reset so it can play again next time
        }
      },
      {
        threshold: 0,
        // Trigger once the top of the section is ~15% up from the bottom edge
        rootMargin: "0px 0px -15% 0px",
      }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const stateClass = `${ready ? "svc2-ready" : ""} ${inView ? "svc2-in-view" : ""}`;

  return (
    <section
      ref={sectionRef}
      className={`svc2-section ${stateClass}`}
      id="home-services"
    >
      <div className="svc2-container">
        <header className="svc2-header">
          <h2><T k="home.services-conditions-we-car.our-services-7a77" d={"Our Services"} /></h2>

          <div className="svc2-tag">
            <span aria-hidden="true">♙</span>
            <T k="home.services-conditions-we-car.homeopathy-treatment-e29a" d={"Homeopathy Treatment"} /></div>

          <p>
            <T k="home.services-conditions-we-car.personalized-homeopathic-c-9a85" d={"Personalized homeopathic care based on individual needs to support overall well-being."} /></p>
        </header>

        <div className="svc2-grid">
          {services.map(({ id, title, description, icon: Icon }, index) => (
            <article
              className="svc2-card"
              key={id}
              style={{ "--card-index": index }}
            >
              <div className="svc2-icon" aria-hidden="true">
                <Icon size={23} strokeWidth={2} />
              </div>

              <div className="svc2-content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeConditions() {
  // Published "Home page — conditions we care for" from the CMS (Services → condition).
  const rows = useCmsList("services", undefined);
  if (rows === null) return null;
  const services =
    rows === undefined
      ? DEFAULT_SERVICES
      : rows.filter((s) => s.kind === "condition").map((s) => mapServiceCard(s, "heart-pulse"));
  if (!services.length) return null;
  return <ConditionsView services={services} />;
}
