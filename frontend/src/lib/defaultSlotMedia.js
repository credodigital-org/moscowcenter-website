/* The original design image / video for each replaceable slot, so the admin can
   show what the website currently displays before anything is customised. */
import ayurveda from "../assets/images/ayurveda.png";
import hijama from "../assets/images/hijama.png";
import homeopathy from "../assets/images/homeopathy.png";
import whyVideo from "../assets/videos/ayurveda-treatment.mp4";
import statsBg from "../assets/images/stats-bg.jpeg";
import discAyurveda from "../assets/images/authentic-ayurveda1.jpg";
import discHomeopathy from "../assets/images/clinical-homeopathy1.png";
import discCupping from "../assets/images/medical-cupping.png";
import homeopathyCare from "../assets/images/homeopathy-care1.png";
import cuppingHero from "../assets/images/cupping-hero.png";
import homeMap from "../assets/images/map.png";
import treatmentsHero from "../assets/images/treatments-hero1.jpeg";
import treatmentsCupping from "../assets/images/treatments/cupping-therapy.png";
import servicesHero from "../assets/images/service-hero.png";
import contactHero from "../assets/images/contact-hero.png";
import contactMap from "../assets/images/contact-map1.jpeg";
import logo from "../assets/images/moscow-logo.png";

export const DEFAULT_SLOT_MEDIA = {
  "hero-ayurveda": { image: ayurveda },
  "hero-hijama": { image: hijama },
  "hero-homeopathy": { image: homeopathy },
  "why-choose-us": { video: whyVideo },
  "stats-banner": { image: statsBg },
  "discipline-ayurveda": { image: discAyurveda },
  "discipline-homeopathy": { image: discHomeopathy },
  "discipline-cupping": { image: discCupping },
  "homeopathy-care": { image: homeopathyCare },
  "cupping-hero": { image: cuppingHero },
  "home-contact-map": { image: homeMap },
  "page-hero-treatments": { image: treatmentsHero },
  "treatments-cupping": { image: treatmentsCupping },
  "page-hero-services": { image: servicesHero },
  "page-hero-contact": { image: contactHero },
  "contact-map": { image: contactMap },
  "site-logo": { image: logo },
};
