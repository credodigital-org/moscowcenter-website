import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ShieldCheck,
  Award,
  MapPin,
  ClipboardList,
  Activity,
  BriefcaseMedical,
  MessageCircle,
  Quote,
} from "lucide-react";
import "./About.css";
import { mediaUrl } from "../api";
import { iconFor } from "../lib/icons";
import { useSiteInfo } from "../lib/siteInfo";
import { splitLines, useCmsList, useCms } from "../lib/cms";

/* ------------------------------------------
   ADD YOUR IMAGES HERE
   1. Clinic reception photo (wide) -> hero
   2. Doctor / patient consultation photo -> story section
------------------------------------------- */
import aboutHeroImage from "../assets/images/about-clinic2.jpg";
import aboutStoryImage from "../assets/images/about-consultation.jpeg";

import T from "../components/T";
const CHIP_ICONS = [ShieldCheck, Award, MapPin];

/* Original design content — used only if the CMS API cannot be reached. */
const DEFAULT_ABOUT = {
  hero_pill: "ABOUT US",
  hero_heading: "A Holistic Approach to Better Health",
  hero_text:
    "Discover personalised holistic care through Homeopathy, Ayurveda, and\nCupping Therapy. Licensed by the Ministry of Health, uniting ancient wisdom\nand modern clinical precision.",
  hero_image: aboutHeroImage,
  chips_list: ["Ministry of Health Licensed", "15+ Years Clinical Care", "Abu Dhabi, UAE"],
  story_kicker: "OUR STORY",
  story_heading: "Blending Timeless Wisdom with\nModern Science",
  story_paragraphs: [
    "At Moscow International Holistic Medical Center (MIHMC), we believe that true healthcare goes beyond temporary symptom suppression. By studying the body’s natural metabolic balance, we construct treatment plans that stimulate authentic structural recovery.",
    "Over the past 15 years, our clinic has grown into a world-class destination for patients seeking natural solutions for chronic joint pain, metabolic conditions, hair fall, hormonal imbalances, and detox. Our clinic is licensed by the Ministry of Health, ensuring every practitioner, herb, and procedure meets strict medical guidelines.",
  ],
  quote:
    "Our mission is to empower individuals to live healthier, balanced, and vibrant lives by restoring their body’s innate self-healing capabilities.",
  quote_cite: "MIHMC CLINICAL LEADERSHIP COUNCIL",
  story_image: aboutStoryImage,
  badge_title: "15+ Years",
  badge_text: "Of Healing Excellence in Abu Dhabi",
  approach_kicker: "OUR APPROACH TO HOLISTIC CARE",
  approach_heading: "Care That Considers the Whole You",
  approach_text:
    "A patient-centred methodology viewing vitality as a harmony between physical health, mental\ncalm, and biological rhythm.",
  cta_pill: "CONSULTATIONS",
  cta_heading: "Begin Your Journey to\nRestorative Health",
  cta_text:
    "Speak with our clinical team or schedule your one-on-one consultation today in\nAbu Dhabi. Experience authentic healing supervised by licensed physicians.",
};

/* Text with deliberate line breaks (\n) keeps the original wrapping. */
function Lines({ text }) {
  return splitLines(text).map((line, i, all) => (
    <React.Fragment key={i}>
      {line}
      {i < all.length - 1 && <br className="mihmc-br" />}
    </React.Fragment>
  ));
}

const DEFAULT_PROTOCOLS = [
  {
    icon: ClipboardList,
    no: "PROTOCOL 01",
    title: "Personalised Consultations",
    text: "Detailed 45–60 minute comprehensive consultations exploring medical history, stress patterns, circadian sleep rhythms, and individual bodily constitution.",
  },
  {
    icon: Activity,
    no: "PROTOCOL 02",
    title: "Understanding Individual Needs",
    text: "Root-cause diagnostic assessment mapping metabolic balance, toxic accumulation (Ama), and constitutional temperament to eradicate deep cellular disharmony.",
  },
  {
    icon: BriefcaseMedical,
    no: "PROTOCOL 03",
    title: "Appropriate Treatment Options",
    text: "Integrative care protocols blending Classical Ayurveda, Clinical Homeopathy, and Medical Cupping (Hijama) strictly aligned with individual therapeutic safety.",
  },
];

