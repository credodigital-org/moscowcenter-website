import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BadgeCheck,
  Leaf,
  UserCheck,
  Clock,
  ArrowRight,
  Quote,
  CircleDot,
  Droplet,
  ShieldCheck,
  Users,
  Activity,
  Bone,
  Brain,
  Zap,
  Flower2,
  Moon,
  BatteryLow,
  ClipboardCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import "./Treatments.css";
import RelaxationSlider from "./RelaxationSlider";
import { mapTreatmentCard, slotImgProps, useCmsList, useSlotImage } from "../lib/cms";
import { TX } from "../components/T";

/* ------------------------------------------
   ADD YOUR IMAGES in: src/assets/images/treatments/
   (names below; change the paths if yours differ)
------------------------------------------- */
import heroImg from "../assets/images/treatments-hero1.jpeg";

import maderoImg from "../assets/images/madero-therapy.png";
import facialImg from "../assets/images/herbal-facial1.jpeg";
import hairImg from "../assets/images/herbal-hair-pack.png";
import aromaImg from "../assets/images/organic-aroma.png";
import scrubImg from "../assets/images/body-scrub.png";
import nasyamImg from "../assets/images/nasyam.png";

import steamImg from "../assets/images/treatments/abhyangam-steam.png";
import shirodharaImg from "../assets/images/treatments/shirodhara.png";
import kizhiImg from "../assets/images/treatments/abhyangam-kizhi.png";
import reflexImg from "../assets/images/treatments/foot-reflexology.png";

import obesityImg from "../assets/images/treatments/package-obesity.png";
import postnatalImg from "../assets/images/treatments/package-postnatal.png";
import neckImg from "../assets/images/treatments/package-neck.png";
import backImg from "../assets/images/treatments/package-back.png";

import homeoOneImg from "../assets/images/treatments/homeo-assessment.png";
import homeoTwoImg from "../assets/images/treatments/homeo-emotional.png";
import homeoThreeImg from "../assets/images/treatments/homeo-lifestyle.png";

import cuppingImg from "../assets/images/treatments/cupping-therapy.png";

import T from "../components/T";
/* ---------------- DATA ---------------- */

const CHIPS = ["DOH Licensed Facility", "100% Herbal & Medicated Oils", "Certified Therapists"];

const DEFAULT_AYURVEDA = [
  {
    img: maderoImg, mins: "45 Mins", tag: "WOOD THERAPY • BODY CONTOURING",
    title: "Madero Therapy",
    sub: "Natural Wood Body Contouring & Lymphatic Drainage",
    text: "A natural body massage technique using specially designed wooden tools to provide a firm, rhythmic massage that supports circulation, reduces cellulite, provides body contouring, skin toning, deep relaxation, and improves lymphatic drainage.",
  },
  {
    img: facialImg, mins: "50 Mins", tag: "MUKHA LEPAM • BOTANICAL RADIANCE",
    title: "Herbal Facials",
    sub: "Ayurvedic Botanical Skin Rejuvenation",
    text: "Personalized herbal and Ayurvedic facial treatments using carefully selected natural ingredients to cleanse, nourish, refresh, and enhance the natural appearance of the skin with custom medicinal oils.",
  },
  {
    img: hairImg, mins: "40 Mins", tag: "SHIRO LEPAM • FOLLICULAR HEALTH",
    title: "Herbal Hair Pack",
    sub: "Scalp Care & Follicle Nourishment Ritual",
    text: "A deeply nourishing herbal hair treatment using selected Ayurvedic ingredients like amla, bhringaraj, and aloe vera to support scalp circulation, hair vitality, and healthy-looking, well-conditioned hair.",
  },
  {
    img: aromaImg, mins: "60 Mins", tag: "SENSORY EQUILIBRIUM • NEURO-CALM",
    title: "Organic Aroma Therapy",
    sub: "Therapeutic Sensory Stress Relief & Sleep Restoration",
    text: "Ease stress, anxiety, and mental fatigue while boosting deep feelings of relaxation. Improves restful sleep and helps support restorative overall quality of life using certified organic botanical essences.",
  },
  {
    img: scrubImg, mins: "40 Mins", tag: "UDVARTHANAM • MEDICATED HERBAL POLISH",
    title: "Ayurvedic Body Scrub",
    sub: "Traditional Exfoliating Herbal Powder Therapy",
    text: "A therapeutic Ayurvedic scrub using traditional Ayurvedic powders and natural botanicals to gently exfoliate and refresh the skin. Stimulates lymphatic circulation and helps release deep tension.",
  },
  {
    img: nasyamImg, mins: "30 - 45 Mins", tag: "PANCHAKARMA SHODHANA • CRANIAL CARE",
    title: "Nasyam Therapy",
    sub: "Classical Panchakarma Nasal Therapy",
    text: "A traditional Ayurvedic nasal therapy where carefully selected medicated oils or herbal extracts are administered through the nasal passages to support sinus relief, headache, migraine, and respiratory wellness.",
  },
];

