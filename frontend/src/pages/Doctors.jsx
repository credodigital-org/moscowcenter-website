import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Award,
  ShieldCheck,
  HeartPulse,
  Languages,
  CalendarDays,
  MessageCircle,
  Brain,
  Scale,
  Activity,
  Apple,
  Baby,
  Sparkles,
  Wind,
  Droplet,
  Leaf,
  Waves,
  Bone,
  FlaskConical,
  CircleDot,
  Flower2,
  Mic,
  Stethoscope,
  BadgeCheck,
} from "lucide-react";
import "./Doctors.css";
import { mapDoctorProfile, useCmsList } from "../lib/cms";
import { TX } from "../components/T";

/* Photos already used by your team section */
import ehabImage from "../assets/images/dr-ehab-makki.jpg";
import monikaImage from "../assets/images/dr-monika-tyagi.jpg";
import ashnaImage from "../assets/images/dr-ashna-muhammad.jpg";
import obaidullahImage from "../assets/images/dr-obaidullah.png";

import T from "../components/T";
const CLINIC_WHATSAPP = "https://wa.me/971507800163";

const STATS = [
  { icon: Award, title: "17+ Years", text: "UAE Clinical Practice" },
  { icon: ShieldCheck, title: "DOH & DataFlow", text: "Verified Physicians" },
  { icon: HeartPulse, title: "Root-Cause Care", text: "Zero Side-Effects Protocols" },
  { icon: Languages, title: "Multilingual", text: "EN • AR • HI • UR • ML" },
];