function AboutView({ about, PROTOCOLS, blocks }) {
  const site = useSiteInfo();
  const reduce = useReducedMotion();
  const CHIPS = (about.chips_list || []).map((text, i) => ({ icon: CHIP_ICONS[i % CHIP_ICONS.length], text }));

  const fade = (delay = 0, x = 0, y = 28) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, x, y },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: "easeOut" },
  });

  return (
    <main className="mihmc-about">
      {/* ================= HERO ================= */}
      <section className="mihmc-about-hero">
        <div className="mihmc-about-hero-inner">
          <motion.span className="mihmc-about-pill" {...fade(0, 0, 16)}>
            {about.hero_pill}
          </motion.span>

          <motion.h1 {...fade(0.1)}>
            <Lines text={about.hero_heading} />
          </motion.h1>

          <motion.p className="mihmc-about-hero-text" {...fade(0.2)}>
            <Lines text={about.hero_text} />
          </motion.p>

          <motion.div className="mihmc-about-actions" {...fade(0.3)}>
            <a href="/treatments" className="mihmc-about-btn dark">
              <T k="about.about-page.explore-our-treatments-d08e" d={"Explore Our Treatments"} /></a>
            <a href="/contact" className="mihmc-about-btn light">
              <T k="about.about-page.book-consultation-68f2" d={"Book Consultation"} /></a>
          </motion.div>

          <motion.ul className="mihmc-about-chips" {...fade(0.4)}>
            {CHIPS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={11} />
                {text}
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="mihmc-about-hero-image"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: reduce ? 0 : 0.5, ease: "easeOut" }}
          >
            <img
              src={about.hero_image}
              alt="Moscow International Holistic Medical Center reception, Abu Dhabi"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="mihmc-about-story">
        <div className="mihmc-about-story-grid">
          <motion.div className="mihmc-about-story-text" {...fade(0, -45, 0)}>
            <span className="mihmc-about-kicker">{about.story_kicker}</span>

            <h2>
              <Lines text={about.story_heading} />
            </h2>

            {(about.story_paragraphs || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <blockquote className="mihmc-about-quote">
              <Quote size={14} aria-hidden="true" />
              <p>“{about.quote}”</p>
              <cite>{about.quote_cite}</cite>
            </blockquote>
          </motion.div>

          <motion.div className="mihmc-about-story-media" {...fade(0.15, 45, 0)}>
            <div className="mihmc-about-story-photo">
              <img
                src={about.story_image}
                alt="Doctor consulting with a patient at MIHMC"
                loading="lazy"
              />
            </div>

            <motion.div
              className="mihmc-about-badge"
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="mihmc-about-badge-icon">
                <Award size={16} />
              </span>
              <div>
                <strong>{about.badge_title}</strong>
                <span>{about.badge_text}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= EXTRA SECTIONS (added in the CMS) ================= */}
      {blocks.map((block, i) => (
        <section className="mihmc-about-story" key={block.id}>
          <div className={`mihmc-about-story-grid${block.image && i % 2 === 0 ? " mihmc-about-flip" : ""}`}>
            <motion.div className="mihmc-about-story-text" {...fade(0, -45, 0)}>
              {block.kicker && <span className="mihmc-about-kicker">{block.kicker}</span>}
              <h2>{block.heading}</h2>
              {(block.body_paragraphs || []).map((para, k) => (
                <p key={k}>{para}</p>
              ))}
            </motion.div>
            {block.image && (
              <motion.div className="mihmc-about-story-media" {...fade(0.15, 45, 0)}>
                <div className="mihmc-about-story-photo">
                  <img src={mediaUrl(block.image)} alt={block.heading} loading="lazy" />
                </div>
              </motion.div>
            )}
          </div>
        </section>
      ))}

      {/* ================= APPROACH ================= */}
      <section className="mihmc-about-approach">
        <div className="mihmc-about-approach-inner">
          <motion.header className="mihmc-about-approach-head" {...fade()}>
            <span className="mihmc-about-kicker">{about.approach_kicker}</span>
            <h2>{about.approach_heading}</h2>
            <p>
              <Lines text={about.approach_text} />
            </p>
          </motion.header>

          <div className="mihmc-about-protocols">
            {PROTOCOLS.map(({ icon: Icon, no, title, text }, i) => (
              <motion.article
                key={no}
                className="mihmc-about-protocol"
                {...fade(i * 0.15, 0, 36)}
                whileHover={reduce ? undefined : { y: -6 }}
              >
                <span className="mihmc-about-protocol-icon">
                  <Icon size={16} />
                </span>
                <span className="mihmc-about-protocol-no">{no}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mihmc-about-cta-wrap">
        <motion.div className="mihmc-about-cta" {...fade(0, 0, 36)}>
          <span className="mihmc-about-cta-pill">{about.cta_pill}</span>

          <h2>
            <Lines text={about.cta_heading} />
          </h2>

          <p>
            <Lines text={about.cta_text} />
          </p>

          <div className="mihmc-about-cta-actions">
            <a href="/contact" className="mihmc-about-btn white">
              <T k="about.about-page.book-a-consultation-685a" d={"Book a Consultation"} /></a>
            <a
              href={site.waLink ?? "https://wa.me/971507800163"}
              target="_blank"
              rel="noopener noreferrer"
              className="mihmc-about-btn ghost"
            >
              <MessageCircle size={13} />
              Chat via WhatsApp ({site.phone ?? "+971 50 780 0163"})
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default function About() {
  const content = useCms("about-content");
  const protocolRows = useCmsList("about-protocols", undefined);
  const blockRows = useCmsList("about-blocks", undefined);

  // Original design content shows immediately; live CMS content replaces it on arrival.
  const hasContent = content.data && content.data.id;
  const about = hasContent
    ? {
        ...content.data,
        hero_image: mediaUrl(content.data.hero_image) || aboutHeroImage,
        story_image: mediaUrl(content.data.story_image) || aboutStoryImage,
        story_paragraphs: content.data.story_paragraphs,
      }
    : DEFAULT_ABOUT;

  const protocols =
    protocolRows === undefined
      ? DEFAULT_PROTOCOLS
      : protocolRows.map((p) => ({ icon: iconFor(p.icon_key, "sparkles"), no: p.label, title: p.title, text: p.text }));

  return (
    <AboutView
      about={about}
      PROTOCOLS={protocols}
      blocks={blockRows === undefined ? [] : blockRows}
    />
  );
}