const RELAXATION = [
  { img: steamImg, title: "Abhyangam + Steam", text: "Traditional full-body oil massage." },
  { img: shirodharaImg, title: "Shirodhara", text: "Traditional relaxation therapy." },
  { img: kizhiImg, title: "Abhyangam + Potli Kizhi", text: "Oil massage with herbal poultice therapy." },
  { img: reflexImg, title: "Foot Reflexology", text: "A foot-focused relaxation treatment." },
];

const DEFAULT_PACKAGES = [
  { img: obesityImg, title: "Obesity Management", text: "Individualised weight-management support." },
  { img: postnatalImg, title: "Postnatal Care", text: "Personalised care after childbirth." },
  { img: neckImg, title: "Neck Pain Care", text: "Traditional therapies selected after assessment." },
  { img: backImg, title: "Back Pain Care", text: "Individualised support for back discomfort." },
];

const DEFAULT_HOMEO = [
  {
    img: homeoOneImg, tag: "BIOLOGICAL & DIAGNOSTIC",
    title: "1) Comprehensive Physical Assessment and Diagnosis",
    text: "We begin by understanding the physical and biological aspects of the condition through accurate medical evaluation, including laboratory investigations, imaging studies, and appropriate diagnostic methods. This helps us identify the nature of the health condition and understand the possible underlying organic factors contributing to it.",
    chips: ["Lab Investigations", "Imaging Studies", "Organic Factors"],
  },
  {
    img: homeoTwoImg, tag: "PSYCHOSOMATIC HARMONY",
    title: "2) Psychological and Emotional Factors",
    text: "In homeopathy, we explore the deeper aspects that may influence a person’s health. We consider the impact of emotional and psychological states, daily stress, and accumulated emotions such as sadness, anxiety, and frustration. These factors may influence the body’s balance and overall well-being. The mind and body are deeply connected, and emotional experiences play an important role in an individual’s health journey.",
    chips: ["Stress & Tension", "Emotional Balance", "Mind-Body Connection"],
  },
  {
    img: homeoThreeImg, tag: "NUTRITION & DAILY RHYTHMS",
    title: "3) Lifestyle and Daily Habits",
    text: "We also focus on lifestyle factors, nutritional habits, and daily behaviors, as they represent an essential part of the complete health picture. Nutrition, quality of sleep, physical activity, stress management, and everyday habits may all contribute to maintaining health or influencing the development and progression of health conditions.",
    chips: ["Nutritional Habits", "Sleep Quality", "Daily Behaviors"],
  },
];

const BENEFITS = [
  { icon: Activity, title: "Muscle, Back & Neck Pain", text: "Relieves localised spasms, stiffness, and postural strain." },
  { icon: Bone, title: "Disc-Related Pain", text: "Nonsurgical support for disc decompression and nerve soothing." },
  { icon: Brain, title: "Tension Headaches", text: "Releases suboccipital constriction and shoulder tightness." },
  { icon: Zap, title: "Migraine Headaches", text: "Promotes cerebral microcirculation and vascular equilibrium." },
  { icon: Flower2, title: "Stress & Muscle Tension", text: "Stimulates parasympathetic relaxation across muscle belts." },
  { icon: Moon, title: "Insomnia & Sleep Issues", text: "Boosts deep restful sleep through nervous system relaxation." },
  { icon: BatteryLow, title: "Fatigue & Low Energy", text: "Tackles systemic sluggishness, restoring cellular vitality." },
];

const WHY = [
  {
    icon: BadgeCheck, tag: "DOH Licensed",
    title: "Performed by Qualified & Licensed Professionals",
    text: "Clinical treatments administered exclusively by certified and licensed medical practitioners adhering to UAE health regulations.",
  },
  {
    icon: ClipboardCheck, tag: "Pre-Therapy Vitals",
    title: "Individual Health Assessment Before Treatment",
    text: "Comprehensive diagnostic consultation and screening conducted prior to therapy to ensure optimal efficacy and patient safety.",
  },
  {
    icon: ShieldCheck, tag: "Aseptic Standard",
    title: "Strict Adherence to Hygiene & Sterilization",
    text: "Medical-grade infection control, single-use sterile disposable supplies, and hospital-grade sterilization protocols.",
  },
  {
    icon: SlidersHorizontal, tag: "Bespoke Protocol",
    title: "Custom Technique Selection for Your Needs",
    text: "Tailored selection between dry and wet cupping (Hijama) based on your specific constitution, symptoms, and health goals.",
  },
];

