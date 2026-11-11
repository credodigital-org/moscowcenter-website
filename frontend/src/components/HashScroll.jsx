import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Deep links such as /#our-doctors: sections load their content from the CMS a
   moment after the page mounts, so the browser's own anchor scroll can fire too
   early. This retries briefly until the target section exists, then scrolls. */
export default function HashScroll() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = setInterval(() => {
      const target = document.getElementById(id);
      tries += 1;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(timer);
      } else if (tries > 40) {
        clearInterval(timer);
      }
    }, 150);
    return () => clearInterval(timer);
  }, [hash, pathname]);

  return null;
}
