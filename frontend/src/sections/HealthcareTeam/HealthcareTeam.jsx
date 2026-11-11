import React, { useCallback, useEffect, useRef, useState } from "react";
import { BadgeCheck, CalendarDays } from "lucide-react";
import "./HealthcareTeam.css";
import { mapDoctorCard, useCmsList } from "../../lib/cms";

import ehadImage from "../../assets/images/dr-ehab-makki.jpg";
import monikaImage from "../../assets/images/dr-monika-tyagi.jpg";
import ashnaImage from "../../assets/images/dr-ashna-muhammad.jpg";
import obaidullahImage from "../../assets/images/dr-obaidullah.png";

import T from "../../components/T";
const DEFAULT_DOCTORS = [
  {
    name: "Dr. Ehab Makki",
    role: "Managing Director",
    specialty: "HOMEOPATHIC PRACTITIONER",
    experience: "17+ Years Experience",
    qualification: "MD, PG (Homeopath) UK",
    description:
      "Diplomate of the American Academy of Aesthetic Medicine (AAAM)",
    image: ehadImage,
    alt: "Dr. Ehab Makki, homeopathic practitioner",
    availability: "Mon – Sat",
  },
  {
    name: "Dr. Monika Tyagi",
    role: "Senior Consultant",
    specialty: "HOMEOPATHY PRACTITIONER",
    experience: "15+ Years Experience",
    qualification:
      "Bachelor of Homeopathic Medicine & Surgery (BHMS), with postgraduate diplomas in Clinical Research (PGDCR) and Health Promotion (PGDHP)",
    description: "",
    image: monikaImage,
    alt: "Dr. Monika Tyagi, homeopathy practitioner",
    availability: "Mon – Sat",
  },
  {
    name: "Dr. Ashna Muhammad",
    role: "Senior Consultant",
    specialty: "AYURVEDA PRACTITIONER",
    experience: "5+ Years Experience",
    qualification: "",
    description:
      "Joint & Musculoskeletal Care, Digestive Health, Women’s Wellness, Panchakarma Therapies",
    image: ashnaImage,
    alt: "Dr. Ashna Muhammad, Ayurveda practitioner",
    availability: "Mon – Sat",
  },
  {
    name: "Dr. Obaidullah",
    role: "Senior Consultant",
    specialty: "HIJAMA PRACTITIONER",
    experience: "18+ Years Experience",
    qualification: "",
    description:
      "Pain & Musculoskeletal care, Metabolic & Stress Relief, Clinical Hijama Therapy",
    image: obaidullahImage,
    alt: "Dr. Obaidullah, Hijama practitioner",
    availability: "Tue – Sun",
  },
];

const PER_PAGE = 2; // cards visible at a time
const SWITCH_EVERY = 5000; // 5 seconds
const EXIT_MS = 600; // exit animation length

function DoctorCard({ doctor, slot }) {
  // left card (slot 0) comes from the top, right card (slot 1) from the bottom
  const direction = slot === 0 ? "from-top" : "from-bottom";

  return (
    <article
      className={`healthcare-doctor-card hd-card ${direction}`}
      style={{ "--delay": `${0.1 + slot * 0.18}s`, "--i": slot }}
    >
      <div className="healthcare-doctor-photo">
        <img src={doctor.image} alt={doctor.alt} loading="lazy" />

        <span className="healthcare-doctor-role">
          <BadgeCheck size={10} strokeWidth={1.8} />
          {doctor.role}
        </span>

        <span className="healthcare-doctor-availability">
          <CalendarDays size={11} />
          {doctor.availability}
        </span>
      </div>

      <div className="healthcare-doctor-details">
        <p className="healthcare-doctor-specialty">{doctor.specialty}</p>

        <h3>{doctor.name}</h3>

        <p className="healthcare-doctor-experience">
          <span aria-hidden="true">•</span> {doctor.experience}
        </p>

        {doctor.qualification && (
          <p className="healthcare-doctor-description">
            Specialization: {doctor.qualification}
            {doctor.description ? ` ${doctor.description}` : ""}
          </p>
        )}

        {!doctor.qualification && doctor.description && (
          <p className="healthcare-doctor-description">
            Specialization: {doctor.description}
          </p>
        )}
      </div>
    </article>
  );
}

function HealthcareTeamView({ doctors }) {
  const sectionRef = useRef(null);
  const swapTimer = useRef(null);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const pages = Math.ceil(doctors.length / PER_PAGE);
  const current = doctors.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  // Scroll reveal (animate only once)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

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
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play exit animation, then swap to the next pair
  const changePage = useCallback((next) => {
    clearTimeout(swapTimer.current);
    setLeaving(true);
    swapTimer.current = setTimeout(() => {
      setPage(next);
      setLeaving(false);
    }, EXIT_MS);
  }, []);

  // Auto switch every 5 seconds
  useEffect(() => {
    if (!visible || pages < 2) return;
    const timer = setInterval(() => {
      changePage((page + 1) % pages);
    }, SWITCH_EVERY);
    return () => clearInterval(timer);
  }, [visible, page, pages, changePage]);

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  return (
    <section
      ref={sectionRef}
      className={`healthcare-team-section ${visible ? "is-visible" : ""}`}
      id="our-doctors"
    >
      <div className="healthcare-team-container">
        <header className="healthcare-team-header">
          <h2 className="hd-reveal" style={{ "--delay": "0s" }}>
            <T k="home.meet-our-healthcare-team.meet-our-healthcare-f536" d={"Meet Our Healthcare\nTeam"} br={""} /></h2>

          <p className="hd-reveal" style={{ "--delay": "0.2s" }}>
            <T k="home.meet-our-healthcare-team.our-dedicated-team-brings--3c24" d={"Our dedicated team brings expertise, care, and professionalism to every consultation.\nWe are committed to creating a comfortable and supportive experience for every patient."} br={"className=\"healthcare-desktop-break\""} /></p>
        </header>

        <div
          className={`healthcare-team-grid ${leaving ? "is-leaving" : ""}`}
        >
          {current.map((doctor, slot) => (
            <DoctorCard
              key={`${page}-${doctor.name}`}
              doctor={doctor}
              slot={slot}
            />
          ))}
        </div>

        {pages > 1 && (
          <div className="healthcare-dots" role="tablist" aria-label="Doctors">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Show doctors ${i * PER_PAGE + 1} to ${Math.min(
                  (i + 1) * PER_PAGE,
                  doctors.length
                )}`}
                className={`healthcare-dot ${i === page ? "active" : ""}`}
                onClick={() => i !== page && changePage(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HealthcareTeam() {
  // Published doctors from the CMS, in the order set there.
  const rows = useCmsList("doctors", undefined);
  if (rows === null) return null;
  const doctors = rows === undefined ? DEFAULT_DOCTORS : rows.map(mapDoctorCard);
  if (!doctors.length) return null;
  return <HealthcareTeamView doctors={doctors} />;
}
