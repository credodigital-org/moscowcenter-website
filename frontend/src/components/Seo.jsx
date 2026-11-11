import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteText } from "./T";
import { SEO_PAGES } from "../lib/seoDefaults";

/* Sets the browser title, description, keywords, canonical address, social-sharing
   (Open Graph / Twitter) tags and breadcrumb data for the page being viewed.
   Text comes from Admin → page → Page text → “Search engines (SEO)”; the defaults
   live in lib/seoDefaults.js. Renders nothing. */

const SITE_URL = (import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/+$/, "");
const SHARE_IMAGE = "/images/moscow-logo.png";

function setMeta(attr, name, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setBreadcrumb(items) {
  const id = "seo-breadcrumb";
  let el = document.getElementById(id);
  if (!items) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export default function Seo() {
  const { pathname } = useLocation();
  const key = Object.keys(SEO_PAGES).find((k) => SEO_PAGES[k].path === (pathname.replace(/\/+$/, "") || "/"));
  const defaults = SEO_PAGES[key] || SEO_PAGES.home;
  const page = key || "home";

  const title = useSiteText(`seo.${page}.title`) ?? defaults.title;
  const description = useSiteText(`seo.${page}.description`) ?? defaults.description;
  const keywords = useSiteText(`seo.${page}.keywords`) ?? defaults.keywords;

  useEffect(() => {
    const url = `${SITE_URL}${defaults.path === "/" ? "/" : defaults.path}`;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", "index, follow");
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", `${SITE_URL}${SHARE_IMAGE}`);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", `${SITE_URL}${SHARE_IMAGE}`);
    setBreadcrumb(
      page === "home"
        ? null
        : [
            { name: SEO_PAGES.home.name, url: `${SITE_URL}/` },
            { name: defaults.name, url },
          ],
    );
  }, [title, description, keywords, defaults, page]);

  return null;
}
