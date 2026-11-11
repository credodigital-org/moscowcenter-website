import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import "./Hero.css";
import { useHomeSlots } from "../../lib/cms";

import ayurvedaImage from "../../assets/images/ayurveda.png";
import hijamaImage from "../../assets/images/hijama.png";
import homeopathyImage from "../../assets/images/homeopathy.png";

import T from "../../components/T";
const EASE = [0.22, 1, 0.36, 1];

const DEFAULT_PANELS = [
  { title: "AYURVEDA", image: ayurvedaImage, className: "ayurveda-panel" },
  { title: "HIJAMA", image: hijamaImage, className: "hijama-panel" },
  { title: "HOMEOPATHY", image: homeopathyImage, className: "homeopathy-panel" },
];

/* Floating golden dust for the desktop "live footage" feel.
   Values are computed (not random) so server and client match. */
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  size: 3 + ((i * 5) % 5),
  dur: 9 + ((i * 7) % 9),
  delay: -((i * 3) % 10),
  drift: ((i * 13) % 50) - 25,
}));

/* ---------- Mobile breakpoint hook ---------- */
function useIsMobile(query = "(max-width: 600px)") {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}

/* ---------- Heading lines that slide up out of a mask ---------- */
function RevealLines({ lines, delay = 0, reduce }) {
  return lines.map((line, i) => (
    <span className="reveal-line" key={line}>
      <motion.span
        className="reveal-line-inner"
        initial={reduce ? false : { y: "115%", rotate: 3 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.12 }}
      >
        {line}
      </motion.span>
    </span>
  ));
}

/* ---------- Magnetic button with shine ---------- */
function MagneticButton({ href, children, delay, reduce }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  const onMove = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="moscow-hero-button-wrap"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      <motion.a
        ref={ref}
        href={href}
        className="moscow-hero-button"
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.96 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span className="btn-shine" />
        <span className="btn-label">{children}</span>
      </motion.a>
    </motion.div>
  );
}

