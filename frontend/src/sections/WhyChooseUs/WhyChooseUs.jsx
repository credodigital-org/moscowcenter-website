import React, { useEffect, useRef, useState } from "react";
import "./WhyChooseUs.css";
import { useHomeSlots } from "../../lib/cms";

import ayurvedaVideo from "../../assets/videos/ayurveda-treatment.mp4";

import T from "../../components/T";
const services = [
  "Outpatient Care Services",
  "Experienced Ayurvedic Doctors",
  "Personalised Homeopathy Care",
  "Specialised Cupping Therapy",
  "Personalised Treatment Plans",
];

function WhyChooseUsView({ slots }) {
  // Video (and optional cover photo) come from the CMS; the original video is the default.
  const videoSrc = slots.video("why-choose-us", ayurvedaVideo);
  const videoPoster = slots.image("why-choose-us", undefined);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error("Video playback failed:", error);
      }
    } else {
      video.pause();
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`why-moscow-section ${visible ? "is-visible" : ""}`}
      id="about"
    >
      <div className="why-moscow-container">

        {/* Service labels */}
        <div className="why-moscow-tags">
          {services.map((service, i) => (
            <div
              className="why-moscow-tag reveal reveal-up"
              style={{ "--delay": `${i * 0.3}s` }}
              key={service}
            >
              {service}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="why-moscow-content">

          {/* Left content */}
          <div
            className="why-moscow-text reveal reveal-left"
            style={{ "--delay": "0.5s" }}
          >
            <h2>
              <T k="home.why-choose-us.why-choose-moscow-5353" d={"Why Choose Moscow\nInternational Holistic\nMedical Centre?"} br={"className=\"desktop-break\""} /></h2>

            <p>
              <T k="home.why-choose-us.moscow-international-holis-a21d" d={"Moscow International Holistic Centre is a trusted Ayurvedic, Homeopathy, Cupping Therapy hospital in Abu Dhabi, offering authentic treatments based on traditional principles. We focus on understanding the root cause of each health concern and creating personalised treatment plans for every patient."} /></p>

            <p>
              <T k="home.why-choose-us.our-holistic-approach-brin-bfa3" d={"Our holistic approach brings together Homeopathy, Ayurveda, and Cupping Therapy, with care thoughtfully selected according to each individual’s health needs. Our services focus on personalised outpatient care, supporting overall well-being through a comfortable and patient-centred approach."} /></p>

            <div className="reveal reveal-up" style={{ "--delay": "1s" }}>
              <a href="#services" className="why-moscow-button">
                <T k="home.why-choose-us.discover-our-approach-e174" d={"Discover Our Approach"} /></a>
            </div>
          </div>

          
          {/* Right video - Video only */}
          <div
            className="why-moscow-video-wrap reveal reveal-right"
            style={{ "--delay": "0.65s" }}
          >
            <video
              key={videoSrc}
              ref={videoRef}
              poster={videoPoster}
              className="why-moscow-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={videoSrc} type={videoSrc === ayurvedaVideo ? "video/mp4" : undefined} />
              Your browser does not support video playback.
            </video>
          </div>


        </div>
      </div>
    </section>
  );
}

export default function WhyChooseUs() {
  const slots = useHomeSlots();
  if (!slots) return null;
  return <WhyChooseUsView slots={slots} />;
}
