import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Leaf,
  MessageCircle,
  AtSign,
  ShieldCheck,
  BriefcaseMedical,
  Lock,
  Send,
  Footprints,
  Navigation,
} from "lucide-react";
import "./ContactUs.css";
import { slotImgProps, useSlotImage } from "../lib/cms";


import heroImage from "../assets/images/contact-hero.png";
import mapImage from "../assets/images/contact-map1.jpeg";

import T, { TX } from "../components/T";
import { useSiteInfo } from "../lib/siteInfo";
import { EnquiryHoneypot, EnquiryStatus, useEnquiryForm } from "../lib/enquiry";
const DEFAULT_PHONE = "+971 507800163";
const DEFAULT_PHONE_LINK = "tel:+971507800163";
const DEFAULT_WHATSAPP_LINK = "https://wa.me/971507800163";
const DEFAULT_EMAIL = "info@moscowcenter.ae";
const MAPS_LINK =
  "https://maps.google.com/maps?q=24.491975784301758%2C54.36055374145508&z=17&hl=en";

const buildInfoCards = (PHONE, PHONE_LINK, EMAIL) => [
  {
    icon: MapPin,
    dark: true,
    label: "LOCATION",
    title: "Visit Us",
    lines: ["Shabeeb Al Dehari Building", "Khalifa Street,", "Abu Dhabi, UAE"],
    action: { text: "VIEW ON MAP", href: MAPS_LINK, external: true },
  },
  {
    icon: Phone,
    label: "TELEPHONE",
    title: "Call Us",
    strong: PHONE,
    lines: ["Tue - Sun: 10:00 AM - 9:00 PM"],
    action: { text: "CALL CLINIC", href: PHONE_LINK },
  },
  {
    icon: Mail,
    label: "CORRESPONDENCE",
    title: "Email Us",
    strong: EMAIL,
    lines: ["Clinical queries & intake coordination"],
    action: { text: "SEND EMAIL", href: `mailto:${EMAIL}` },
  },
  {
    icon: Clock,
    label: "SANCTUARY HOURS",
    title: "Opening Hours",
    strong: "Tue– Sun: 10:00 AM – 9:00 PM",
    lines: ["Monday: Closed"],
    badge: "DOH LICENSED",
  },
];

const TRUST = [
  { icon: ShieldCheck, title: "DOH Licensed Outpatient Facility", text: "Regulated under Department of Health Abu Dhabi standards." },
  { icon: BriefcaseMedical, title: "Board-Certified Practitioners", text: "Direct consultations with licensed MD and BAMS specialists." },
  { icon: Lock, title: "Confidential Patient Data Protection", text: "Highest privacy protocols applied to your health information." },
];