/* ---------- One image panel (desktop / tablet) ---------- */
function TreatmentPanel({
  treatment,
  index,
  sx,
  sy,
  scrollShift,
  hovered,
  setHovered,
  reduce,
}) {
  const depth = 24 + index * 8;

  const x = useTransform(sx, (v) => v * -depth);
  const y = useTransform(
    [sy, scrollShift],
    ([m, s]) => m * -depth + s * (0.3 + index * 0.1)
  );

  const isHovered = hovered === index;
  const isDimmed = hovered !== null && !isHovered;

  const panelDelay = 0.15 * index;
  const letters = treatment.title.split("");

  return (
    <div
      className={`treatment-panel ${treatment.className}`}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Image layer: zoom-out intro, parallax, hover focus.
          The slow "live footage" drift is a CSS animation on this layer. */}
      <motion.div
        className="treatment-bg"
        style={{
          backgroundImage: `url("${treatment.image}")`,
          x: reduce ? 0 : x,
          y: reduce ? 0 : y,
        }}
        initial={reduce ? false : { scale: 1.5 }}
        animate={{
          scale: isHovered ? 1.32 : 1.25,
          filter: isDimmed
            ? "brightness(0.78) saturate(0.75)"
            : "brightness(1) saturate(1)",
        }}
        transition={{
          scale: {
            duration: isHovered || hovered !== null ? 0.9 : 1.8,
            ease: EASE,
            delay: hovered === null ? panelDelay : 0,
          },
          filter: { duration: 0.6, ease: "easeOut" },
        }}
      />

      <div className="treatment-image-shade" />

      {/* Title: letters rise, then gold line draws */}
      <div className="treatment-title-wrap">
        <h2>
          <span className="title-letters" aria-label={treatment.title}>
            {letters.map((ch, i) => (
              <span className="title-mask" key={i} aria-hidden="true">
                <motion.span
                  className="title-char"
                  initial={reduce ? false : { y: "120%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    delay: 0.9 + panelDelay + i * 0.04,
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </span>
          <motion.span
            className="title-line"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1.12 : 1 }}
            transition={{
              duration: 0.8,
              ease: EASE,
              delay: isHovered || hovered !== null ? 0 : 1.4 + panelDelay,
            }}
          />
        </h2>
      </div>

      {/* Curtain wipe: slides away to reveal the panel */}
      {!reduce && (
        <motion.div
          className="treatment-curtain"
          initial={{ y: "0%" }}
          animate={{ y: "-101%" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 + panelDelay }}
        />
      )}
    </div>
  );
}

/* ---------- Mobile: swipeable, auto-playing carousel ----------
   One treatment is shown at a time. It cross-fades with a slow zoom,
   auto-advances, pauses while the finger is down, and can be swiped
   or tapped through the tabs. The progress line inside the active tab
   drives the timing: when it finishes, the next slide opens. */
function MobileSlider({ reduce, treatments }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = treatments.length;

  const go = (next) => setActive((next + count) % count);

  const onDragEnd = (_, info) => {
    setPaused(false);
    if (info.offset.x < -45 || info.velocity.x < -400) go(active + 1);
    else if (info.offset.x > 45 || info.velocity.x > 400) go(active - 1);
  };

  return (
    <div
      className="m-slider"
      role="group"
      aria-roledescription="carousel"
      aria-label="Our treatments"
    >
      <motion.div
        className="m-stage"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragSnapToOrigin
        onDragStart={() => setPaused(true)}
        onDragEnd={onDragEnd}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
      >
        {treatments.map((t, i) => (
          <div
            key={t.title}
            className={`m-slide ${i === active ? "is-active" : ""}`}
            aria-hidden={i !== active}
          >
            <div
              className="m-slide-img"
              style={{ backgroundImage: `url("${t.image}")` }}
            />
            <div className="m-slide-shade" />

            <h2 className="m-slide-title" aria-label={t.title}>
              {t.title.split("").map((ch, n) => (
                <span
                  className="m-letter"
                  key={n}
                  aria-hidden="true"
                  style={{ "--n": n }}
                >
                  {ch}
                </span>
              ))}
            </h2>
          </div>
        ))}
      </motion.div>

      <div className="m-tabs" role="tablist" aria-label="Choose a treatment">
        {treatments.map((t, i) => (
          <button
            key={t.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`m-tab ${i === active ? "is-active" : ""}`}
            onClick={() => go(i)}
          >
            <span className="m-tab-label">
              {t.title.charAt(0) + t.title.slice(1).toLowerCase()}
            </span>

            {i === active && (
              <span className="m-tab-track" aria-hidden="true">
                <span
                  key={active}
                  className="m-tab-progress"
                  style={{
                    animationPlayState: paused ? "paused" : "running",
                    animationName: reduce ? "none" : undefined,
                  }}
                  onAnimationEnd={() => go(active + 1)}
                />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function HeroView({ slots }) {
  // Panel photos come from the CMS (Home Page → Hero panels); the original design photos are the default.
  const treatments = DEFAULT_PANELS.map((p) => ({
    ...p,
    image: slots.image(`hero-${p.title.toLowerCase()}`, p.image),
  }));
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(null);

  // Mouse parallax (smoothed)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const scrollShift = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const handleMouseMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      className="moscow-hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {isMobile ? (
        <MobileSlider reduce={reduce} treatments={treatments} />
      ) : (
        <>
          <div className="treatment-panels">
            {treatments.map((t, i) => (
              <TreatmentPanel
                key={t.title}
                treatment={t}
                index={i}
                sx={sx}
                sy={sy}
                scrollShift={scrollShift}
                hovered={hovered}
                setHovered={setHovered}
                reduce={reduce}
              />
            ))}
          </div>

          {/* Live-footage layers: drifting golden dust + slow light sweep */}
          <div className="hero-live" aria-hidden="true">
            <div className="hero-lightsweep" />
            {MOTES.map((m, i) => (
              <span
                className="hero-mote"
                key={i}
                style={{
                  "--x": `${m.x}%`,
                  "--s": `${m.size}px`,
                  "--dur": `${m.dur}s`,
                  "--delay": `${m.delay}s`,
                  "--drift": `${m.drift}px`,
                }}
              />
            ))}
          </div>
        </>
      )}

      <motion.div
        className="moscow-hero-content"
        style={{ y: reduce || isMobile ? 0 : cardY }}
        initial={reduce ? false : { opacity: 0, x: -50, filter: "blur(14px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.6 }}
      >
        <h1>
          <RevealLines
            reduce={reduce}
            delay={0.9}
            lines={["Holistic Care,", "Personalised for", "You."]}
          />
        </h1>

        <p className="moscow-hero-subtitle">
          <RevealLines
            reduce={reduce}
            delay={1.25}
            lines={["Homeopathy,", "Ayurveda & Cupping", "Therapy."]}
          />
        </p>

        <motion.p
          className="moscow-hero-description"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.65 }}
        >
          <T k="home.top-banner.experience-doctor-guided-h-aae3" d={"Experience doctor-guided holistic care through Homeopathy, Ayurveda and Cupping Therapy, designed around your individual health needs."} /></motion.p>

        <MagneticButton href="#appointment" delay={1.85} reduce={reduce}>
          <T k="home.top-banner.book-a-consultation-685a" d={"Book a Consultation"} /></MagneticButton>
      </motion.div>

      <div className="moscow-hero-bottom-fade" />
    </section>
  );
}

export default function Hero() {
  const slots = useHomeSlots();
  if (!slots) return null;
  return <HeroView slots={slots} />;
}
