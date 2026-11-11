
import React, { useEffect, useRef, useState } from "react";
import "./StatsBanner.css";

import defaultStatsBackground from "../../assets/images/stats-bg.jpeg";
import { useHomeSlots } from "../../lib/cms";

import T, { useNumberText } from "../../components/T";
/* Count numbers when the banner becomes visible */
function CountUp({
  end,
  decimals = 0,
  suffix = "",
  start,
  duration = 1800,
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setValue(end);
      return;
    }

    let raf;
    const t0 = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(end * eased);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [start, end, duration]);

  return (
    <>
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}

function StatsBannerView({ slots }) {
  const yearsCount = useNumberText("stats.years", 5);
  const treatmentsCount = useNumberText("stats.treatments", 25);
  const ratingValue = useNumberText("stats.rating", 5);
  const statsBackground = slots.image("stats-banner", defaultStatsBackground);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  /* Reveal and count up only once */
  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`stats-banner-section ${
        visible ? "is-visible" : ""
      }`}
    >
      {/* Cinematic animated background image */}
      <div
        className="stats-banner-background"
        style={{
          backgroundImage: `url("${statsBackground}")`,
        }}
        aria-hidden="true"
      />

      {/* Background color overlay and moving light */}
      <div
        className="stats-banner-overlay"
        aria-hidden="true"
      />

      {/* Glass statistics card */}
      <div className="stats-banner stats-banner-reveal">
        {/* Statistic 1 */}
        <div
          className="stats-banner-item stats-reveal"
          style={{ "--delay": "0.3s" }}
        >
          <h2>
            <CountUp end={yearsCount} suffix="+" start={visible} />
          </h2>

          <p>
            <T k="home.statistics-banner.years-76a3" d={"Years\nof Care"} br={""} /></p>
        </div>

        <div className="stats-banner-divider" />

        {/* Statistic 2 */}
        <div
          className="stats-banner-item stats-reveal"
          style={{ "--delay": "0.5s" }}
        >
          <h2>
            <CountUp end={treatmentsCount} suffix="+" start={visible} />
          </h2>

          <p><T k="home.statistics-banner.treatments-1091" d={"Treatments"} /></p>
        </div>

        <div className="stats-banner-divider" />

        {/* Statistic 3 */}
        <div
          className="stats-banner-item stats-google-rating stats-reveal"
          style={{ "--delay": "0.7s" }}
        >
          <h2>
            <CountUp
              end={ratingValue}
              decimals={1}
              start={visible}
            />
          </h2>

          <div
            className="stats-stars"
            role="img"
            aria-label="5 out of 5 stars"
          >
            {[0, 1, 2, 3, 4].map((star) => (
              <span
                key={star}
                className="stats-star"
                style={{ "--s": star }}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>

          <p>
            <T k="home.statistics-banner.google-1261" d={"Google\nRating"} br={""} /></p>
        </div>
      </div>
    </section>
  );
}

export default function StatsBanner() {
  const slots = useHomeSlots();
  if (!slots) return null;
  return <StatsBannerView slots={slots} />;
}