/* ---------------- COMPONENT ---------------- */

// AYURVEDA / PACKAGES / HOMEO come from the CMS (Treatments); the original content is the offline default.
function TreatmentsView({ AYURVEDA, PACKAGES, HOMEO }) {
  const heroSrc = useSlotImage("page-hero-treatments", heroImg);
  const cuppingSrc = useSlotImage("treatments-cupping", cuppingImg);
  const reduce = useReducedMotion();

  const fade = (delay = 0, x = 0, y = 28) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, x, y },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.75, delay: reduce ? 0 : delay, ease: "easeOut" },
  });

  const hover = reduce ? undefined : { y: -6 };

  const Head = ({ kicker, title, sub, left }) => (
    <motion.header className={`mihmc-tr-head ${left ? "left" : ""}`} {...fade()}>
      {kicker && <span className="mihmc-tr-kicker">{kicker}</span>}
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </motion.header>
  );

  return (
    <main className="mihmc-tr">
      {/* ================= HERO ================= */}
      <section className="mihmc-tr-hero">
        <div className="mihmc-tr-hero-grid">
          <div className="mihmc-tr-hero-text">
            <motion.span className="mihmc-tr-pill" {...fade(0, 0, 14)}>
              <Leaf size={10} /> <T k="treatments.treatments-page.holistic-healing-wellness--a2b0" d={"HOLISTIC HEALING & WELLNESS THERAPIES"} /></motion.span>
            <motion.h1 {...fade(0.1, -30, 0)}><T k="treatments.treatments-page.our-special-treatments-a0fb" d={"Our Special Treatments"} /></motion.h1>
            <motion.p {...fade(0.2, -30, 0)}>
              <T k="treatments.treatments-page.experience-personalized-do-e4db" d={"Experience personalized, doctor-guided, authentic Ayurvedic therapies, Homeopathy and Cupping Therapy designed to support your body’s natural balance, promote overall well-being, and restore vitality in Abu Dhabi."} /></motion.p>
            <motion.ul className="mihmc-tr-chips" {...fade(0.3)}>
              {CHIPS.map((c) => (
                <li key={c}>
                  <BadgeCheck size={11} /> <TX s="treatments.chips" d={c} />
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div className="mihmc-tr-hero-card" {...fade(0.2, 40, 0)}>
            <img {...slotImgProps(heroSrc)} alt="Medicated herbal infusions used in Ayurvedic therapy" />
            <div className="mihmc-tr-hero-caption">
              <span><Leaf size={10} /> <T k="treatments.treatments-page.medicated-herbal-infusions-b5b1" d={"Medicated Herbal Infusions"} /></span>
              <em><T k="treatments.treatments-page.under-bams-physician-super-def8" d={"Under BAMS Physician Supervision"} /></em>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= AYURVEDIC TREATMENTS ================= */}
      <section className="mihmc-tr-section">
        <div className="mihmc-tr-inner">
          <Head title="Ayurvedic Treatments" />
          <div className="mihmc-tr-grid-3">
            {AYURVEDA.map((t, i) => (
              <motion.article key={t.title} className="mihmc-tr-card" {...fade((i % 3) * 0.12, 0, 36)} whileHover={hover}>
                <div className="mihmc-tr-card-photo">
                  <img src={t.img} alt={t.title} loading="lazy" />
                  <span className="mihmc-tr-mins"><Clock size={9} /> {t.mins}</span>
                </div>
                <div className="mihmc-tr-card-body">
                  <span className="mihmc-tr-tag">{t.tag}</span>
                  <h3>{t.title}</h3>
                  <strong>{t.sub}</strong>
                  <p>{t.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PACKAGES ================= */}
      <section className="mihmc-tr-section packages">
        <div className="mihmc-tr-inner">
          <motion.header className="mihmc-tr-pkg-head" {...fade()}>
            <span className="mihmc-tr-kicker"><T k="treatments.treatments-page.personalized-traditional-c-ee89" d={"PERSONALIZED TRADITIONAL CARE"} /></span>
            <h2><T k="treatments.treatments-page.ayurvedic-treatments-packa-2208" d={"Ayurvedic Treatments & Packages"} /></h2>
            <p><T k="treatments.treatments-page.explore-traditional-therap-95ba" d={"Explore traditional therapies and personalised care options."} /></p>
            <a href="/contact" className="mihmc-tr-btn dark"><T k="treatments.treatments-page.book-an-appointment-8319" d={"Book an Appointment"} /></a>
          </motion.header>

          <h3 className="mihmc-tr-subhead"><T k="treatments.treatments-page.relaxation-therapies-d671" d={"Relaxation Therapies"} /></h3>

          <RelaxationSlider />

          <motion.div className="mihmc-tr-packages" {...fade(0, 0, 32)}>
            <h3><T k="treatments.treatments-page.specialised-care-packages-06d6" d={"Specialised Care Packages"} /></h3>
            <ul>
              {PACKAGES.map((p) => (
                <li key={p.title}>
                  <img src={p.img} alt="" loading="lazy" />
                  <div>
                    <strong>{p.title}</strong>
                    <span>{p.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="mihmc-tr-banner" {...fade(0, 0, 32)}>
            <h3><T k="treatments.treatments-page.find-the-right-treatment-f-f694" d={"Find the Right Treatment for You"} /></h3>
            <p><T k="treatments.treatments-page.speak-with-our-team-to-arr-1be8" d={"Speak with our team to arrange a consultation."} /></p>
            <a href="/contact" className="mihmc-tr-btn white"><T k="treatments.treatments-page.book-an-appointment-8319" d={"Book an Appointment"} /></a>
          </motion.div>
        </div>
      </section>

      {/* ================= HOMEOPATHY ================= */}
      <section className="mihmc-tr-section homeo">
        <div className="mihmc-tr-inner">
          <motion.header className="mihmc-tr-head" {...fade()}>
            <h2><T k="treatments.treatments-page.homeopathy-treatments-8965" d={"Homeopathy Treatments"} /></h2>
            <p>
              <T k="treatments.treatments-page.homeopathy-is-a-personaliz-66f0" d={"Homeopathy is a personalized and holistic approach that views each person as a unique individual with interconnected physical, emotional, and lifestyle aspects."} /></p>
            <p className="second">
              <T k="treatments.treatments-page.through-a-comprehensive-as-0b1c" d={"Through a comprehensive assessment, we aim to understand the possible underlying factors and contributing causes related to health challenges, and provide an individualized homeopathic treatment approach based on each person’s unique profile."} /></p>
          </motion.header>

          <div className="mihmc-tr-grid-3">
            {HOMEO.map((h, i) => (
              <motion.article key={h.title} className="mihmc-tr-card" {...fade(i * 0.14, 0, 36)} whileHover={hover}>
                <div className="mihmc-tr-card-photo tall">
                  <img src={h.img} alt={h.title} loading="lazy" />
                  <span className="mihmc-tr-photo-tag">{h.tag}</span>
                </div>
                <div className="mihmc-tr-card-body">
                  <h3 className="sm">{h.title}</h3>
                  <p>{h.text}</p>
                  <div className="mihmc-tr-mini-chips">
                    {h.chips.map((c) => <span key={c}>{c}</span>)}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div className="mihmc-tr-goal" {...fade(0, 0, 32)}>
            <div>
              <span className="mihmc-tr-goal-pill"><Sparkles size={9} /> <T k="treatments.treatments-page.clinical-purpose-c765" d={"CLINICAL PURPOSE"} /></span>
              <h3><T k="treatments.treatments-page.the-goal-of-this-approach-3760" d={"The Goal of This Approach"} /></h3>
              <p>
                <T k="treatments.treatments-page.the-goal-is-to-achieve-a-c-da43" d={"The goal is to achieve a comprehensive understanding of each individual and develop a personalized approach that considers the physical, emotional, and lifestyle dimensions of health. By addressing the person as a whole, we aim to support balance, enhance well-being, and promote a healthier way of living."} /></p>
              <a href="/contact" className="mihmc-tr-btn white"><T k="treatments.treatments-page.book-an-appointment-8319" d={"Book an Appointment"} /></a>
            </div>
            <blockquote>
              <Quote size={14} aria-hidden="true" />
              <p><T k="treatments.treatments-page.because-true-healing-begin-fd6f" d={"“Because true healing begins with understanding the person — not only understanding the disease.”"} /></p>
              <cite><T k="treatments.treatments-page.moscow-international-holis-721f" d={"MOSCOW INTERNATIONAL HOLISTIC MEDICAL CENTER"} /></cite>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ================= CUPPING ================= */}
      <section className="mihmc-tr-section cupping">
        <div className="mihmc-tr-inner">
          <Head
            kicker="YOUR PATH TO RELAXATION AND WELL-BEING"
            title="What Is Cupping Therapy?"
            sub="Cupping therapy is a complementary therapy that uses specially designed cups to create suction on the skin, stimulating the underlying tissues and local blood circulation."
          />

          <div className="mihmc-tr-cup-intro">
            <motion.div className="mihmc-tr-cup-left" {...fade(0, -36, 0)}>
              <div className="mihmc-tr-type">
                <span><CircleDot size={14} /></span>
                <div>
                  <h4><T k="treatments.treatments-page.dry-cupping-bff2" d={"Dry Cupping"} /></h4>
                  <p><T k="treatments.treatments-page.uses-therapeutic-suction-w-21ec" d={"Uses therapeutic suction without making incisions in the skin, mobilizing blood flow and loosening persistent myofascial trigger points."} /></p>
                </div>
              </div>
              <div className="mihmc-tr-type">
                <span><Droplet size={14} /></span>
                <div>
                  <h4><T k="treatments.treatments-page.wet-cupping-hijama-066b" d={"Wet Cupping (Hijama)"} /></h4>
                  <p><T k="treatments.treatments-page.involves-superficial-micro-7a24" d={"Involves superficial, micro-fine skin incisions performed under appropriate medical and infection-control protocols to clear metabolic stasis and toxins."} /></p>
                </div>
              </div>
              <div className="mihmc-tr-assure">
                <span><ShieldCheck size={12} /> <T k="treatments.treatments-page.hospital-grade-aseptic-sta-719c" d={"Hospital-grade aseptic standards (DOH UAE compliant)"} /></span>
                <span><Users size={12} /> <T k="treatments.treatments-page.separate-male-female-priva-2e3e" d={"Separate male & female private suites"} /></span>
              </div>
            </motion.div>

            <motion.div className="mihmc-tr-cup-photo" {...fade(0.12, 36, 0)}>
              <img {...slotImgProps(cuppingSrc)} alt="Cupping therapy treatment" loading="lazy" />
            </motion.div>
          </div>

          <motion.div className="mihmc-tr-benefits-wrap" {...fade(0, 0, 32)}>
            <span className="mihmc-tr-kicker"><T k="treatments.treatments-page.targeted-relief-recovery-c370" d={"TARGETED RELIEF & RECOVERY"} /></span>
            <h2 className="sm"><T k="treatments.treatments-page.potential-benefits-of-cupp-a908" d={"Potential Benefits of Cupping Therapy"} /></h2>
            <p><T k="treatments.treatments-page.cupping-therapy-may-help-r-18cf" d={"Cupping therapy may help relieve symptoms associated with:"} /></p>

            <div className="mihmc-tr-benefits">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="mihmc-tr-benefit">
                  <span><Icon size={14} /></span>
                  <h4><TX s="treatments.benefits" d={title} /></h4>
                  <p><TX s="treatments.benefits" d={text} /></p>
                </div>
              ))}
            </div>

            <a href="/contact" className="mihmc-tr-btn dark">
              <T k="treatments.treatments-page.book-cupping-session-d094" d={"BOOK CUPPING SESSION "} /><ArrowRight size={12} />
            </a>
          </motion.div>

          <Head
            kicker="YOUR HEALTH IS OUR PRIORITY"
            title="Why Choose Our Cupping Therapy Service?"
            sub="Experience peace of mind with clinical excellence, hospital-grade sterile environments, and attentive doctor supervision at every stage."
          />

          <div className="mihmc-tr-why">
            {WHY.map(({ icon: Icon, tag, title, text }, i) => (
              <motion.article key={title} className="mihmc-tr-why-card" {...fade(i * 0.1, 0, 32)} whileHover={hover}>
                <span className="mihmc-tr-why-icon"><Icon size={14} /></span>
                <h4><TX s="treatments.why" d={title} /></h4>
                <p><TX s="treatments.why" d={text} /></p>
                <em><UserCheck size={9} /> <TX s="treatments.why" d={tag} /></em>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Treatments() {
  const rows = useCmsList("treatments", undefined);
  let groups;
  if (rows === undefined) {
    groups = { AYURVEDA: DEFAULT_AYURVEDA, PACKAGES: DEFAULT_PACKAGES, HOMEO: DEFAULT_HOMEO };
  } else {
    const pick = (category) =>
      (rows || []).filter((t) => t.category === category && t.show_on_page).map(mapTreatmentCard);
    groups = { AYURVEDA: pick("ayurveda"), PACKAGES: pick("package"), HOMEO: pick("homeopathy") };
  }
  return <TreatmentsView {...groups} />;
}
