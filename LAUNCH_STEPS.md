# Launch steps — from finished code to a live, searchable website

Do the parts **in this order**. Do not buy the domain until Parts A–D work on the free test addresses.

---

## Part A — Final check on your computer

1. `cd backend` → activate the virtual environment → `python manage.py migrate`
2. `python manage.py test` (all tests should pass)
3. `python manage.py seed_clinic` (loads every doctor, treatment, service, review, About text, **all 281 website texts, the SEO titles/descriptions and the 17 home/page images and the video**; safe to run again)
4. `python manage.py runserver`, then in `frontend`: `npm install` → `npm run dev`
5. Open every page, then `/admin`. Edit a text, replace an image, send a test appointment request.
6. `cd frontend && npm run build` — must finish without errors.

---

## Part B — Deploy the backend on Render

1. Create the Neon database and the R2 bucket first (see `DEPLOYMENT.md`, section 1).
2. Push the project to GitHub (**never** commit `.env`).
3. Render → **New → Blueprint** → choose the repository (it reads `render.yaml`).
   *Manual alternative:* New → Web Service → repository → Root Directory `backend` → Runtime Python 3 → Build `pip install -r requirements.txt && python manage.py collectstatic --noinput` → Start `python manage.py migrate --noinput && gunicorn moscow_backend.wsgi:application --timeout 120 --workers 2` → Health check path `/health/` → add `PYTHON_VERSION=3.11.11`.
4. Environment tab — enter: `DJANGO_DEBUG=False`, `DJANGO_SECRET_KEY` (long random), `DATABASE_URL`, the five `R2_*` values, and for now:
   - `DJANGO_ALLOWED_HOSTS` = your Render host, e.g. `moscow-center-api.onrender.com`
   - `DJANGO_CORS_ALLOWED_ORIGINS` = the Vercel address you will get in Part C (come back and set it after C)
   - `DJANGO_CSRF_TRUSTED_ORIGINS` = `https://moscow-center-api.onrender.com`
5. Deploy and wait for **Live**. Open `https://<render-host>/health/` → `{"status": "ok"}`.
6. **Fill the production database from your computer** (free Render has no shell):
   1. In `backend/.env` temporarily put the production `DATABASE_URL` and the five `R2_*` values.
   2. `python manage.py migrate`
   3. `python manage.py seed_clinic` (run it from the **full project folder** — it reads the original images and video from `frontend/src/assets` and uploads them to R2)
   4. `python manage.py createsuperuser` (this is the admin login)
   5. Put `#` in front of those lines in `.env` again.

---

## Part C — Deploy the website on Vercel

1. Vercel → **Add New → Project** → import the same GitHub repository.
2. **Root Directory:** `frontend`. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. Environment Variables:
   - `VITE_API_BASE_URL` = `https://<render-host>` (no `/api` at the end)
   - `VITE_SITE_URL` = the Vercel address for now, e.g. `https://moscow-center.vercel.app` (you will change it to the real domain in Part E)
4. **Deploy**. Open the address and test every page and the video.

---

## Part D — Connect Vercel and Render

1. Copy the Vercel address (e.g. `https://moscow-center.vercel.app`).
2. Render → Environment → set `DJANGO_CORS_ALLOWED_ORIGINS` to exactly that address (no trailing slash; separate several with commas) → save (Render redeploys).
3. On the Vercel site test:
   - [ ] Pages show images and texts
   - [ ] `/admin` login works
   - [ ] Change a text in the admin → refresh the site → it changed
   - [ ] Upload a photo → the address begins with your `R2_PUBLIC_BASE_URL`
   - [ ] Send a test request from the Contact page → it appears in **Admin → Enquiries**
4. If you see "Failed to fetch": open the browser console (F12) and the Render logs. It is almost always `VITE_API_BASE_URL`, CORS, or a sleeping free Render instance. Add an UptimeRobot monitor on `https://<render-host>/health/` (every 5 min).

---

## Part E — Buy the domain and connect it

1. **Buy it in the client's name** (GoDaddy, Namecheap or Cloudflare Registrar). Confirm the exact name with the client first.
2. **Put the DNS on Cloudflare** (needed for the `media.` address on R2): in Cloudflare add the domain, then at the registrar change the nameservers to the two Cloudflare gives you. (Skip if you bought it through Cloudflare Registrar.)
3. **Website → Vercel:** Vercel → Project → Settings → Domains → add `your-domain.com` and `www.your-domain.com`. Create exactly the DNS records Vercel shows (in Cloudflare set them to **DNS only**, grey cloud). Choose which address is primary and let the other redirect to it.
4. **API → Render:** Render → service → Settings → Custom Domains → add `api.your-domain.com`; create the CNAME Render shows; wait for the certificate.
5. **Media → R2:** Cloudflare → R2 → the bucket → Settings → Custom Domains → add `media.your-domain.com`.
6. **Update the settings, then redeploy:**
   - Render: `DJANGO_ALLOWED_HOSTS=api.your-domain.com`, `DJANGO_CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com`, `DJANGO_CSRF_TRUSTED_ORIGINS=https://api.your-domain.com`, `R2_PUBLIC_BASE_URL=https://media.your-domain.com`
   - Vercel: `VITE_API_BASE_URL=https://api.your-domain.com`, `VITE_SITE_URL=https://www.your-domain.com` (use the **primary** address) → **Redeploy** (this rewrites `robots.txt` and `sitemap.xml`, canonical links and link previews automatically)
7. Images that were uploaded while R2 used the old public address keep working; to be sure, spot-check a few pages.
8. Check `https://your-domain.com/robots.txt`, `/sitemap.xml`, `/favicon.ico`.

---

## Part F — Google indexing and basic SEO

1. **Search Console** (search.google.com/search-console) with the client's Google account → **Add property → Domain** → enter the domain → add the TXT record Google shows (in Cloudflare DNS) → **Verify**.
2. **Sitemaps** → enter `sitemap.xml` → **Submit**.
3. **URL Inspection** → paste the home page address → **Request indexing**; repeat for About, Services, Treatments, Doctors and Contact. Google decides when to index; this can take days.
4. In the admin, review each page's **Search engines (SEO)** block (Admin → page → Page text) and make titles/descriptions precise.
5. **Google Business Profile** — claim or create the clinic's profile (only if one does not already exist) with the exact name, address, phone, hours and real photos.
6. Check the live site on a phone and run the free tools: PageSpeed Insights and the Rich Results Test on the home page.
7. Keep fresh content coming: use the admin to add reviews, treatment details and doctor profiles.

---

## Part G — Handover

- [ ] The client owns the domain, Cloudflare, Render, Vercel and Neon accounts (you have team access).
- [ ] Create the client's admin login; remove any shared test logins.
- [ ] Rotate the R2 token that was shared and update Render.
- [ ] Give them `CMS_SETUP.md` (how to edit) and show the Page text, Images and Enquiries tabs.
- [ ] Agree who watches the Enquiries inbox and the notification e-mail address.
