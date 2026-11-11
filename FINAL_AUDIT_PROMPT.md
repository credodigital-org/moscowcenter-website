# Prompt for the final audit and correction

Copy everything below the line into an AI coding tool (Claude Code, Cursor, etc.) with the **whole project folder open**. It is written for this exact project, so it will not invent a different structure.

---

You are auditing and finishing a production website. Work in the project folder that contains `backend/` and `frontend/`.

## Project facts (do not change these)
- Client: Moscow International Holistic Medical Center, Abu Dhabi (Ayurveda, Homeopathy, Cupping/Hijama).
- Frontend: React 19 + Vite in `frontend/`. Backend: Django 5.1 + Django REST Framework in `backend/` (app `clinic`, project `moscow_backend`), JWT login, PostgreSQL (Neon) in production, SQLite locally.
- Media: Cloudflare R2 through `django-storages` (env vars `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT_URL`, `R2_PUBLIC_BASE_URL`).
- Hosting: Render (API, `render.yaml`) + Vercel (website, `frontend/vercel.json`).
- The CMS is the React page `/admin` (`frontend/src/pages/AdminPage.jsx`), organised page by page. Website text is wrapped in `<T k="…" d="original wording">` (`frontend/src/components/T.jsx`); every editable text is listed in `frontend/src/lib/textManifest.js`; lists come from the REST API (`/api/doctors/`, `/treatments/`, `/services/`, `/testimonials/`, `/about-*`, `/home-sections/`, `/site-texts/`, `/appointments/`).
- There is **no gallery** (the client does not want one). Do not add one.

## Absolute rules
1. Do **not** redesign anything. Layout, colours, typography, animations, section order and URLs must stay exactly as they are. The first paint must equal the original design.
2. Do **not** remove or shorten any existing content. Do **not** invent client facts (addresses, qualifications, ratings, reviews, prices).
3. Never print, log, commit or hard-code secrets. Never read `backend/.env` aloud.
4. Never claim something passed unless you actually ran it. Report anything you could not run, and why.
5. Do not deploy anything.

## Tasks
### 1. Inspect
Read the whole codebase. List missing, duplicated, hard-coded or broken things before changing anything.

### 2. Content migration check
Confirm that **every** piece of existing website content is in the backend or editable through it:
- `python manage.py seed_clinic` must create: 4 doctors, 25 treatments, 15 services, 3 approach cards, the About page, 3 reviews, 17 home/page image-or-video slots (stored in R2), and 281 website texts (including SEO titles/descriptions).
- Compare each page's rendered text/images with the original design and list anything still hard-coded in React that the client could reasonably want to change. Explain each; fix only what can be fixed without changing the design.
- Check that `seed_clinic` is safe to run twice (no duplicates) and that `--reset` behaves as documented.

### 3. Admin check
Using the code (and the running app if you can start it), confirm the administrator can add / edit / delete / hide: doctors, treatments, services, reviews, About cards and extra sections; replace every image and the video; edit every text and the SEO fields; read and manage appointment requests (Enquiries); change phone/WhatsApp/e-mail/location/announcement/social links.

### 4. Cloudflare R2
Verify storage settings in `backend/moscow_backend/settings.py`; verify `python manage.py check_storage`; verify deletes/replacements remove old files (`backend/clinic/signals.py`). Confirm nothing in `frontend/` contains a secret.

### 5. SEO (verify and complete)
- Every public page has a unique `<title>`, meta description, keywords, canonical URL, Open Graph and Twitter tags, set by `frontend/src/components/Seo.jsx` from `frontend/src/lib/seoDefaults.js` (editable in the admin).
- `index.html` has favicon.ico, PNG icons, apple-touch-icon, `site.webmanifest`, theme colour, and JSON-LD (`WebSite`, `MedicalClinic`) using only verified details. Per-page `BreadcrumbList` is injected by `Seo.jsx`.
- `robots.txt` and `sitemap.xml` are generated at build time from `VITE_SITE_URL` (`frontend/scripts/generate-seo-files.mjs`); `/admin` is disallowed and the admin page sets `noindex`.
- Check heading hierarchy (one H1 per page), image `alt` text, lazy loading, no broken internal links, no `noindex` on public pages. Note that the meta keywords tag is not a Google ranking factor; do not oversell it.
- Do not invent locations, ratings or medical claims.

### 6. Production readiness
Check: `DEBUG=False` behaviour, the startup guard for the secret key, `ALLOWED_HOSTS`, CORS and CSRF settings, HTTPS headers, WhiteNoise/static files, the `/health/` endpoint, rate limit and spam trap on `/api/appointments/`, `NUM_PROXIES`, large-video upload limits (gunicorn `--timeout 120`), SPA rewrites in `vercel.json`, and that no URL points at `localhost` in a production build (`grep -rn "localhost" frontend/src frontend/index.html`).

### 7. Run and report (actually run these)
```
cd backend
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
python manage.py migrate
python manage.py seed_clinic
python manage.py check_storage
cd ../frontend
npm install
npm run build
npm run lint
```
For each command give the exact result. If a command cannot run in your environment, say so — do not guess.

### 8. Fix and final report
Fix real defects with the smallest possible changes. Then output: issues found; changes made (file by file); content that is migrated; content that is not editable and why; admin status; R2 status; SEO status; build/test results (only what was run); remaining manual steps (domain, keys, real phone/e-mail, photos); and the exact deploy steps.
