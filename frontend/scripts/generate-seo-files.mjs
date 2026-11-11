// Writes public/robots.txt and public/sitemap.xml for the website address in
// VITE_SITE_URL (Vercel environment variable, or frontend/.env.production).
// Runs automatically before `npm run build`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fromEnvFile(name) {
  const file = path.join(root, ".env.production");
  if (!fs.existsSync(file)) return undefined;
  const line = fs.readFileSync(file, "utf8").split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim() : undefined;
}

const site = (process.env.VITE_SITE_URL || fromEnvFile("VITE_SITE_URL") || "").replace(/\/+$/, "");
if (!site) {
  console.warn("VITE_SITE_URL is not set; leaving robots.txt and sitemap.xml unchanged.");
  process.exit(0);
}

const pages = ["/", "/about", "/services", "/treatments", "/doctors", "/contact"];
const today = new Date().toISOString().slice(0, 10);

fs.writeFileSync(
  path.join(root, "public", "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages
      .map((p) => `  <url><loc>${site}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod></url>`)
      .join("\n") +
    `\n</urlset>\n`,
);

fs.writeFileSync(
  path.join(root, "public", "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`,
);

console.log(`SEO files written for ${site}`);