const DEFAULT_DOCTORS = [
  {
    id: "dr-ehab-makki",
    tag: "CLINICAL FACULTY DOSSIER • HOMEOPATHY",
    name: "Dr. Ehab Makki",
    sub: "MD, PG (Homeopathy) UK • Managing Director",
    quote: "Understanding the Root Cause... Supporting the Body’s Healing Journey.",
    paragraphs: [
      "Dr. Ehab Makki serves as Managing Director and Senior Homeopathy Practitioner at Moscow International Holistic Medical Center. He graduated from N.H. Medical College, Maharashtra University of Health Sciences, and completed comprehensive Post-Graduation in Homeopathy from Allen College of Homoeopathy, UK. He also holds a prestigious Diplomate credential from the American Academy of Aesthetic Medicine (AAAM).",
      "With more than 17 continuous years treating complex systemic and chronic illnesses in the United Arab Emirates, Dr. Makki champions an individualized, cellular-level therapeutic philosophy that looks beyond mere symptom management.",
    ],
    highlight: {
      icon: FlaskConical,
      title: "Cellular & Physiological Healing Model",
      text: "Dr. Makki focuses on deciphering subtle internal bio-mechanisms, chronic neuro-endocrine exhaustion, suppressed emotional trauma, and systemic cellular stress to curate bio-resonant homeopathic remedies that restore natural homeostasis without toxic load.",
    },
    sections: [
      {
        heading: "When Stress Affects the Body: Mind, Cells & Physical Balance",
        cards: [
          { icon: Brain, title: "Stress & Mental Well-Being", text: "Chronic anxiety states, nervous exhaustion, panic disorders, emotional shock, and psychosomatic symptoms." },
          { icon: Scale, title: "Weight & Metabolism", text: "Stress-induced obesity, metabolic dysregulation, Type 2 diabetes adjunct care, dyslipidemia, and arterial fatigue." },
          { icon: Activity, title: "Hormonal & Endocrine Balance", text: "Natural fertility optimization, Polycystic Ovarian Syndrome (PCOS), thyroid disorders, and menstrual irregularities." },
          { icon: Apple, title: "Stress & Gastrointestinal Health", text: "Irritable Bowel Syndrome (IBS), chronic GERD, ulcerative colitis adjuncts, and gut-microbiome axis revitalization." },
        ],
      },
    ],
    note: { icon: Mic, text: "Regular International Speaker & Health Educator across Europe and the GCC." },
    photo: ehabImage,
    photoLabel: "Managing Director & Senior Physician",
    facts: [
      ["LICENSURE", "DOH Abu Dhabi"],
      ["EXPERIENCE", "17+ Years in UAE"],
      ["LANGUAGES", "Arabic, English"],
      ["EDUCATION", "Allen College, UK"],
    ],
    book: "Book with Dr. Ehab",
    whatsapp: { label: "Direct WhatsApp Inquiry", href: CLINIC_WHATSAPP },
  },
  {
    id: "dr-monika-tyagi",
    tag: "CLINICAL FACULTY DOSSIER • PEDIATRIC & FAMILY CARE",
    name: "Dr. Monika Tyagi",
    sub: "BHMS, PGDCR, PGDHP • DOH-Licensed Homeopathy Practitioner",
    quote: "True health isn’t just the absence of illness—it’s the perfect harmony of body, mind, and soul.",
    paragraphs: [
      "Bringing 15+ years of distinguished clinical experience across premier institutions in India and the United Arab Emirates, Dr. Monika Tyagi provides an unhurried, deeply empathetic space for families and individuals. She is renowned for gentle constitutional homeopathy that nurtures long-term pediatric resilience and natural female hormonal balance.",
      "Dr. Tyagi holds BHMS, Post Graduate Diplomas in Clinical Research (PGDCR) post graduate diploma in Health Promotion, and is fully certified and DataFlow verified by the Department of Health (DOH) Abu Dhabi. Consultations are delivered with native fluency in English, Hindi, and Urdu.",
    ],
    stages: {
      heading: "The 3-Step Gentle Healing Protocol",
      items: [
        { no: "STAGE 01", title: "In-Depth Case Analysis", text: "A 60-minute intake analyzing hereditary patterns, lifestyle stressors, and emotional triggers." },
        { no: "STAGE 02", title: "Constitutional Prescription", text: "Precise, ultra-dilute German and British pharmacopoeial homeopathic remedies selected for systemic harmony." },
        { no: "STAGE 03", title: "Long-Term Partnership", text: "Structured follow-ups, pediatric milestone tracking, and seasonal immune modulation." },
      ],
    },
    sections: [
      {
        heading: "Comprehensive Conditions Treated",
        cards: [
          { icon: Baby, title: "Pediatric & Children’s Health", text: "Recurrent tonsillitis, adenoids, childhood asthma, ADHD support, bedtime enuresis, low immunity." },
          { icon: HeartPulse, title: "Women’s Health & Gynecology", text: "PCOD/PCOS, dysmenorrhea, fibroid support, perimenopausal mood swings, chronic migraines." },
          { icon: Sparkles, title: "Dermatology & Skin Restorative", text: "Chronic eczema, stubborn psoriasis, urticaria hives, cystic acne, recalcitrant warts, alopecia areata." },
          { icon: Wind, title: "Allergies & Respiratory", text: "Chronic allergic rhinitis, dust and pollen sensitivity, persistent sinusitis, nasal polyps." },
          { icon: Apple, title: "Digestive & Metabolism", text: "Severe hyperacidity, peptic ulcers, habitual constipation, irritable colon, hepatic sluggishness." },
          { icon: Droplet, title: "Renal & Urinary Care", text: "Non-invasive homeopathic support for recurring renal calculi (kidney stones) and recurrent UTIs." },
        ],
      },
    ],
    photo: monikaImage,
    photoLabel: "Pediatric & Family Specialist",
    facts: [
      ["LICENSURE", "DOH Verified"],
      ["PRACTICE", "15+ Years Experience"],
      ["LANGUAGES", "EN, HI, UR"],
      ["CLINIC LINES", "+971 026310746"],
    ],
    book: "Book with Dr. Monika",
    whatsapp: { label: "WhatsApp +971 50 780 0163", href: "https://wa.me/+971507800163" },
  },
  {
    id: "dr-ashna-muhammad",
    tag: "CLINICAL FACULTY DOSSIER • AYURVEDA & NATURAL THERAPIES",
    name: "Dr. Ashna Muhammad",
    sub: "BAMS, CPC • DOH-Licensed Ayurvedic Practitioner",
    quote: "When diet and natural rhythms are honored, medicine becomes whole; when disease is understood through doshic balance, true vitality awakens.",
    paragraphs: [
      "Dr. Ashna Muhammad is an accomplished Ayurvedic Physician trained in the revered classical traditions of Kerala, India. Holding a Bachelor of Ayurvedic Medicine and Surgery (BAMS) alongside Certified Professional Coder (CPC), she brings rich multi-jurisdictional clinical expertise spanning authentic Indian wellness centers and leading healthcare settings across the UAE.",
      "Her clinical methodology seamlessly integrates traditional Nadi Pariksha (pulse diagnosis) with evidence-backed dietary therapy, herbal bio-compounds, and therapeutic physical purifications tailored precisely to each patient’s metabolic and constitutional type (Prakriti & Vikriti).",
    ],
    sections: [
      {
        cards: [
          { icon: Stethoscope, title: "Nadi & Prakriti Assessment", text: "Precise evaluation of Vata, Pitta, and Kapha bio-energetic imbalances, metabolic digestive fire (Agni), and accumulated cellular toxins (Ama)." },
          { icon: Waves, title: "Classical Panchakarma Protocols", text: "Full supervision of restorative therapies: Abhyanga herbal oil infusions, Shirodhara mental deceleration, Kizhi herbal pouch fomentation, and Kati Basti." },
          { icon: Bone, title: "Spine, Joint & Chronic Pain", text: "Targeted natural protocols for cervical spondylosis, lumbar disc issues, osteoarthritic joint stiffness, and sciatica with therapeutic oils." },
          { icon: Leaf, title: "Personalized Herbal Formularies", text: "Custom botanical decoctions, fermented Arishtams, and Rasayanas sourced strictly from certified organic pharmacopoeial producers." },
        ],
      },
    ],
    languages: ["English", "Malayalam", "Hindi"],
    badge: "DOH Registered Clinical Facility",
    photo: ashnaImage,
    photoLabel: "Classical Ayurveda & Panchakarma",
    facts: [
      ["LICENSURE", "DOH Abu Dhabi"],
      ["CREDENTIAL", "BAMS, CPC"],
      ["LANGUAGES", "EN, ML, HI"],
      ["TRADITION", "Kerala Chikitsa"],
    ],
    book: "Book with Dr. Ashna",
    whatsapp: { label: "Direct WhatsApp Inquiry", href: CLINIC_WHATSAPP },
  },
  {
    id: "dr-obaidullah",
    tag: "CLINICAL FACULTY DOSSIER • HIJAMA",
    name: "Dr. Obaidullah",
    sub: "HIJAMA (CUPPING THERAPY) • 18+ YEARS UAE PRACTICE",
    quote: "Healing is a journey of restoring balance — Hijama and Homeopathy work together to help the body heal itself naturally.",
    quoteBy: "— DR. OBAIDULLAH",
    paragraphs: [
      "Dr. Obaidullah brings 18 years of dedicated practice in the UAE as both a Hijama Cupping Therapy specialist and a Homeopathic Medicine Practitioner. Having treated millions of cases, his expertise spans a wide spectrum of physical and mental health conditions. Dr. Obaidullah’s approach integrates the ancient art of Hijama with constitutional Homeopathy to deliver targeted, natural, and lasting relief for chronic conditions.",
    ],
    sections: [
      {
        cards: [
          { icon: Activity, title: "Pain & Musculoskeletal Care", text: "Targeted relief for chronic joint inflammation, lumbar/cervical disc discomfort, and migraines." },
          { icon: Brain, title: "Metabolic & Stress Relief", text: "Restorative therapeutic protocols for mental fatigue, sleep disorders, and digestive health." },
          { icon: Flower2, title: "Constitutional Homeopathy", text: "Individualized classical remedies addressing chronic systemic imbalances at the root level." },
          { icon: CircleDot, title: "Clinical Hijama Therapy", text: "Advanced sterile cupping protocols for deep myofascial release, systemic circulation, and detoxification." },
        ],
      },
    ],
    languages: ["English", "Arabic", "Urdu"],
    badge: "DOH Licensed Outpatient Care",
    photo: obaidullahImage,
    photoLabel: "Hijama Specialist",
    facts: [
      ["RATING", "★ 5.0 Rated"],
      ["THERAPIES", "Hijama"],
      ["EXPERIENCE", "18+ Years in UAE"],
      ["LICENSURE", "DOH Abu Dhabi"],
    ],
    book: "Book with Dr. Obaidullah",
    whatsapp: { label: "Direct WhatsApp Inquiry", href: CLINIC_WHATSAPP },
  },
];

