# Deployment guide & manual-changes checklist

Architecture (same as the Genet Dental project):

```
your-domain.com ──► Vercel (React site + /admin)
                       │  HTTPS
                       ▼
                    Render (Django REST API)
                    ├──► Neon PostgreSQL   (all content, enquiries)
                    └──► Cloudflare R2     (every uploaded image and video)
```

## 1. Values you need before you start

| Environment variable | Where it comes from | Set it in |
|---|---|---|
| `DATABASE_URL` | Neon → project → Connection string | Render |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Cloudflare R2 → Manage API tokens → *Object Read & Write*, limited to the bucket | Render |
| `R2_BUCKET_NAME` | the bucket you created | Render |
| `R2_ENDPOINT_URL` | `https://<account_id>.r2.cloudflarestorage.com` | Render |
| `R2_PUBLIC_BASE_URL` | the bucket's public address, e.g. `https://media.your-domain.com` | Render |
| `DJANGO_SECRET_KEY` | generated for you by `render.yaml` | Render |
| `DJANGO_ALLOWED_HOSTS` | the API host, e.g. `api.your-domain.com` (the `onrender.com` host is added automatically) | Render |
| `DJANGO_CORS_ALLOWED_ORIGINS` | the website origins, no trailing slash: `https://your-domain.com,https://www.your-domain.com` | Render |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://api.your-domain.com` | Render |
| `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `ENQUIRY_NOTIFY_EMAILS` | *optional* — only to get an e-mail for each appointment request | Render |
| `VITE_API_BASE_URL` | the API address, e.g. `https://api.your-domain.com` | Vercel |
| `VITE_SITE_URL` | the public website address, e.g. `https://www.your-domain.com` — used for canonical links, link previews, `robots.txt` and `sitemap.xml` (regenerated on every build) | Vercel |

Never put these in Git or in the frontend. `backend/.env` is ignored by Git.

## 2. Deploy, step by step

1. **Git.** Push the project (the `backend/` and `frontend/` folders as they are) to a GitHub repository.
2. **Neon.** Create a project, copy the connection string.
3. **Cloudflare R2.** Create the bucket, allow public access (custom domain preferred), create the API token.
4. **Render.** New → *Blueprint* → choose the repository. `render.yaml` creates the service with the correct build/start commands (`collectstatic`, then `migrate` + `gunicorn --timeout 120`, health check `/health/`). Fill in the variables marked `sync: false` from the table above.
   - If you prefer to create the service by hand: root directory `backend`, Python `3.11.11` (`PYTHON_VERSION`), the same build and start commands as in `render.yaml`.
   - Render ignores the `Procfile`; it is there for hosts that use it.
5. **First-time data and admin login.** Free Render services have no shell, so run these **on your own computer** against the production services:
   1. In `backend/.env` put the production `DATABASE_URL` and the five `R2_*` values (temporarily).
   2. `python manage.py migrate`
   3. `python manage.py seed_clinic` — loads the original content, all website texts and SEO text, and uploads every image and the video to R2. **Run it from the full project folder** (it reads the original images from `frontend/src/assets`).
   4. `python manage.py createsuperuser` — **this is the admin login; there is no default.**
   5. Remove those lines from `.env` again.
6. **Vercel.** Import the repository: root directory `frontend`, framework *Vite*, build `npm run build`, output `dist`. Add `VITE_API_BASE_URL`.
7. **Domain.** In Vercel add the domain and create exactly the DNS records it shows. Point `api.` at Render (Render → Settings → Custom Domains) and `media.` at R2 (R2 → bucket → Custom Domain). Then update `DJANGO_ALLOWED_HOSTS`, `DJANGO_CORS_ALLOWED_ORIGINS`, `DJANGO_CSRF_TRUSTED_ORIGINS` on Render and redeploy.
8. **Keep-alive.** Add an UptimeRobot monitor for `https://<api-host>/health/` (every 5 minutes) so the free Render instance stays awake.
9. **Smoke test** (below), then give the client their admin login.

## 3. Smoke test after deploying