export default function ContactUs() {
  const site = useSiteInfo();
  const PHONE = site.phone ?? DEFAULT_PHONE;
  const PHONE_LINK = site.tel ?? DEFAULT_PHONE_LINK;
  const WHATSAPP_LINK = site.waLink ?? DEFAULT_WHATSAPP_LINK;
  const EMAIL = site.email ?? DEFAULT_EMAIL;
  const INFO_CARDS = buildInfoCards(PHONE, PHONE_LINK, EMAIL);
  const heroSrc = useSlotImage("page-hero-contact", heroImage);
  const mapSrc = useSlotImage("contact-map", mapImage);
  const reduce = useReducedMotion();

  const fade = (delay = 0, x = 0, y = 28) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, x, y },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: "easeOut" },
  });

  // Opens an appointment email draft; no backend record is created.
  const enquiry = useEnquiryForm("contact", (d) => ({
    full_name: d.get("name") || "",
    phone: d.get("phone") || "", // formatted + validated in lib/enquiry.jsx
    email: d.get("email") || "",
    department: d.get("department") || "",
    preferred_date: d.get("date") || "",
    preferred_time: d.get("time") || "",
    concern: d.get("concern") || "",
  }));
  const handleSubmit = enquiry.submit;

  return (
    <main className="mihmc-ct">
      {/* ================= HERO ================= */}
      <section className="mihmc-ct-hero">
        <div className="mihmc-ct-hero-grid">
          <div className="mihmc-ct-hero-text">
            <motion.span className="mihmc-ct-pill" {...fade(0, 0, 14)}>
              <T k="contact.contact-page.we-re-here-to-help-6528" d={"WE’RE HERE TO HELP"} /></motion.span>

            <motion.h1 {...fade(0.1, -30, 0)}>
              <T k="contact.contact-page.get-in-touch-56cd" d={"Get in Touch"} /><br />
              <em><T k="contact.contact-page.with-our-sanctuary-5b0e" d={"With Our Sanctuary"} /></em>
            </motion.h1>

            <motion.p className="mihmc-ct-lead" {...fade(0.2, -30, 0)}>
              <T k="contact.contact-page.your-journey-towards-perso-683a" d={"Your journey towards personalised holistic care starts with a conversation. Our multidisciplinary clinical desk is here to guide your treatment pathway and arrange your private consultation in Khalifa Street, Abu Dhabi."} /></motion.p>

            <motion.div className="mihmc-ct-actions" {...fade(0.3)}>
              <a href="#appointment-form" className="mihmc-ct-btn dark">
                <T k="contact.contact-page.book-an-appointment-63f1" d={"BOOK AN APPOINTMENT "} /><ArrowDown size={11} />
              </a>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="mihmc-ct-btn soft">
                <MapPin size={11} /> <T k="contact.contact-page.get-directions-e9bb" d={"GET DIRECTIONS"} /></a>
            </motion.div>

            <motion.dl className="mihmc-ct-strip" {...fade(0.4)}>
              <div><dt><T k="contact.contact-page.accredited-6dfe" d={"ACCREDITED"} /></dt><dd><T k="contact.contact-page.doh-abu-dhabi-licensed-7e30" d={"DOH Abu Dhabi Licensed"} /></dd></div>
              <div><dt><T k="contact.contact-page.response-c4c9" d={"RESPONSE"} /></dt><dd><T k="contact.contact-page.within-2-hours-067d" d={"Within 2 Hours"} /></dd></div>
              <div><dt><T k="contact.contact-page.service-5f5c" d={"SERVICE"} /></dt><dd><T k="contact.contact-page.6-days-a-week-534f" d={"6 Days a Week"} /></dd></div>
            </motion.dl>
          </div>

          <motion.div className="mihmc-ct-hero-media" {...fade(0.2, 40, 0)}>
            <img {...slotImgProps(heroSrc)} alt="Moscow International Holistic Medical Center reception" />
            <motion.div
              className="mihmc-ct-desk"
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="mihmc-ct-desk-icon"><Leaf size={13} /></span>
              <div>
                <strong><T k="contact.contact-page.outpatient-clinic-consulta-453a" d={"OUTPATIENT CLINIC & CONSULTATION SUITES"} /></strong>
                <span><T k="contact.contact-page.khalifa-street-abu-dhabi-u-0af5" d={"Khalifa Street, Abu Dhabi, UAE"} /></span>
              </div>
              <em><T k="contact.contact-page.open-tue-sun-5a49" d={"OPEN TUE–SUN"} /></em>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= INFO CARDS ================= */}
      <section className="mihmc-ct-info">
        <div className="mihmc-ct-info-grid">
          {INFO_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.title}
                className="mihmc-ct-info-card"
                {...fade(i * 0.1, 0, 32)}
                whileHover={reduce ? undefined : { y: -6 }}
              >
                <span className={`mihmc-ct-info-icon ${c.dark ? "dark" : ""}`}>
                  <Icon size={14} />
                </span>
                <span className="mihmc-ct-info-label"><TX s="contact.info-cards" d={c.label} /></span>
                <h3><TX s="contact.info-cards" d={c.title} /></h3>
                {c.strong && <strong><TX s="contact.info-cards" d={c.strong} /></strong>}
                <p>
                  {c.lines.map((l, li) => (
                    <React.Fragment key={l}>
                      <TX s="contact.info-cards" d={l} />
                      {li < c.lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>

                {c.action && (
                  <a
                    href={c.action.href}
                    className="mihmc-ct-info-action"
                    {...(c.action.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <TX s="contact.info-cards" d={c.action.text} /> <ArrowRight size={10} />
                  </a>
                )}
                {c.badge && (
                  <span className="mihmc-ct-info-action static">
                    <TX s="contact.info-cards" d={c.badge} /> <CheckCircle2 size={11} />
                  </span>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ================= COORDINATION + FORM ================= */}
      <section className="mihmc-ct-coord">
        <div className="mihmc-ct-coord-grid">
          <motion.div className="mihmc-ct-coord-left" {...fade(0, -40, 0)}>
            <span className="mihmc-ct-kicker"><T k="contact.contact-page.clinical-coordination-443e" d={"CLINICAL COORDINATION"} /></span>
            <h2>
              <T k="contact.contact-page.how-can-we-8b4a" d={"How Can We"} /><br />
              <em><T k="contact.contact-page.help-you-today-63cd" d={"Help You Today?"} /></em>
            </h2>
            <p>
              <T k="contact.contact-page.whether-you-have-questions-458d" d={"Whether you have questions regarding our classical Homeopathy consultations, customized Ayurvedic Panchakarma, or sterile Cupping Therapy (Hijama), our clinical coordination desk is prepared to assist you. Every inquiry is handled with strict medical confidentiality."} /></p>

            <div className="mihmc-ct-concierge">
              <h4><T k="contact.contact-page.direct-contact-concierge-ce13" d={"DIRECT CONTACT CONCIERGE"} /></h4>

              <a href={PHONE_LINK} className="mihmc-ct-row">
                <span className="mihmc-ct-row-icon plain"><Phone size={12} /></span>
                <div>
                  <small><T k="contact.contact-page.direct-clinic-line-6a40" d={"Direct Clinic Line"} /></small>
                  <strong>{PHONE}</strong>
                </div>
                <ArrowRight size={11} />
              </a>

              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mihmc-ct-row">
                <span className="mihmc-ct-row-icon"><MessageCircle size={12} /></span>
                <div>
                  <strong>
                    {site.phone ?? "+971 50 780 0163"} <b><T k="contact.contact-page.fast-triage-e129" d={"FAST TRIAGE"} /></b>
                  </strong>
                  <small><T k="contact.contact-page.whatsapp-appointment-desk-3948" d={"WhatsApp Appointment Desk"} /></small>
                </div>
                <ArrowUpRight size={11} />
              </a>

              <a href={`mailto:${EMAIL}`} className="mihmc-ct-row">
                <span className="mihmc-ct-row-icon plain"><AtSign size={12} /></span>
                <div>
                  <small><T k="contact.contact-page.email-coordination-2b9e" d={"Email Coordination"} /></small>
                  <strong>{EMAIL}</strong>
                </div>
                <ArrowRight size={11} />
              </a>
            </div>

            <ul className="mihmc-ct-trust">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span><Icon size={10} /></span>
                  <div>
                    <strong><TX s="contact.trust" d={title} /></strong>
                    <em><TX s="contact.trust" d={text} /></em>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.form
            id="appointment-form"
            className="mihmc-ct-form"
            onSubmit={handleSubmit}
            {...fade(0.15, 40, 0)}
          >
            <EnquiryHoneypot />
            <span className="mihmc-ct-kicker"><T k="contact.contact-page.initial-consultation-90c1" d={"INITIAL CONSULTATION"} /></span>
            <h2><T k="contact.contact-page.request-an-appointment-6c4a" d={"Request an Appointment"} /></h2>
            <p className="mihmc-ct-form-sub">
              <T k="contact.contact-page.submit-your-details-below--1348" d={"Submit your details below and our medical reception desk will contact you within 2 hours to confirm your preferred schedule."} /></p>

            <div className="mihmc-ct-fields">
              <div className="field full">
                <label htmlFor="ct-name">FULL NAME <i>*</i></label>
                <input id="ct-name" name="name" type="text" placeholder="e.g. Mariam Al Mansoori" autoComplete="name" required />
              </div>

              <div className="field">
                <label htmlFor="ct-phone">PHONE NUMBER <i>*</i></label>
                <div className="phone">
                  <span>+971</span>
                  <input id="ct-phone" name="phone" type="tel" placeholder="50 123 4567" autoComplete="tel-national" required />
                </div>
              </div>

              <div className="field">
                <label htmlFor="ct-email">EMAIL ADDRESS <i>*</i></label>
                <input id="ct-email" name="email" type="email" placeholder="name@domain.ae" autoComplete="email" required />
              </div>

              <div className="field full">
                <label htmlFor="ct-dept">PREFERRED TREATMENT DEPARTMENT <i>*</i></label>
                <select id="ct-dept" name="department" defaultValue="" required>
                  <option value="" disabled>Select Department / Treatment</option>
                  <option>General Consultation</option>
                  <option>Classical Homeopathy</option>
                  <option>Kerala Ayurveda</option>
                  <option>Panchakarma</option>
                  <option>Cupping Therapy (Hijama)</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="ct-date">PREFERRED DATE (OPTIONAL)</label>
                <input id="ct-date" name="date" type="date" />
              </div>

              <div className="field">
                <label htmlFor="ct-time">PREFERRED TIME OF DAY</label>
                <select id="ct-time" name="time" defaultValue="Morning">
                  <option value="Morning">Morning (10:00 AM – 01:00 PM)</option>
                  <option value="Afternoon">Afternoon (01:00 PM – 05:00 PM)</option>
                  <option value="Evening">Evening (05:00 PM – 09:00 PM)</option>
                </select>
              </div>

              <div className="field full">
                <label htmlFor="ct-concern">HEALTH CONCERN / INQUIRY</label>
                <textarea
                  id="ct-concern"
                  name="concern"
                  rows={3}
                  placeholder="Briefly describe your symptoms, primary health objectives, or specific questions for our practitioners..."
                />
              </div>
            </div>

            <label className="mihmc-ct-consent">
              <input type="checkbox" required />
              <span>
                <T k="contact.contact-page.i-agree-to-the-processing--36d1" d={"I agree to the processing of my contact information in accordance with MIHMC patient privacy policies. Submitting this form opens an appointment email draft; I must press Send. The clinic may contact me by phone or email."} /></span>
            </label>

            <motion.button
              type="submit"
              disabled={enquiry.status.state === "sending"}
              className="mihmc-ct-submit"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.99 }}
            >
              <T k="contact.contact-page.request-an-appointment-673a" d={"REQUEST AN APPOINTMENT "} /><Send size={11} />
            </motion.button>
            <EnquiryStatus status={enquiry.status} />

            <p className="mihmc-ct-form-note">
              <Lock size={9} /> <T k="contact.contact-page.strict-medical-confidentia-0bd6" d={"Strict medical confidentiality assured. No automatic booking charges."} /></p>
          </motion.form>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="mihmc-ct-map">
        <motion.header className="mihmc-ct-map-head" {...fade()}>
          <span className="mihmc-ct-kicker"><T k="contact.contact-page.location-access-8027" d={"LOCATION & ACCESS"} /></span>
          <h2><T k="contact.contact-page.find-our-sanctuary-in-abu--97db" d={"Find Our Sanctuary in Abu Dhabi"} /></h2>
          <p>
            <T k="contact.contact-page.conveniently-located-at-sh-6c5f" d={"Conveniently located at Shabeeb Aldhaheri Building, Office 01, Khalifa Street, opposite FAB Bank, Al Danah, Zone 1, Abu Dhabi, United Arab Emirates."} /></p>
        </motion.header>

        <div className="mihmc-ct-map-grid">
          <motion.a
            className="mihmc-ct-map-photo"
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the clinic location in Google Maps"
            {...fade(0.05, -36, 0)}
          >
            <img {...slotImgProps(mapSrc)} alt="Map of Abu Dhabi showing the clinic area" loading="lazy" />
            <span className="mihmc-ct-map-label"><T k="contact.contact-page.abu-dhabi-dbe6" d={"ABU DHABI"} /></span>
            <span className="mihmc-ct-map-gps"><T k="contact.contact-page.gps-24-4716-n-54-3498-e-1424" d={"GPS: 24.4716° N, 54.3498° E"} /></span>
          </motion.a>

          <motion.div className="mihmc-ct-map-side" {...fade(0.15, 36, 0)}>
            <div className="mihmc-ct-map-card">
              <h4><MapPin size={11} /> <T k="contact.contact-page.sanctuary-address-554f" d={"SANCTUARY ADDRESS"} /></h4>
              <strong><T k="contact.contact-page.khalifa-street-07b1" d={"Khalifa Street"} /></strong>
              <p>
                <T k="contact.contact-page.shabeeb-aldhaheri-building-404f" d={"Shabeeb Aldhaheri Building, Office 01, Khalifa Street, opposite FAB Bank, Al Danah, Zone 1, Abu Dhabi, United Arab Emirates."} /></p>
            </div>

            <div className="mihmc-ct-map-card">
              <h4><Footprints size={11} /> <T k="contact.contact-page.transit-landmarks-9970" d={"TRANSIT & LANDMARKS"} /></h4>
              <p>
                <T k="contact.contact-page.conveniently-located-on-kh-eb07" d={"Conveniently located on Khalifa Street, opposite FAB Bank in Al Danah, Zone 1, Abu Dhabi, with convenient access to nearby public transport and local amenities."} /></p>
            </div>

            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="mihmc-ct-directions">
              <T k="contact.contact-page.get-directions-via-google--20aa" d={"GET DIRECTIONS VIA GOOGLE MAPS "} /><ArrowUpRight size={11} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mihmc-ct-cta-wrap">
        <motion.div className="mihmc-ct-cta" {...fade(0, 0, 36)}>
          <span className="mihmc-ct-cta-pill"><T k="contact.contact-page.immediate-assistance-ab5d" d={"IMMEDIATE ASSISTANCE"} /></span>
          <h2>
            <T k="contact.contact-page.have-a-question-6e99" d={"Have a Question?"} /><br />
            <em><T k="contact.contact-page.we-re-happy-to-help-53cf" d={"We’re Happy to Help."} /></em>
          </h2>
          <p>
            <T k="contact.contact-page.reach-out-to-our-clinical--6375" d={"Reach out to our clinical team directly for prompt guidance on treatments, doctor availability, or navigating your upcoming visit."} /></p>

          <div className="mihmc-ct-cta-actions">
            <a href={PHONE_LINK} className="mihmc-ct-btn white">
              <Phone size={11} /> CALL CLINIC ({PHONE})
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mihmc-ct-btn ghost">
              <MessageCircle size={11} /> WHATSAPP US ({site.phone ?? "+971 507800163"})
            </a>
          </div>

          <ul className="mihmc-ct-cta-meta">
            <li><Clock size={9} /> <T k="contact.contact-page.10-00-am-9-00-pm-80c9" d={"10:00 AM - 9:00 PM"} /></li>
            <li><Navigation size={9} /> <T k="contact.contact-page.direct-doctor-coordination-b3d2" d={"Direct Doctor Coordination"} /></li>
          </ul>
        </motion.div>
      </section>
    </main>
  );
}
