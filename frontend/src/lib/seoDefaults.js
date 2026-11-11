/* Search-engine defaults for every public page. The admin can change each value
   (Admin → page → Page text → “Search engines (SEO)”); these are used until then.
   Only facts that appear on the website itself are used here. */

export const SEO_PAGES = {
  home: {
    path: "/",
    name: "Home",
    title: "Moscow International Holistic Medical Center, Abu Dhabi",
    description:
      "Personalised Ayurveda, classical Homeopathy and Cupping (Hijama) therapy with licensed doctors in Khalifa Street, Abu Dhabi. Book a consultation.",
    keywords:
      "Moscow International Holistic Medical Center, holistic medical center Abu Dhabi, Ayurveda treatment Abu Dhabi, homeopathy Abu Dhabi, cupping therapy, Hijama, doctor consultation",
  },
  about: {
    path: "/about",
    name: "About",
    title: "About Us | Moscow International Holistic Medical Center",
    description:
      "Learn about Moscow International Holistic Medical Center: licensed holistic care combining Ayurveda, Homeopathy and Cupping therapy in Abu Dhabi.",
    keywords:
      "about Moscow International Holistic Medical Center, holistic healthcare Abu Dhabi, Ayurveda, Homeopathy, Cupping therapy",
  },
  services: {
    path: "/services",
    name: "Services",
    title: "Our Services | Ayurveda, Homeopathy & Cupping Therapy",
    description:
      "Explore our departments: classical Homeopathy, authentic Kerala Ayurveda and medicinal Cupping (Hijama), supervised by licensed practitioners in Abu Dhabi.",
    keywords:
      "classical homeopathy, Kerala Ayurveda, Panchakarma, medicinal cupping, Hijama, holistic services Abu Dhabi",
  },
  treatments: {
    path: "/treatments",
    name: "Treatments",
    title: "Treatments | Ayurveda, Relaxation Therapies & Packages",
    description:
      "Ayurvedic treatments, relaxation therapies such as Abhyangam and Shirodhara, treatment packages and a homeopathy approach in Abu Dhabi.",
    keywords:
      "Ayurvedic treatments, Abhyangam, Shirodhara, Nasyam, herbal facial, body scrub, homeopathy approach, treatment packages Abu Dhabi",
  },
  doctors: {
    path: "/doctors",
    name: "Doctors",
    title: "Our Doctors | Moscow International Holistic Medical Center",
    description:
      "Meet the licensed Homeopathy, Ayurveda and Hijama practitioners at Moscow International Holistic Medical Center in Abu Dhabi.",
    keywords:
      "homeopathy doctor Abu Dhabi, Ayurveda doctor Abu Dhabi, Hijama practitioner, holistic doctors, doctor consultation",
  },
  contact: {
    path: "/contact",
    name: "Contact",
    title: "Contact Us & Book an Appointment | Moscow Holistic Medical Center",
    description:
      "Book a consultation or contact Moscow International Holistic Medical Center on Khalifa Street, Abu Dhabi by phone, WhatsApp or the appointment form.",
    keywords:
      "contact Moscow International Holistic Medical Center, book appointment Abu Dhabi, Khalifa Street clinic, holistic clinic phone",
  },
};

export const SEO_FIELDS = [
  { field: "title", label: "Browser tab / Google title", help: "Shown in the browser tab and as the blue Google link. Aim for under 60 characters." },
  { field: "description", label: "Google description", help: "The grey text under the link in search results. Aim for 140–160 characters." },
  { field: "keywords", label: "Keywords (optional)", help: "Comma-separated search terms for planning. Google does not use this as a ranking signal — good titles, headings and page text matter more." },
];

/** Entries for the admin's text editor (one SEO block per page). */
export function seoManifestEntries() {
  const entries = [];
  for (const [page, cfg] of Object.entries(SEO_PAGES)) {
    for (const f of SEO_FIELDS) {
      entries.push({
        key: `seo.${page}.${f.field}`,
        page,
        section: "Search engines (SEO)",
        text: cfg[f.field],
        label: f.label,
        help: f.help,
        setting: true,
      });
    }
  }
  return entries;
}