function DoctorsView({ doctors: DOCTORS }) {
  const reduce = useReducedMotion();

  const fade = (delay = 0, x = 0, y = 28) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, x, y },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: "easeOut" },
  });

  return (
    <main className="mihmc-dr">
      {/* ================= HERO ================= */}
      <section className="mihmc-dr-hero">
        <div className="mihmc-dr-hero-inner">
          <motion.span className="mihmc-dr-pill" {...fade(0, 0, 14)}>
            <i aria-hidden="true" /> <T k="doctors.doctors-page.doh-licensed-integrative-p-3375" d={"DOH-LICENSED INTEGRATIVE PRACTITIONERS • ABU DHABI"} /></motion.span>

          <motion.h1 {...fade(0.1)}>
            <T k="doctors.doctors-page.distinguished-holistic-phy-bd16" d={"Distinguished Holistic Physicians & Clinical Specialists"} /></motion.h1>

          <motion.p className="mihmc-dr-lead" {...fade(0.2)}>
            <T k="doctors.doctors-page.meet-our-dedicated-multidi-f17e" d={"Meet our dedicated multidisciplinary faculty uniting classical Homeopathic medicine, authentic Kerala Ayurveda, and therapeutic Cupping (Hijama) for personalized root-cause healing in Khalifa street, Abu Dhabi."} /></motion.p>

          <motion.ul className="mihmc-dr-stats" {...fade(0.3, 0, 34)}>
            {STATS.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span><Icon size={14} /></span>
                <div>
                  <strong><TX s="doctors.stats" d={title} /></strong>
                  <em><TX s="doctors.stats" d={text} /></em>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ================= DOCTORS ================= */}
      {DOCTORS.map((d, index) => {
        const reversed = index % 2 === 1;
        return (
          <section
            key={d.id}
            id={d.id}
            className={`mihmc-dr-row ${reversed ? "reversed" : ""}`}
          >
            <div className="mihmc-dr-row-grid">
              {/* Profile card */}
              <motion.aside
                className="mihmc-dr-profile"
                {...fade(0.05, reversed ? 40 : -40, 0)}
              >
                <div className="mihmc-dr-photo">
                  <img src={d.photo} alt={`${d.name}, ${d.photoLabel}`} loading="lazy" />
                  <span className="mihmc-dr-photo-label">{d.photoLabel}</span>
                </div>

                <dl className="mihmc-dr-facts">
                  {d.facts.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>

                <a href="/contact" className="mihmc-dr-btn dark">
                  <CalendarDays size={12} /> {d.book}
                </a>
                <a
                  href={d.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mihmc-dr-btn soft"
                >
                  <MessageCircle size={12} /> {d.whatsapp.label}
                </a>
              </motion.aside>

              {/* Dossier */}
              <motion.div
                className="mihmc-dr-dossier"
                {...fade(0.15, reversed ? -40 : 40, 0)}
              >
                <span className="mihmc-dr-tag">{d.tag}</span>
                <h2>{d.name}</h2>
                <p className="mihmc-dr-sub">{d.sub}</p>

                <blockquote className="mihmc-dr-quote">
                  <p>“{d.quote}”</p>
                  {d.quoteBy && <cite>{d.quoteBy}</cite>}
                </blockquote>

                <div className="mihmc-dr-bio">
                  {d.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>

                {d.highlight && (
                  <div className="mihmc-dr-highlight">
                    <h4>
                      <d.highlight.icon size={13} /> {d.highlight.title}
                    </h4>
                    <p>{d.highlight.text}</p>
                  </div>
                )}

                {d.stages && (
                  <>
                    <h3 className="mihmc-dr-heading">{d.stages.heading}</h3>
                    <div className="mihmc-dr-stages">
                      {d.stages.items.map((s) => (
                        <div key={s.no} className="mihmc-dr-stage">
                          <span>{s.no}</span>
                          <h4>{s.title}</h4>
                          <p>{s.text}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {d.sections.map((sec, si) => (
                  <React.Fragment key={si}>
                    {sec.heading && <h3 className="mihmc-dr-heading">{sec.heading}</h3>}
                    <div className="mihmc-dr-cards">
                      {sec.cards.map(({ icon: Icon, title, text }, ci) => (
                        <motion.div
                          key={title}
                          className="mihmc-dr-card"
                          {...fade(ci * 0.07, 0, 20)}
                          whileHover={reduce ? undefined : { y: -4 }}
                        >
                          <h4>
                            <Icon size={13} /> {title}
                          </h4>
                          <p>{text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}

                {d.note && (
                  <p className="mihmc-dr-note">
                    <d.note.icon size={12} /> {d.note.text}
                  </p>
                )}

                {d.languages && (
                  <div className="mihmc-dr-langbar">
                    <div>
                      <span><T k="doctors.doctors-page.language-fluency-4ee2" d={"LANGUAGE FLUENCY"} /></span>
                      <strong>{d.languages.join(" • ")}</strong>
                    </div>
                    <em>
                      <BadgeCheck size={11} /> {d.badge}
                    </em>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        );
      })}
    </main>
  );
}

export default function Doctors() {
  // Published doctor profiles from the CMS; the original profiles are the offline default.
  const rows = useCmsList("doctors", undefined);
  const doctors = rows === null ? [] : rows === undefined ? DEFAULT_DOCTORS : rows.map(mapDoctorProfile);
  return <DoctorsView doctors={doctors} />;
}
