# Content migration report

Goal: every piece of existing website content is stored in the Django backend (PostgreSQL) with media in Cloudflare R2, editable from `/admin`, with the original design unchanged.

`python manage.py seed_clinic` performs the migration. It is safe to run again (existing records are skipped).

## What the seed command stores

| Content | Records | Stored in |
|---|---|---|
| Doctors (all profile fields, photos) | 4 | database + R2 |
| Treatments (Ayurveda 6, relaxation 12, packages 4, homeopathy 3) with images and category | 25 | database + R2 |
| Services (department cards 3, home highlights 6, conditions 6) | 15 | database + R2 |
| About page content, approach cards | 1 + 3 | database + R2 |
| Patient reviews | 3 | database |
| Home / page images and the “Why choose us” video (hero panels, statistics banner, discipline cards, homeopathy and cupping banners, page banners, maps, logo) | 17 slots | database + R2 (copied from `frontend/src/assets`) |
| Every heading, paragraph, button and card text on all six pages, footer, menu text | 254 texts | database |
| SEO title, description and keywords for each page | 18 texts | database |
| Announcement bar, location, Instagram/Facebook/TikTok links, footer e-mail, statistics numbers | 9 | database |

The seeded texts equal the original wording, so the site looks exactly as before until someone edits something (verified by rendering every page with all 281 texts loaded — output identical to the original design).

## Your checklist, item by item

| # | Item | Status |
|---|---|---|
| 1 | Homepage: hero images, section images, video | ✅ in R2 + admin (Home → Images / Video) |
| 1 | Homepage: headings, descriptions, buttons, statistics, banners | ✅ texts in database (Home → Page text) |
| 1 | Featured treatments, services, doctors, testimonials | ✅ database lists |
| 1 | Hero **panel names** (AYURVEDA / HIJAMA / HOMEOPATHY) | ⚠️ fixed in code (part of the design); the panel photos are editable |
| 2 | Doctors: names, photos, qualifications, experience, descriptions, availability | ✅ |
| 3 | Treatments: names, descriptions, images, categories, details, benefits | ✅ |
| 4 | Services: names, descriptions, images, icons, categories | ✅ |
| 5 | About: text, story, mission statement, images, approach cards, extra sections | ✅ (the original design has no separate “vision” text, so none was invented) |
| 6 | Gallery | ➖ not part of the design and not wanted by the client; removed |
| 7 | Phone, WhatsApp, e-mail | ⚠️ **enter in Admin → Site-wide → Contact details.** The original design shows slightly different numbers in different places, so these were deliberately *not* seeded |
| 7 | Address / location line, announcement, social links, footer e-mail | ✅ seeded (note: the footer e-mail and WhatsApp originally held the designer's placeholders — replace with real ones) |
| 7 | Navigation menu labels (Home, About, Service, …) | ⚠️ fixed in code — they are tied to the page addresses |
| 7 | SEO titles and descriptions per page | ✅ database, editable under each page's “Search engines (SEO)” block |

## What was verified, and what was not

Verified without running the servers: all frontend files compile and every import resolves; every page and shared component renders identically to your second zip on first load (except the two appointment forms, which have an invisible spam-trap field); the seeded texts reproduce the original markup; the backend files compile; migrations match the models.

**Not verified (needs a real run):** `python manage.py test`, running the migrations, `seed_clinic` (including the R2 uploads), the Render/Vercel builds, e-mail sending.

## Before launch — verify on the live database

After running `seed_clinic` against production, open Admin and confirm: 4 doctors, 25 treatments, 15 services, 3 reviews, 17 image/video slots, then edit one text and one image and confirm the website changes.
