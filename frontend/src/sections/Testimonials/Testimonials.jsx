import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { BadgeCheck, Image as ImageIcon } from "lucide-react";
import "./Testimonials.css";
import { useCmsList } from "../../lib/cms";

import T from "../../components/T";
const DEFAULT_TESTIMONIALS = [
  {
    initials: "AB",
    name: "Abhishek Banerjee",
    review:
      "The Moscow International Holistic Medical Hospital is an incredible place for treatment. I went there for an Ayurvedic treatment and the doctors has been treated me so amazingly. Highly recommend to everyone Well done team Keep it up the fabulous job.",
  },
  {
    initials: "AA",
    name: "Ahmed Al Suwaidi",
    review:
      "One of the most impeccably clean and organised Holistic medical centres in Abu Dhabi. The calm, peaceful atmosphere instantly relaxes you the moment you step through the doors.",
  },
  {
    initials: "PN",
    name: "Priya Nambiar",
    review:
      "Excellent service from start to finish. The therapeutic treatments were deeply caring and relaxing, and the entire staff was exceptionally friendly, respectful, and attentive.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

function GoogleMark() {
  return (
    <span className="testimonial-google-mark" aria-label="Google">
      G
    </span>
  );
}

function Stars() {
  const reduceMotion = useReducedMotion();

  return (
    <span
      className="testimonial-stars"
      aria-label="5 out of 5 stars"
    >
      {"★★★★★".split("").map((star, index) => (
        <motion.span
          key={index}
          className="testimonial-star"
          initial={reduceMotion ? false : { opacity: 0.25, scale: 0.7 }}
          whileInView={
            reduceMotion
              ? undefined
              : { opacity: 1, scale: 1 }
          }
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.35,
            delay: reduceMotion ? 0 : index * 0.12,
            ease: "easeOut",
          }}
        >
          {star}
        </motion.span>
      ))}
    </span>
  );
}

function GoogleReviewBadge() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="testimonial-google-badge"
      animate={
        reduceMotion
          ? undefined
          : { y: [0, -2, 0] }
      }
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <GoogleMark />
      <span><T k="home.patient-testimonials-headi.google-review-fbd8" d={"Google Review"} /></span>
    </motion.span>
  );
}

function TestimonialCard({ testimonial, index }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="testimonial-review-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.7,
        delay: reduceMotion ? 0 : index * 0.18,
        ease: "easeOut",
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -7,
              scale: 1.015,
              transition: { duration: 0.25 },
            }
      }
    >
      <div className="testimonial-review-top">
        <Stars />
        <GoogleReviewBadge />
      </div>

      <blockquote className="testimonial-review-text">
        “{testimonial.review}”
      </blockquote>

      <div className="testimonial-review-divider" />

      <div className="testimonial-patient">
        <motion.div
          className="testimonial-patient-avatar"
          whileHover={
            reduceMotion
              ? undefined
              : { rotate: 5, scale: 1.08 }
          }
          transition={{ duration: 0.25 }}
        >
          {testimonial.initials}
        </motion.div>

        <div className="testimonial-patient-info">
          <h3>{testimonial.name}</h3>

          <p>
            <BadgeCheck size={10} />
            <span><T k="home.patient-testimonials-headi.verified-patient-05b9" d={"Verified Patient"} /></span>
            <span className="testimonial-patient-dot">•</span>
            <span><T k="home.patient-testimonials-headi.abu-dhabi-7ce4" d={"Abu Dhabi"} /></span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function TestimonialsView({ testimonials }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="patient-testimonials-section"
      id="testimonials"
    >
      <div className="patient-testimonials-container">
        <motion.div
          className="patient-testimonials-header"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="patient-testimonials-intro">
            <motion.span
              className="patient-testimonials-eyebrow"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, scale: 0.9 }
              }
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ImageIcon size={11} />
              <T k="home.patient-testimonials-headi.verified-patient-testimoni-32a8" d={"VERIFIED PATIENT TESTIMONIALS"} /></motion.span>

            <h2><T k="home.patient-testimonials-headi.words-of-healing-restored--53f9" d={"Words of Healing & Restored Vitality"} /></h2>

            <p>
              <T k="home.patient-testimonials-headi.read-authentic-reflections-d982" d={"Read authentic reflections from patients who entrusted their physical wellbeing, recovery journeys, and chronic conditions to our physicians and therapists."} /></p>
          </div>

          <motion.div
            className="patient-google-rating"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, x: 35 }
            }
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              delay: reduceMotion ? 0 : 0.2,
            }}
            whileHover={
              reduceMotion
                ? undefined
                : { y: -3, transition: { duration: 0.2 } }
            }
          >
            <div className="patient-google-icon">
              <GoogleMark />
            </div>

            <div className="patient-google-rating-info">
              <div className="patient-google-rating-top">
                <strong>5.0</strong>
                <Stars />
              </div>

              <p><T k="home.patient-testimonials-headi.google-rating-27-google-re-569e" d={"Google Rating • 27+ Google Reviews"} /></p>

              <span className="patient-google-rating-caption">
                <BadgeCheck size={10} />
                <T k="home.patient-testimonials-headi.top-rated-holistic-medicin-d650" d={"Top Rated Holistic Medicine Practitioner in Abu Dhabi"} /></span>
            </div>
          </motion.div>
        </motion.div>

        {/* <div className="patient-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.initials}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div> */}
        
<motion.div
  className="patient-testimonials-grid"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.22,
        delayChildren: 0.15,
      },
    },
  }}
>
  {testimonials.map((testimonial, index) => (
    <TestimonialCard
      key={testimonial.initials}
      testimonial={testimonial}
      index={index}
    />
  ))}
</motion.div>

      </div>
    </section>
  );
}

export default function Testimonials() {
  // Published reviews from the CMS (Admin → Home Page → Reviews).
  const rows = useCmsList("testimonials", undefined);
  const testimonials =
    rows === undefined
      ? DEFAULT_TESTIMONIALS
      : rows.map((r) => ({ initials: r.initials_display, name: r.name, review: r.review }));
  if (!testimonials.length) return null;
  return <TestimonialsView testimonials={testimonials} />;
}
