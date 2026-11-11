import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BadgeCheck,
  Stethoscope,
  Route,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import "./Service.css";
import { mapDepartment, slotImgProps, useCmsList, useSlotImage } from "../lib/cms";
import { TX } from "../components/T";
import { useSiteInfo } from "../lib/siteInfo";

/* ------------------------------------------
   ADD YOUR IMAGES HERE (src/assets/images/)
------------------------------------------- */
import heroImage from "../assets/images/service-hero.png";
import homeopathyImage from "../assets/images/service-homeopathy.png";
import ayurvedaImage from "../assets/images/service-ayurveda.png";
import cuppingImage from "../assets/images/service-cupping.png";

import T from "../components/T";
const CHIPS = [
  { icon: BadgeCheck, text: "DOH Abu Dhabi Licensed" },
  { icon: Stethoscope, text: "Board-Certified MD & BAMS" },
  { icon: Route, text: "Personalized Pathways" },
];

const DEFAULT_DISCIPLINES = [
  {
    image: homeopathyImage,
    alt: "Homeopathy consultation with a digital DNA illustration",
    tag: "CONSTITUTIONAL MEDICINE",
    title: "Classical Homeopathy",
    by: "Supervised by Dr. Ehab Makki (MD, PG Hom UK) & Dr. Monika Tyagi (BHMS,PGDCR,PGDHP)",
    text: "Homeopathic medicine is personalized medicine. It is an approach to healthcare that tailors disease prevention, diagnosis, and treatment to each individual by considering their unique genetic, biological, medical, nutritional, and lifestyle characteristics and prescribing the medicine accordingly.",
    conditions: [
      "Chronic Respiratory & Allergic Rhinitis",
      "Stress, Sleep Disturbances & Anxiety",
      "Hormonal Imbalances & Chronic Migraines",
      "Pediatric Immunity & Eczematous Skin Conditions",
    ],
    cta: "Book Homeopathy Desk",
  },
  {
    image: ayurvedaImage,
    alt: "Shirodhara treatment with a copper vessel",
    tag: "VEDIC TRADITION & PANCHAKARMA",
    title: "Authentic Kerala Ayurveda",
    by: "Supervised by Dr. Ashna Muhammad (BAMS, CPC)",
    text: "Ancient Sanskrit medical wisdom combining diagnostic Nadi Pariksha (pulse analysis), traditional botanical formulations, and external detoxifying therapies including Abhyangam and Kizhi.",
    conditions: [
      "Joint Degeneration & Musculoskeletal Pain",
      "Digestive Dysbiosis & Metabolic Sluggishness",
      "Systemic Panchakarma Detox & Rejuvenation",
      "Deep Nervous Exhaustion & Vata Disorders",
    ],
    cta: "Book Ayurvedic Therapies",
  },
  {
    image: cuppingImage,
    alt: "Medicinal cupping therapy using sterile single-use sets",
    tag: "CIRCULATORY & PAIN RELIEF",
    title: "Medicinal Cupping (Hijama)",
    by: "Licensed Clinical Practitioners • Single-Use Sterile Sets",
    text: "Targeted therapeutic suction promoting local micro-circulation, loosening myofascial trigger points, clearing metabolic stasis, and accelerating deep tissue physiological regeneration.",
    conditions: [
      "Chronic Spinal, Neck & Lumbar Tension",
      "Athletic Muscular Soreness & Sciatica",
      "Migraines & Cervicogenic Headaches",
      "Systemic Fatigue & Lymphatic Stagnation",
    ],
    cta: "Book Cupping Therapies",
  },
];

