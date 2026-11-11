# Moscow Centre CMS — setup & usage

## 1. How it works

```
Browser ──► React site (Vercel) ──► Django REST API (Render) ──► Neon PostgreSQL (content)
                │                                        └────► Cloudflare R2 (images & videos)
                └── /admin  (staff login, JWT)
```

- Public pages call read-only endpoints such as `/api/doctors/`. Visitors only receive **published** items.
- `/admin` logs in with a Django **staff** account (`/api/auth/token/`) and then creates/edits/deletes content with multipart uploads.
- **First paint is always the original design.** Pages render the content bundled in the frontend immediately (or, on a repeat visit, the last content received from the API) and switch to live CMS content as soon as it arrives. Nothing is blank while loading, and an API outage never empties the site.
- `GET /api/site-status/` tells the site whether a section has *never been set up* (empty database → original content stays) or has records that are all hidden (→ shown empty).
- When a record is deleted, or a photo/video is replaced or removed, the old file is deleted from storage automatically.

## 2. API reference

| Endpoint | Public read | Notes |
|---|---|---|
| `GET /api/home-sections/` | all customised image/video/text slots | `GET /api/home-sections/slots/` lists the slots and the page each belongs to |
| `GET /api/site-texts/` | every edited text (`key`, `value`) | `POST /api/site-texts/bulk/` (staff) saves `{"values": {key: text or null}}`; `null` restores the original wording |
| `GET /api/treatments/` | published | `category`, `show_on_page`, `show_on_home`, relaxation `detail` / `points_list` |
| `GET /api/services/` | published | `kind` = `department` · `highlight` · `condition` |
| `GET /api/doctors/` | published | text fields also parsed into `cards_list`, `stages_list`, `facts_list`, … |
| `GET /api/testimonials/` | published | patient reviews |
| `GET /api/about-content/` · `about-protocols/` · `about-blocks/` | the About page | content row, approach cards, extra sections |
| `POST /api/appointments/` | not readable | public form submissions (rate limited, spam-trap field); staff list/manage them under **Admin → Enquiries** |
| `GET /api/site-status/` | record counts incl. hidden | lets the site tell “never set up” from “all hidden” |
| `POST /api/auth/token/` | — | JWT login (staff only in the CMS) |

Writes (`POST/PATCH/DELETE`) require a staff JWT. Staff requests also receive hidden items.

## 3. Editing guide

Every admin page has tabs. Pick the page you want to change, then the tab:

- **Images / Photos / Logo / Video** — each slot shows the picture or video the website uses now (*Original design*). **Customise** uploads a replacement; **Reset** restores the original and removes your upload.
- **Page text** — every heading, paragraph, button and label on that page, with its current wording. Edit what you want, press **Save changes**. Fields you changed are highlighted; **Reset to original** restores one. Use the search box to find a sentence. In multi-line headings each line is shown on its own row, as in the design.
- **Lists** (Doctors, Treatments, Services, Reviews, approach cards, extra sections) — *Add*, *Edit*, *Hide/Publish*, *Delete*. **Order**: smaller numbers first.
- **Site-wide → Contact details** — change the phone, WhatsApp number, email, location and announcement once; they update the top strip, menu, footer, contact sections and WhatsApp buttons.
- **Doctors** multi-line helpers: cards `Title | Text | icon`, steps `STAGE 01 | Title | Text`, facts `LABEL | Value`; separate biography paragraphs with a blank line.

Video: MP4, WebM or MOV up to 150 MB. Photos up to 10 MB.

## 4. Deployment

The full step-by-step guide, the list of environment variables and the checklist of things to change by hand are in **[DEPLOYMENT.md](DEPLOYMENT.md)**. `render.yaml` (repository root) creates the Render service; `frontend/vercel.json` already routes every path (including `/admin`) to the single-page app.

### Seeding

`python manage.py seed_clinic` loads the original Moscow content and images (doctors, treatments, services, About page, reviews). It skips any section that already has records; `--reset` wipes those sections first. Image slots and edited texts start empty on purpose — the original design shows until something is customised.

### Updating an existing install

After replacing the project files run `python manage.py migrate` (adds reviews and edited texts, removes the unused gallery table), then `python manage.py seed_clinic` once to add the reviews. Existing content is kept.

## 5. Files worth knowing

| Path | Purpose |
|---|---|
| `backend/clinic/models.py` | All content models |
| `backend/clinic/signals.py` | Deletes replaced/removed files from storage |
| `backend/clinic/management/commands/seed_clinic.py` | Original content loader |
| `frontend/src/api.js` | API + JWT helpers |
| `frontend/src/lib/cms.js` | Fetch hooks and API → component mappers |
| `frontend/src/components/T.jsx` | `<T>`: editable text with the original wording as default |
| `frontend/src/lib/textManifest.js` | Generated list of every editable text (used by the admin) |
| `frontend/src/pages/AdminPage.jsx` | The CMS |

## 6. Admin access

- Address: `https://<your-site>/admin` (locally http://localhost:5173/admin).
- There is **no default username or password**. Create the first account yourself, in `backend/`: `python manage.py createsuperuser` (for the live site, run it on your own computer against the production database — see DEPLOYMENT.md, step 5; free Render services have no shell). Choose a strong password.
- More editors: sign in to the Django admin at `https://<render-host>/admin/`, add a user and tick **Staff status**. Only staff accounts can use the CMS.
- Sessions last 30 minutes and refresh automatically for up to 7 days.