- [ ] `https://<api-host>/health/` shows `{"status": "ok"}`
- [ ] The website loads, all six pages open, images and the video play
- [ ] `/admin` login works with the account you created
- [ ] Replace one image in Admin → Home Page → Images; the website shows it (refresh)
- [ ] Upload a photo and confirm its address starts with your `R2_PUBLIC_BASE_URL`
- [ ] Send a test request from the Contact page → it appears in Admin → Enquiries (and in the mailbox if e-mail is set up)
- [ ] Hide a doctor in Admin → Doctors; it disappears from the website
- [ ] `https://your-domain.com/robots.txt` and `/sitemap.xml` open

## 4. What you must add or change by hand

| # | Where | What to change |
|---|---|---|
| 1 | Vercel → `VITE_SITE_URL` (and the default in `frontend/.env.production`) | Set the **real domain** (the default `https://www.moscowcenter.ae` is a placeholder; confirm it with the client). `robots.txt`, `sitemap.xml`, canonical links and link previews follow it automatically. Also check the phone/e-mail/address in the `ld+json` block of `frontend/index.html`, and the SEO titles/descriptions in Admin |
| 2 | Render → Environment | All variables in section 1 |
| 3 | Vercel → Environment | `VITE_API_BASE_URL` |
| 4 | Domain registrar / Cloudflare | DNS records for the website, `api.` and `media.` |
| 5 | Admin → **Site-wide → Contact details** | Real phone, WhatsApp, e-mail, location, announcement, Instagram / Facebook / TikTok links and the footer e-mail (the footer currently holds the original designer's *placeholder* values, e.g. `care@moscowholistic.ae` and a different WhatsApp number) |
| 6 | Admin → **Site-wide → Logo** | Real logo (transparent PNG) |
| 7 | Admin → every page → *Images / Video* | Real clinic photos and the "Why choose us" video |
| 8 | Admin → **Doctors** | Real doctor photos, biographies, WhatsApp links (the seeded WhatsApp buttons point to `971507800163`) |
| 9 | Admin → **Treatments / Services / About / Reviews** | Replace the demo reviews and check every description with the client |
| 10 | Admin → every page → *Page text* | Any wording the client wants changed |
| 11 | `frontend/src/components/ContactStrip`, `pages/ContactUs.jsx`, `sections/Contact/Contact.jsx` | The Google Maps link (`maps.google.com/maps?q=24.4919…`) — change only if the clinic location differs |
| 12 | `frontend/public/favicon.svg` | Clinic favicon, if the client has one |
| 13 | Render → `ENQUIRY_NOTIFY_EMAILS` + SMTP | Only if the client wants an e-mail for each appointment request |
| 14 | After go-live | Create a **new** R2 token and revoke the one that was shared; change any password that was sent in plain text |

## 5. What has and has not been verified

Verified (in the build environment, without running the servers):
- All frontend files compile and every import resolves; no undefined names.
- Rendering of every page and shared component is byte-identical to the original design on first load, except the two appointment forms, which gained an invisible spam-trap field.
- All editable text defaults were checked against what the original code renders.
- Backend Python files compile; the database migrations were checked against the models.

**Not verified** (needs a real run on your machine / the servers): `python manage.py test`, the migrations running, installing the requirements, the Render and Vercel builds, Cloudflare R2 uploads (use `python manage.py check_storage`), and e-mail sending.

## 6. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Login fails with a network error | `VITE_API_BASE_URL` wrong, or the API origin is missing from `DJANGO_CORS_ALLOWED_ORIGINS` (no trailing slash, exact `https://` address) |
| API shows `DisallowedHost` / 400 | the API host is missing from `DJANGO_ALLOWED_HOSTS` |
| Images upload but do not display | `R2_PUBLIC_BASE_URL` wrong, or the bucket is not public |
| `python manage.py check_storage` fails | one of the five `R2_*` values is wrong (see the error text) |
| Contact form says it could not send | API asleep or CORS problem; the form shows a call/WhatsApp message instead of losing the request |
| Many visitors get "request failed" on the form | rate limit (`DJANGO_ENQUIRY_RATE`, default 20 per hour per visitor) |
| Site takes ~50 s on the first visit | free Render instance was asleep — use the UptimeRobot monitor |
