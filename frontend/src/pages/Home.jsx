import React from "react";

// Import all home page sections
import Hero from "../sections/Hero/Hero";
import AyurvedicTreatments from "../sections/AyurvedicTreatments/AyurvedicTreatments";
import Contact from "../sections/Contact/Contact";
import CuppingHero from "../sections/CuppingHero/CuppingHero";
import HealthcareTeam from "../sections/HealthcareTeam/HealthcareTeam";
import HomeopathyCare from "../sections/HomeopathyCare/HomeopathyCare";
import OurServices from "../sections/OurServices/OurServices";
import StatsBanner from "../sections/StatsBanner/StatsBanner";
import Testimonials from "../sections/Testimonials/Testimonials";
import TherapeuticDisciplines from "../sections/TherapeuticDisciplines/TherapeuticDisciplines";
import WhyChooseUs from "../sections/WhyChooseUs/WhyChooseUs";
import Services from "../sections/Services/Services";

export default function Home() {
  return (
    <>
    
      <Hero />
      <WhyChooseUs />
      <StatsBanner />
      <TherapeuticDisciplines />
      <OurServices />
      <AyurvedicTreatments />
      <Services />
      <HomeopathyCare />
      <CuppingHero />
      <HealthcareTeam />
      <Testimonials />
      <Contact />
    </>
  );
}