function ServicesView({ DISCIPLINES }) {
  const site = useSiteInfo();
  const heroSrc = useSlotImage("page-hero-services", heroImage);
  const reduce = useReducedMotion();

  const fade = (delay = 0, x = 0, y = 28) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, x, y },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: "easeOut" },
  });

  return (
    <main className="mihmc-svc">
      {/* ================= HERO ================= */}
      <section className="mihmc-svc-hero">
        <div className="mihmc-svc-hero-grid">
          <div className="mihmc-svc-hero-text">
            <motion.span className="mihmc-svc-pill" {...fade(0, 0, 14)}>
              <T k="services.services-page.integrative-medical-discip-0468" d={"INTEGRATIVE MEDICAL DISCIPLINES • ABU DHABI"} /></motion.span>

            <motion.h1 {...fade(0.1, -30, 0)}>
              <T k="services.services-page.our-holistic-healthcare-se-3705" d={"Our Holistic Healthcare Services"} /></motion.h1>

            <motion.p className="mihmc-svc-sub" {...fade(0.18, -30, 0)}>
              <T k="services.services-page.root-cause-healing-restora-5f95" d={"Root-Cause Healing & Restorative Care"} /></motion.p>

            <motion.p className="mihmc-svc-lead" {...fade(0.26, -30, 0)}>
              <T k="services.services-page.experience-personalized-ev-9be1" d={"Experience personalized, evidence-informed integrative medicine blending classical Homeopathy, authentic Kerala Ayurveda, and sterile Cupping Therapy (Hijama) under licensed clinical supervision."} /></motion.p>

            <motion.div className="mihmc-svc-actions" {...fade(0.34)}>
              <a href="/contact" className="mihmc-svc-btn dark">
                <T k="services.services-page.book-a-consultation-685a" d={"Book a Consultation"} /></a>
              <a href="#departments" className="mihmc-svc-btn soft">
                <T k="services.services-page.explore-departments-5a0a" d={"Explore Departments"} /></a>
            </motion.div>

            <motion.ul className="mihmc-svc-chips" {...fade(0.42)}>
              {CHIPS.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Icon size={12} />
                  <span><TX s="services.chips" d={text} /></span>
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div className="mihmc-svc-hero-media" {...fade(0.2, 40, 0)}>
            <img
              {...slotImgProps(heroSrc)}
              alt="Doctor consulting with a patient at MIHMC"
            />

            <motion.div
              className="mihmc-svc-desk"
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="mihmc-svc-desk-icon">
                <MapPin size={13} />
              </span>
              <div>
                <strong><T k="services.services-page.inpatient-clinical-excelle-4216" d={"Inpatient Clinical Excellence"} /></strong>
                <span><T k="services.services-page.khalifa-street-abu-dhabi-9887" d={"Khalifa Street, Abu Dhabi"} /></span>
              </div>
              <em><T k="services.services-page.active-desk-8d33" d={"ACTIVE DESK"} /></em>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="mihmc-svc-philosophy">
        <div className="mihmc-svc-inner">
          <motion.header className="mihmc-svc-center" {...fade()}>
            <span className="mihmc-svc-kicker"><T k="services.services-page.philosophy-of-care-e415" d={"PHILOSOPHY OF CARE"} /></span>
            <h2>
              <T k="services.services-page.a-comprehensive-approach-t-bfbe" d={"A Comprehensive Approach to Mind, Body,\nand Vitality"} br={"className=\"mihmc-br\""} /></h2>
          </motion.header>

          <motion.div className="mihmc-svc-philosophy-card" {...fade(0.1, 0, 36)}>
            <div className="mihmc-svc-philosophy-text">
              <p>
                <T k="services.services-page.at-moscow-international-ho-dc82" d={"At Moscow International Holistic Medical Centre, we treat the individual rather than merely suppressing surface symptomatology. By identifying foundational biological imbalances, environmental stressors, and constitutional predispositions, our medical board establishes a non-invasive, restorative roadmap tailored to each patient."} /></p>
              <p>
                <T k="services.services-page.our-clinical-practice-harm-b874" d={"Our clinical practice harmonizes centuries-old botanical wisdom with contemporary laboratory diagnostics, adhering strictly to the stringent governance of the Abu Dhabi Department of Health. Every consultation allows patient and practitioner the quiet space needed to map physiological recovery with precision."} /></p>
            </div>

            <blockquote className="mihmc-svc-quote">
              <span className="mihmc-svc-quote-mark" aria-hidden="true">
                99
              </span>
              <p>
                <T k="services.services-page.healing-is-not-the-applica-a230" d={"“Healing is not the application of brute force against symptoms, but the quiet recalibration of the body’s natural constitutional equilibrium.”"} /></p>
              <cite><T k="services.services-page.department-of-clinical-med-0837" d={"Department of Clinical Medicine"} /></cite>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ================= DISCIPLINES ================= */}
      <section className="mihmc-svc-disciplines" id="departments">
        <div className="mihmc-svc-inner">
          <motion.header className="mihmc-svc-disc-head" {...fade()}>
            <div>
              <span className="mihmc-svc-kicker"><T k="services.services-page.core-clinical-disciplines-f250" d={"CORE CLINICAL DISCIPLINES"} /></span>
              <h2>
                <T k="services.services-page.three-pathways-to-restorat-e57e" d={"Three Pathways to Restorative\nHealth"} br={"className=\"mihmc-br\""} /></h2>
            </div>
            <p>
              <T k="services.services-page.structured-therapeutic-sys-4333" d={"Structured therapeutic systems managed by credentialed medical specialists, tailored to chronic, preventative, and restorative health requirements."} /></p>
          </motion.header>

          <div className="mihmc-svc-cards">
            {DISCIPLINES.map((d, i) => (
              <motion.article
                key={d.title}
                className="mihmc-svc-card"
                {...fade(i * 0.15, 0, 40)}
                whileHover={reduce ? undefined : { y: -6 }}
              >
                <div className="mihmc-svc-card-photo">
                  <img src={d.image} alt={d.alt} loading="lazy" />
                  <span className="mihmc-svc-card-tag">{d.tag}</span>
                </div>

                <div className="mihmc-svc-card-body">
                  <h3>{d.title}</h3>
                  <p className="mihmc-svc-card-by">{d.by}</p>
                  <p className="mihmc-svc-card-text">{d.text}</p>

                  <h4><T k="services.services-page.key-conditions-addressed-e454" d={"KEY CONDITIONS ADDRESSED:"} /></h4>
                  <ul>
                    {d.conditions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>

                  <a href="/contact" className="mihmc-svc-card-btn">
                    {d.cta}
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mihmc-svc-cta-wrap">
        <motion.div className="mihmc-svc-cta" {...fade(0, 0, 36)}>
          <span className="mihmc-svc-cta-pill"><T k="services.services-page.direct-clinical-intake-3727" d={"DIRECT CLINICAL INTAKE"} /></span>

          <h2>
            <T k="services.services-page.begin-your-personalised-he-98a4" d={"Begin Your Personalised Healing\nJourney Today"} br={"className=\"mihmc-br\""} /></h2>

          <p>
            <T k="services.services-page.our-multidisciplinary-clin-8af3" d={"Our multidisciplinary clinical desk in Abu Dhabi is ready to guide your treatment pathway. Schedule your comprehensive consultation with our licensed medical specialists."} /></p>

          <div className="mihmc-svc-cta-actions">
            <a href="/contact" className="mihmc-svc-btn white">
              <T k="services.services-page.book-clinical-consultation-8429" d={"Book Clinical Consultation"} /></a>
            <a
              href={site.waLink ?? "https://wa.me/971507800163"}
              target="_blank"
              rel="noopener noreferrer"
              className="mihmc-svc-btn ghost"
            >
              <MessageCircle size={13} />
              WhatsApp Direct Concierge ({site.phone ?? "+971 507800163"})
            </a>
          </div>

          <ul className="mihmc-svc-cta-info">
            <li>
              <Phone size={11} />
              <span>
                <T k="services.services-page.direct-line-2b88" d={"Direct Line: "} /><a href={site.tel ?? "tel:+971507800163"}>{site.phone ?? "+971 50 780 0163"}</a>
              </span>
            </li>
            <li>
              <Clock size={11} />
              <span>
                <T k="services.services-page.hours-5e30" d={"Hours: "} /><strong><T k="services.services-page.tue-sun-10-00-am-9-00-pm-cba3" d={"Tue-Sun 10:00 AM - 9:00 PM"} /></strong>
              </span>
            </li>
            <li>
              <MapPin size={11} />
              <span><T k="services.services-page.khalifa-street-abu-dhabi-9887" d={"Khalifa Street, Abu Dhabi"} /></span>
            </li>
          </ul>

          <p className="mihmc-svc-cta-note">
            <ShieldCheck size={11} />
            <T k="services.services-page.strict-patient-data-privac-dd96" d={"Strict patient data privacy and Department of Health (DOH) medical regulations assured."} /></p>
        </motion.div>
      </section>
    </main>
  );
}

export default function Services() {
  // Published department cards (Services → "Services page") from the CMS.
  const rows = useCmsList("services", undefined);
  const departments =
    rows === null
      ? []
      : rows === undefined
        ? DEFAULT_DISCIPLINES
        : rows.filter((s) => s.kind === "department").map(mapDepartment);
  return <ServicesView DISCIPLINES={departments} />;
}
