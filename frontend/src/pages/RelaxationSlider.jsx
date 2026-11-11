import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import "./RelaxationSlider.css";
import { mapTreatmentCard, useCmsList } from "../lib/cms";

/* ---------- IMAGES (put them in src/assets/images/treatments/) ---------- */
import steamImg from "../assets/images/treatments/abhyangam-steam.png";
import shirodharaImg from "../assets/images/treatments/shirodhara.png";
import kizhiImg from "../assets/images/treatments/abhyangam-kizhi.png";
import reflexImg from "../assets/images/treatments/foot-reflexology.png";

import nethraImg from "../assets/images/treatments/nethra-dhara.png";
import shiroVastiImg from "../assets/images/treatments/shiro-vasti.png";
import akshiImg from "../assets/images/treatments/akshi-tharpanam.png";
import kashayaImg from "../assets/images/treatments/kashaya-dhara.png";

import takraImg from "../assets/images/treatments/takra-dhara.png";
import januImg from "../assets/images/treatments/janu-vasti.png";
import udwarthanamImg from "../assets/images/treatments/udwarthanam.png";
import glowImg from "../assets/images/treatments/glow-therapy.png";

import T from "../components/T";
/* ---------- DATA (12 therapies = 3 pages x 4 cards) ---------- */
const DEFAULT_THERAPIES = [
  // ---- Page 1 ----
  {
    img: steamImg,
    title: "Abhyangam + Steam",
    text: "Traditional full-body oil massage.",
    detail:
      "Full-body rhythmic warm medicated oil massage followed by herbalsteam infusion in a traditional wooden chamber to dilate channels and eliminate systemic metabolic toxins.",
    points: [
      "Relieves chronic muscular stiffness & soreness",
      "Deep systemic detoxification & lymphatic drainage",
      "Promotes healthy cutaneous blood circulation",
      "Calms nervous agitation & relieves fatigue",
      "Pacifies aggravated Vata dosha",
    ],
  },
  {
    img: shirodharaImg,
    title: "Shirodhara",
    text: "Traditional relaxation therapy.",
    detail:
      "Gentle, continuous pouring of warm medicated herbal oil onto the forehead — over the Ajna Marma (third eye chakra) — for deep neurological calm and systemic rejuvenation.",
    points: [
      "Deep relaxation & stress relief",
      "Improved sleep & insomnia treatment",
      "Reduced anxiety, depression & tension headaches",
      "Enhanced focus, mental clarity & memory",
      "Balancing of Vata and Pitta doshas",
    ],
  },
  {
    img: kizhiImg,
    title: "Abhyangam + Potli Kizhi",
    text: "Oil massage with herbal poultice therapy.",
    detail:
      "Synchronized warm herbal oil therapy combined with heated medicinal herbal poultices (potli) applied with rhythmic tapping to soothe inflamed muscles, relieve spinal tension, and restore joint mobility.",
    points: [
      "Indicated, deep lasting relief for osteoarthritis, backache & sciatica",
      "Reduces localized joint inflammation & swelling",
      "Relieves chronic cervical and lumbar muscle spasms",
      "Increases spinal flexibility & muscular vitality",
      "Improves mobility and eases connective tissue rigidity",
    ],
  },
  {
    img: reflexImg,
    title: "Foot Reflexology",
    text: "A foot-focused relaxation treatment.",
    detail:
      "Targeted therapeutic acupressure and Marma point stimulation across plantar reflex zones with medicated botanical oils to restore constitutional balance, alleviate fatigue, and induce deep systemic tranquility.",
    points: [
      "Stimulates organ reflex pathways & nerve endings",
      "Alleviates foot fatigue, plantar tension & heaviness",
      "Reduces psychological stress & supports restorative sleep",
      "Improves lower-extremity arterial & venous circulation",
      "Harmonizes whole-body energy flow & vital Marma centers",
    ],
  },
  // ---- Page 2 ----
  {
    img: nethraImg,
    title: "Nethra Dhara",
    text: "Traditional Ayurvedic external eye therapy.",
    detail:
      "Gentle washing and streaming of medicinal herbal decoctions over the eyes to relieve strain, chronic ocular dryness, and pacify localized Pitta heat.",
    points: [
      "Relieves digital eye strain & ocular fatigue",
      "Soothes burning sensation & chronic dryness",
      "Enhances visual clarity & ocular micro-circulation",
      "Calms Pitta dosha aggravation in sensory organs",
      "Reduces tension around temples and eye orbits",
    ],
  },
  {
    img: shiroVastiImg,
    title: "Shiro Vasti",
    text: "Traditional Ayurvedic external oil therapy.",
    detail:
      "Intensive cranial oil retention therapy where warm medicated herbal oil is held over the scalp using a specialized leather cap for deep nervous rejuvenation.",
    points: [
      "Powerful relief for chronic migraines & tension headaches",
      "Addresses facial paralysis, neuralgia & cervical spondylosis",
      "Strengthens central nervous system & cognitive function",
      "Rejuvenates hair follicles & soothes scalp disorders",
      "Profound alleviation of aggravated Vata in head region",
    ],
  },
  {
    img: akshiImg,
    title: "Akshi Tharpanam",
    text: "Ayurvedic rejuvenating oil nourishment therapy.",
    detail:
      "Therapeutic ocular rejuvenation where pure medicated ghee is retained over the eyes within circular gram flour dams to nourish optic nerves and tissues.",
    points: [
      "Nourishes optic nerves & strengthens ocular muscles",
      "Deep relief for computer vision syndrome & dry eye syndrome",
      "Prevents degenerative ophthalmic conditions",
      "Cools burning sensation and ocular inflammation",
      "Restores natural ocular lubrication and vision clarity",
    ],
  },
  {
    img: kashayaImg,
    title: "Kashaya Dhara",
    text: "A full-body medicated decoction therapy.",
    detail:
      "Continuous, rhythmic pouring of customized warm herbal medicinal decoction over the entire body or forehead to eliminate toxins and ease inflammation.",
    points: [
      "Relieves chronic skin conditions, eczema & psoriasis",
      "Deep anti-inflammatory action for joint pain & arthritis",
      "Clears subcutaneous metabolic toxins (Ama)",
      "Alleviates burning sensation & body heat exhaustion",
      "Promotes cellular regeneration and metabolic balance",
    ],
  },
  // ---- Page 3 ----
  {
    img: takraImg,
    title: "Takra Dhara",
    text: "Traditional Ayurvedic Panchakarma therapy.",
    detail:
      "Medicated buttermilk poured in a continuous rhythmic stream over the forehead — a cooling, clarifying variant of Shirodhara to calm mind, sensory channels, and Pitta heat.",
    points: [
      "Calms mental exhaustion, severe stress & chronic anxiety",
      "Powerful natural relief for insomnia & restless mind",
      "Alleviates psoriasis, scalp dryness & dandruff",
      "Cools excess internal Pitta heat & regulates body temperature",
      "Relieves chronic tension headaches & migraines",
    ],
  },
  {
    img: januImg,
    title: "Janu Vasti",
    text: "Ayurvedic external oil retention therapy.",
    detail:
      "Intensive localized oil retention therapy where warm medicated herbal oil is held over the knee joint within a specialized herbal dough ring to lubricate joints and soothe chronic knee discomfort.",
    points: [
      "Targeted and Tailored relief from osteoarthritis and degenerative knee pain ",
      "Lubricates synovial membranes & eases joint crepitus",
      "Strengthens knee joint ligaments and surrounding musculature",
      "Reduces localized stiffness, swelling and inflammation",
      "Restores pain-free knee flexion, mobility and walking comfort",
    ],
  },
  {
    img: udwarthanamImg,
    title: "Udwarthanam",
    text: "Traditional Ayurvedic dry-powder massage therapy.",
    detail:
      "Invigorating therapeutic deep dry-powder massage performed with prescribed herbal blends in upward strokes to stimulate lymphatic drainage, burn subcutaneous fat, and improve metabolic tone.",
    points: [
      "Breaks down subcutaneous adipose tissue & supports weight balance",
      "Stimulates lymphatic drainage and flushes metabolic toxins (Ama)",
      "Improves skin tone, firms tissues and reduces cellulite",
      "Exfoliates dead skin cells, restoring skin radiance",
      "Enhances systemic blood circulation & metabolic vitality",
    ],
  },
  {
    img: glowImg,
    title: "Glow Therapy + Polishing",
    text: "A natural herbal glow treatment.",
    detail:
      "Luxurious natural Ayurvedic body exfoliation and nourishment treatment utilizing organic ubtans, botanical extracts, and nourishing herbal oils to reveal soft, luminous, and rejuvenated skin.",
    points: [
      "Gently polishes away dull epidermal cells and environmental impurities",
      "Deeply hydrates and enriches dermal tissue with natural botanicals",
      "Restores natural golden skin luster and smooth velvety texture",
      "Removes sun tan and balances skin pigmentation",
      "Enhances whole-body microcirculation and relaxation",
    ],
  },
];

