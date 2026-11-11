/* Site-wide details the admin can change once (Admin → Site-wide → Contact details).
   Each value is `null` until edited, so every place keeps its original wording
   and link until then. */
import { useSiteText } from "../components/T";

const digits = (value) => String(value || "").replace(/[^\d]/g, "");
const DEFAULT_WHATSAPP = "971507800163";
const DEFAULT_EMAIL = "info@moscowcenter.ae";

export function useSiteInfo() {
  const phone = useSiteText("site.phone");
  const whatsapp = useSiteText("site.whatsapp");
  const email = useSiteText("site.email");
  const location = useSiteText("site.location");
  const announcement = useSiteText("site.announcement");
  const footerEmail = useSiteText("site.footer-email");
  const instagram = useSiteText("site.instagram");
  const facebook = useSiteText("site.facebook");
  const tiktok = useSiteText("site.tiktok");
  const whatsappNumber = digits(whatsapp) || DEFAULT_WHATSAPP;
  const contactEmail = email || DEFAULT_EMAIL;
  return {
    phone, // display text, e.g. "+971 50 780 0163"
    tel: phone ? `tel:+${digits(phone)}` : null,
    whatsappNumber, // digits only
    waLink: `https://wa.me/${whatsappNumber}`,
    email: contactEmail,
    mailto: `mailto:${contactEmail.trim()}`,
    location,
    announcement,
    footerMailto: footerEmail ? `mailto:${footerEmail.trim()}` : null,
    instagram,
    facebook,
    tiktok,
  };
}
