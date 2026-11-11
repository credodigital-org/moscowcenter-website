import React, { useEffect, useRef, useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, animate } from "motion/react";
import "./AnimatedRoutes.css";

/*
  1. First visit: loading screen (drawing lotus + 0-100% counter), then it slides away.
  2. Every page change: green curtain wipe (old page out, page swap, new page in).

  Use it instead of <Routes>. Navbar and Footer stay outside it.
*/

const EASE = [0.76, 0, 0.24, 1];
const MIN_LOAD_SECONDS = 2;

/* ---------------- LOADING SCREEN ---------------- */

function Preloader({ onDone, reduce }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let finished = false;
    let removeListener = () => {};

    const finish = () => {
      if (finished) return;
      finished = true;
      animate(percent, 100, {
        duration: 0.3,
        onUpdate: (v) => setPercent(Math.round(v)),
        onComplete: () => setTimeout(onDone, 250),
      });
    };

    // count to 95% over the minimum time, then wait for the page to be fully loaded
    const controls = animate(0, 95, {
      duration: reduce ? 0.4 : MIN_LOAD_SECONDS,
      ease: "easeOut",
      onUpdate: (v) => setPercent(Math.round(v)),
      onComplete: () => {
        if (document.readyState === "complete") {
          finish();
        } else {
          window.addEventListener("load", finish, { once: true });
          removeListener = () => window.removeEventListener("load", finish);
        }
      },
    });

    return () => {
      controls.stop();
      removeListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="mihmc-preloader"
      role="status"
      aria-label="Loading"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.9, ease: EASE } }}
    >
      <svg className="mihmc-preloader-logo" viewBox="0 0 100 80" fill="none">
        {[
          "M50 12 C62 30 62 52 50 70 C38 52 38 30 50 12 Z",
          "M50 70 C30 66 16 50 14 32 C32 34 46 48 50 70 Z",
          "M50 70 C70 66 84 50 86 32 C68 34 54 48 50 70 Z",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#f2c77e"
            strokeWidth="1.6"
            strokeLinejoin="round"
            initial={{ pathLength: 0, fill: "rgba(242,199,126,0)" }}
            animate={{ pathLength: 1, fill: "rgba(242,199,126,0.18)" }}
            transition={{
              pathLength: { duration: 1.2, delay: 0.2 + i * 0.25, ease: "easeInOut" },
              fill: { duration: 0.6, delay: 1.2 + i * 0.25 },
            }}
          />
        ))}
      </svg>

      <motion.h2
        className="mihmc-preloader-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        MOSCOW INTERNATIONAL
        <span>HOLISTIC MEDICAL CENTER</span>
      </motion.h2>

      <div className="mihmc-preloader-bar">
        <motion.span
          style={{ width: `${percent}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
      <p className="mihmc-preloader-percent">{percent}%</p>
    </motion.div>
  );
}

/* ---------------- ROUTES + PAGE CHANGE ---------------- */

export default function AnimatedRoutes({ children }) {
  const location = useLocation();
  const reduce = useReducedMotion();

  const [loading, setLoading] = useState(true);

  // lock page scroll while the loading screen is showing
  useEffect(() => {
    if (!loading) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loading]);

  // play the curtain only when the path actually changes (never on first load)
  const prevPath = useRef(location.pathname);
  const [curtainKey, setCurtainKey] = useState(null);
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      setCurtainKey(`${location.pathname}-${Date.now()}`);
    }
  }, [location.pathname]);

  return (
    <>
      {/* ---------- loading screen (first visit) ---------- */}
      <AnimatePresence>
        {loading && <Preloader reduce={reduce} onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {/* ---------- curtain (page changes) ---------- */}
      {!reduce && curtainKey && (
        <motion.div
          key={curtainKey}
          aria-hidden="true"
          className="mihmc-curtain"
          initial={{ y: "100%" }}
          animate={{ y: ["100%", "0%", "0%", "-100%"] }}
          transition={{ duration: 1.1, times: [0, 0.4, 0.52, 1], ease: EASE }}
        >
          <motion.span
            className="mihmc-curtain-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
            transition={{ duration: 1.1, times: [0.25, 0.42, 0.5, 0.65] }}
          >
            MIHMC
          </motion.span>
          <motion.span
            className="mihmc-curtain-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 1, 0] }}
            transition={{ duration: 1.1, times: [0.3, 0.46, 0.52, 0.66] }}
          />
        </motion.div>
      )}

      {/* ---------- page ---------- */}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo({ top: 0, left: 0 })}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: reduce ? 0 : 0.2, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: reduce ? 0.1 : 0.4, ease: "easeIn" },
          }}
          style={{ minHeight: "60vh" }}
        >
          <Routes location={location}>{children}</Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