const PER_PAGE = 4;
const INTERVAL = 5000; // 5 seconds

/* ---------- FLIP CARD ---------- */
function FlipCard({ item, flipped, onFlip, onBack, index }) {
  return (
    <motion.article
      className={`mihmc-flip ${flipped ? "is-flipped" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <div className="mihmc-flip-inner">
        {/* FRONT */}
        <div className="mihmc-flip-face front" aria-hidden={flipped}>
          <div className="mihmc-flip-photo">
            <img src={item.img} alt={item.title} loading="lazy" />
          </div>
          <h4>{item.title}</h4>
          <p>{item.text}</p>
          <button
            type="button"
            className="mihmc-flip-link"
            onClick={onFlip}
            tabIndex={flipped ? -1 : 0}
          >
            <T k="treatments.relaxation-therapy-cards.view-more-6319" d={"View More"} /></button>
        </div>

        {/* BACK */}
        <div className="mihmc-flip-face back" aria-hidden={!flipped}>
          <span className="mihmc-flip-tag"><T k="treatments.relaxation-therapy-cards.ayurveda-1f34" d={"AYURVEDA"} /></span>
          <h4>{item.title}</h4>
          <p className="detail">{item.detail}</p>
          <ul>
            {item.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <button
            type="button"
            className="mihmc-flip-link"
            onClick={onBack}
            tabIndex={flipped ? 0 : -1}
          >
            <T k="treatments.relaxation-therapy-cards.back-c32a" d={"← Back"} /></button>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- SLIDER ---------- */
function RelaxationSliderView({ therapies: THERAPIES }) {
  const PAGES = Math.ceil(THERAPIES.length / PER_PAGE);
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const [flippedId, setFlippedId] = useState(null);
  const [hovered, setHovered] = useState(false);

  // Auto-rotate every 5s. Pauses on hover, while a card is flipped,
  // or if the user prefers reduced motion.
  useEffect(() => {
    if (reduce || hovered || flippedId !== null) return;
    const id = setTimeout(() => {
      setPage((p) => (p + 1) % PAGES);
    }, INTERVAL);
    return () => clearTimeout(id);
  }, [page, hovered, flippedId, reduce]);

  const goTo = (p) => {
    setFlippedId(null);
    setPage(p);
  };

  const visible = THERAPIES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div
      className="mihmc-slider"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          className="mihmc-slider-grid"
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {visible.map((item, i) => (
            <FlipCard
              key={item.title}
              item={item}
              index={i}
              flipped={flippedId === item.title}
              onFlip={() => setFlippedId(item.title)}
              onBack={() => setFlippedId(null)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mihmc-slider-dots" role="tablist" aria-label="Relaxation therapies pages">
        {Array.from({ length: PAGES }).map((_, p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={p === page}
            aria-label={`Show page ${p + 1}`}
            className={p === page ? "active" : ""}
            onClick={() => goTo(p)}
          />
        ))}
      </div>
    </div>
  );
}

export default function RelaxationSlider() {
  // Published "Relaxation therapies" shown on the Treatments page.
  const rows = useCmsList("treatments", undefined);
  if (rows === null) return null;
  const therapies =
    rows === undefined
      ? DEFAULT_THERAPIES
      : rows
          .filter((t) => t.category === "relaxation" && t.show_on_page)
          .map((t) => ({ ...mapTreatmentCard(t), detail: t.detail, points: t.points_list || [] }));
  if (!therapies.length) return null;
  return <RelaxationSliderView therapies={therapies} />;
}
