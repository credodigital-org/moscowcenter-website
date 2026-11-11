# Moscow International Holistic Medical Center — Website + CMS

One integrated project (not two websites):

- **`frontend/`** — the original React + Vite design (layout, typography, colours, animations, images and section order unchanged) plus an `/admin` content-management page.
- **`backend/`** — Django + Django REST Framework (`clinic` app) with JWT login, PostgreSQL support and Cloudflare R2 media storage. Same structure as the Genet Dental project.

Everything edited in **/admin** appears on the public website. Hidden (unpublished) content is never sent to visitors.

## The admin is organised page by page

| Admin page | What can be changed there |
|---|---|
| **Enquiries** | Appointment requests from the home page and Contact page forms — call/WhatsApp, mark handled, delete (with an e-mail alert if configured) |
| **Home Page** | Images · Video (“Why choose us”) · every heading/paragraph/button (Page text) · statistics numbers · Our Services · Conditions we care for · Treatments shown on home · Patient reviews |
| **About Page** | Text & photos · approach cards · extra sections · button labels |
| **Services Page** | Banner photo · department cards · every text |
| **Treatments Page** | Banner and cupping photos · all treatments (Ayurveda, relaxation, packages, homeopathy) · every text |
| **Doctors Page** | Doctor profiles (also feed the home team slider) · every text |
| **Contact Page** | Banner photo and map · every text and info card |
| **Site-wide** | Phone, WhatsApp, email, location, announcement bar · logo · menu & footer text |

Every list item can be added, edited, deleted and published/hidden. Images and videos upload straight from the forms. Every text starts with the original wording; **Reset to original** restores it.

## Run it locally

Backend (terminal 1):

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env                                  # macOS/Linux: cp
python manage.py migrate
python manage.py seed_clinic          # loads the original content + images (safe to re-run)
python manage.py createsuperuser      # YOUR admin login — there is no default
python manage.py runserver
```

Frontend (terminal 2):

```bash
cd frontend
copy .env.example .env                # VITE_API_BASE_URL=http://localhost:8000
npm install
npm run dev
```

- Website: http://localhost:5173
- CMS: http://localhost:5173/admin (log in with the account you created)
- Django admin (fallback): http://localhost:8000/admin

Tests: `cd backend && python manage.py test`

The launch order (Render → Vercel → connect → domain → Google) is in **[LAUNCH_STEPS.md](LAUNCH_STEPS.md)**; **[CONTENT_MIGRATION_REPORT.md](CONTENT_MIGRATION_REPORT.md)** lists what is stored where, and **[FINAL_AUDIT_PROMPT.md](FINAL_AUDIT_PROMPT.md)** is a ready prompt for a final automated review.

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for going live (Vercel + Render + Neon + Cloudflare R2) and the checklist of details to change by hand, and **[CMS_SETUP.md](CMS_SETUP.md)** for editing guides and the API.
