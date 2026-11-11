import json
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from ._relaxation_data import RELAXATION_THERAPIES
from clinic.models import (
    AboutBlock,
    AboutContent,
    AboutProtocol,
    Doctor,
    HomeSection,
    Service,
    SiteText,
    Testimonial,
    Treatment,
)

SEED_MEDIA = Path(__file__).resolve().parent.parent.parent / "seed_media"
SEED_DATA = Path(__file__).resolve().parent.parent.parent / "seed_data"
# The original website images/videos live in the frontend; the seed copies them into
# storage (Cloudflare R2 in production) so nothing depends on files bundled in the React build.
FRONTEND_ASSETS = Path(__file__).resolve().parents[4] / "frontend" / "src" / "assets"

CLINIC_WHATSAPP = "https://wa.me/971507800163"


def attach(instance, field, relative_path):
    """Store a seed image/video on ``instance.<field>`` (no save)."""
    path = SEED_MEDIA / relative_path
    if not path.exists():
        return
    with open(path, "rb") as handle:
        getattr(instance, field).save(path.name, File(handle), save=False)


# --------------------------------------------------------------------------
# Content — copied from the original Moscow website design
# --------------------------------------------------------------------------

DOCTORS = [
    {
        "name": "Dr. Ehab Makki",
        "photo": "doctors/dr-ehab-makki.jpg",
        "role": "Managing Director",
        "specialty": "HOMEOPATHIC PRACTITIONER",
        "experience": "17+ Years Experience",
        "qualification": "MD, PG (Homeopath) UK",
        "card_description": "Diplomate of the American Academy of Aesthetic Medicine (AAAM)",
        "availability": "Mon – Sat",
        "photo_label": "Managing Director & Senior Physician",
        "tag": "CLINICAL FACULTY DOSSIER • HOMEOPATHY",
        "subtitle": "MD, PG (Homeopathy) UK • Managing Director",
        "quote": "Understanding the Root Cause... Supporting the Body’s Healing Journey.",
        "bio": (
            "Dr. Ehab Makki serves as Managing Director and Senior Homeopathy Practitioner at Moscow International Holistic Medical Center. He graduated from N.H. Medical College, Maharashtra University of Health Sciences, and completed comprehensive Post-Graduation in Homeopathy from Allen College of Homoeopathy, UK. He also holds a prestigious Diplomate credential from the American Academy of Aesthetic Medicine (AAAM).\n\n"
            "With more than 17 continuous years treating complex systemic and chronic illnesses in the United Arab Emirates, Dr. Makki champions an individualized, cellular-level therapeutic philosophy that looks beyond mere symptom management."
        ),
        "highlight_title": "Cellular & Physiological Healing Model",
        "highlight_text": "Dr. Makki focuses on deciphering subtle internal bio-mechanisms, chronic neuro-endocrine exhaustion, suppressed emotional trauma, and systemic cellular stress to curate bio-resonant homeopathic remedies that restore natural homeostasis without toxic load.",
        "section_heading": "When Stress Affects the Body: Mind, Cells & Physical Balance",
        "cards": (
            "Stress & Mental Well-Being | Chronic anxiety states, nervous exhaustion, panic disorders, emotional shock, and psychosomatic symptoms. | brain\n"
            "Weight & Metabolism | Stress-induced obesity, metabolic dysregulation, Type 2 diabetes adjunct care, dyslipidemia, and arterial fatigue. | scale\n"
            "Hormonal & Endocrine Balance | Natural fertility optimization, Polycystic Ovarian Syndrome (PCOS), thyroid disorders, and menstrual irregularities. | activity\n"
            "Stress & Gastrointestinal Health | Irritable Bowel Syndrome (IBS), chronic GERD, ulcerative colitis adjuncts, and gut-microbiome axis revitalization. | apple"
        ),
        "note": "Regular International Speaker & Health Educator across Europe and the GCC.",
        "facts": "LICENSURE | DOH Abu Dhabi\nEXPERIENCE | 17+ Years in UAE\nLANGUAGES | Arabic, English\nEDUCATION | Allen College, UK",
        "book_label": "Book with Dr. Ehab",
        "whatsapp_label": "Direct WhatsApp Inquiry",
        "whatsapp_url": CLINIC_WHATSAPP,
    },
    {
        "name": "Dr. Monika Tyagi",
        "photo": "doctors/dr-monika-tyagi.jpg",
        "role": "Senior Consultant",
        "specialty": "HOMEOPATHY PRACTITIONER",
        "experience": "15+ Years Experience",
        "qualification": "Bachelor of Homeopathic Medicine & Surgery (BHMS), with postgraduate diplomas in Clinical Research (PGDCR) and Health Promotion (PGDHP)",
        "card_description": "",
        "availability": "Mon – Sat",
        "photo_label": "Pediatric & Family Specialist",
        "tag": "CLINICAL FACULTY DOSSIER • PEDIATRIC & FAMILY CARE",
        "subtitle": "BHMS, PGDCR, PGDHP • DOH-Licensed Homeopathy Practitioner",
        "quote": "True health isn’t just the absence of illness—it’s the perfect harmony of body, mind, and soul.",
        "bio": (
            "Bringing 15+ years of distinguished clinical experience across premier institutions in India and the United Arab Emirates, Dr. Monika Tyagi provides an unhurried, deeply empathetic space for families and individuals. She is renowned for gentle constitutional homeopathy that nurtures long-term pediatric resilience and natural female hormonal balance.\n\n"
            "Dr. Tyagi holds BHMS, Post Graduate Diplomas in Clinical Research (PGDCR) post graduate diploma in Health Promotion, and is fully certified and DataFlow verified by the Department of Health (DOH) Abu Dhabi. Consultations are delivered with native fluency in English, Hindi, and Urdu."
        ),
        "stages_heading": "The 3-Step Gentle Healing Protocol",
        "stages": (
            "STAGE 01 | In-Depth Case Analysis | A 60-minute intake analyzing hereditary patterns, lifestyle stressors, and emotional triggers.\n"
            "STAGE 02 | Constitutional Prescription | Precise, ultra-dilute German and British pharmacopoeial homeopathic remedies selected for systemic harmony.\n"
            "STAGE 03 | Long-Term Partnership | Structured follow-ups, pediatric milestone tracking, and seasonal immune modulation."
        ),
        "section_heading": "Comprehensive Conditions Treated",
        "cards": (
            "Pediatric & Children’s Health | Recurrent tonsillitis, adenoids, childhood asthma, ADHD support, bedtime enuresis, low immunity. | baby\n"
            "Women’s Health & Gynecology | PCOD/PCOS, dysmenorrhea, fibroid support, perimenopausal mood swings, chronic migraines. | heart-pulse\n"
            "Dermatology & Skin Restorative | Chronic eczema, stubborn psoriasis, urticaria hives, cystic acne, recalcitrant warts, alopecia areata. | sparkles\n"
            "Allergies & Respiratory | Chronic allergic rhinitis, dust and pollen sensitivity, persistent sinusitis, nasal polyps. | wind\n"
            "Digestive & Metabolism | Severe hyperacidity, peptic ulcers, habitual constipation, irritable colon, hepatic sluggishness. | apple\n"
            "Renal & Urinary Care | Non-invasive homeopathic support for recurring renal calculi (kidney stones) and recurrent UTIs. | droplet"
        ),
        "facts": "LICENSURE | DOH Verified\nPRACTICE | 15+ Years Experience\nLANGUAGES | EN, HI, UR\nCLINIC LINES | +971 026310746",
        "book_label": "Book with Dr. Monika",
        "whatsapp_label": "WhatsApp +971 50 780 0163",
        "whatsapp_url": "https://wa.me/+971507800163",
    },
    {
        "name": "Dr. Ashna Muhammad",
        "photo": "doctors/dr-ashna-muhammad.jpg",
        "role": "Senior Consultant",
        "specialty": "AYURVEDA PRACTITIONER",
        "experience": "5+ Years Experience",
        "qualification": "",
        "card_description": "Joint & Musculoskeletal Care, Digestive Health, Women’s Wellness, Panchakarma Therapies",
        "availability": "Mon – Sat",
        "photo_label": "Classical Ayurveda & Panchakarma",
        "tag": "CLINICAL FACULTY DOSSIER • AYURVEDA & NATURAL THERAPIES",
        "subtitle": "BAMS, CPC • DOH-Licensed Ayurvedic Practitioner",
        "quote": "When diet and natural rhythms are honored, medicine becomes whole; when disease is understood through doshic balance, true vitality awakens.",
        "bio": (
            "Dr. Ashna Muhammad is an accomplished Ayurvedic Physician trained in the revered classical traditions of Kerala, India. Holding a Bachelor of Ayurvedic Medicine and Surgery (BAMS) alongside Certified Professional Coder (CPC), she brings rich multi-jurisdictional clinical expertise spanning authentic Indian wellness centers and leading healthcare settings across the UAE.\n\n"
            "Her clinical methodology seamlessly integrates traditional Nadi Pariksha (pulse diagnosis) with evidence-backed dietary therapy, herbal bio-compounds, and therapeutic physical purifications tailored precisely to each patient’s metabolic and constitutional type (Prakriti & Vikriti)."
        ),
        "cards": (
            "Nadi & Prakriti Assessment | Precise evaluation of Vata, Pitta, and Kapha bio-energetic imbalances, metabolic digestive fire (Agni), and accumulated cellular toxins (Ama). | stethoscope\n"
            "Classical Panchakarma Protocols | Full supervision of restorative therapies: Abhyanga herbal oil infusions, Shirodhara mental deceleration, Kizhi herbal pouch fomentation, and Kati Basti. | waves\n"
            "Spine, Joint & Chronic Pain | Targeted natural protocols for cervical spondylosis, lumbar disc issues, osteoarthritic joint stiffness, and sciatica with therapeutic oils. | bone\n"
            "Personalized Herbal Formularies | Custom botanical decoctions, fermented Arishtams, and Rasayanas sourced strictly from certified organic pharmacopoeial producers. | leaf"
        ),
        "languages": "English, Malayalam, Hindi",
        "badge": "DOH Registered Clinical Facility",
        "facts": "LICENSURE | DOH Abu Dhabi\nCREDENTIAL | BAMS, CPC\nLANGUAGES | EN, ML, HI\nTRADITION | Kerala Chikitsa",
        "book_label": "Book with Dr. Ashna",
        "whatsapp_label": "Direct WhatsApp Inquiry",
        "whatsapp_url": CLINIC_WHATSAPP,
    },
    {
        "name": "Dr. Obaidullah",
        "photo": "doctors/dr-obaidullah.png",
        "role": "Senior Consultant",
        "specialty": "HIJAMA PRACTITIONER",
        "experience": "18+ Years Experience",
        "qualification": "",
        "card_description": "Pain & Musculoskeletal care, Metabolic & Stress Relief, Clinical Hijama Therapy",
        "availability": "Tue – Sun",
        "photo_label": "Hijama Specialist",
        "tag": "CLINICAL FACULTY DOSSIER • HIJAMA",
        "subtitle": "HIJAMA (CUPPING THERAPY) • 18+ YEARS UAE PRACTICE",
        "quote": "Healing is a journey of restoring balance — Hijama and Homeopathy work together to help the body heal itself naturally.",
        "quote_by": "— DR. OBAIDULLAH",
        "bio": (
            "Dr. Obaidullah brings 18 years of dedicated practice in the UAE as both a Hijama Cupping Therapy specialist and a Homeopathic Medicine Practitioner. Having treated millions of cases, his expertise spans a wide spectrum of physical and mental health conditions. Dr. Obaidullah’s approach integrates the ancient art of Hijama with constitutional Homeopathy to deliver targeted, natural, and lasting relief for chronic conditions."
        ),
        "cards": (
            "Pain & Musculoskeletal Care | Targeted relief for chronic joint inflammation, lumbar/cervical disc discomfort, and migraines. | activity\n"
            "Metabolic & Stress Relief | Restorative therapeutic protocols for mental fatigue, sleep disorders, and digestive health. | brain\n"
            "Constitutional Homeopathy | Individualized classical remedies addressing chronic systemic imbalances at the root level. | flower-2\n"
            "Clinical Hijama Therapy | Advanced sterile cupping protocols for deep myofascial release, systemic circulation, and detoxification. | circle-dot"
        ),
        "languages": "English, Arabic, Urdu",
        "badge": "DOH Licensed Outpatient Care",
        "facts": "RATING | ★ 5.0 Rated\nTHERAPIES | Hijama\nEXPERIENCE | 18+ Years in UAE\nLICENSURE | DOH Abu Dhabi",
        "book_label": "Book with Dr. Obaidullah",
        "whatsapp_label": "Direct WhatsApp Inquiry",
        "whatsapp_url": CLINIC_WHATSAPP,
    },
]

# (title, category, tag, subtitle, description, duration, chips, image, image_alt,
#  show_on_page, show_on_home, home_title, home_description, home_image)
TREATMENTS = [
    # --- Ayurveda treatments (Treatments page) ---
    ("Madero Therapy", "ayurveda", "WOOD THERAPY • BODY CONTOURING", "Natural Wood Body Contouring & Lymphatic Drainage",
     "A natural body massage technique using specially designed wooden tools to provide a firm, rhythmic massage that supports circulation, reduces cellulite, provides body contouring, skin toning, deep relaxation, and improves lymphatic drainage.",
     "45 Mins", "", "treatments/madero-therapy.png"),
    ("Herbal Facials", "ayurveda", "MUKHA LEPAM • BOTANICAL RADIANCE", "Ayurvedic Botanical Skin Rejuvenation",
     "Personalized herbal and Ayurvedic facial treatments using carefully selected natural ingredients to cleanse, nourish, refresh, and enhance the natural appearance of the skin with custom medicinal oils.",
     "50 Mins", "", "treatments/herbal-facial1.jpeg"),
    ("Herbal Hair Pack", "ayurveda", "SHIRO LEPAM • FOLLICULAR HEALTH", "Scalp Care & Follicle Nourishment Ritual",
     "A deeply nourishing herbal hair treatment using selected Ayurvedic ingredients like amla, bhringaraj, and aloe vera to support scalp circulation, hair vitality, and healthy-looking, well-conditioned hair.",
     "40 Mins", "", "treatments/herbal-hair-pack.png"),
    ("Organic Aroma Therapy", "ayurveda", "SENSORY EQUILIBRIUM • NEURO-CALM", "Therapeutic Sensory Stress Relief & Sleep Restoration",
     "Ease stress, anxiety, and mental fatigue while boosting deep feelings of relaxation. Improves restful sleep and helps support restorative overall quality of life using certified organic botanical essences.",
     "60 Mins", "", "treatments/organic-aroma.png"),
    ("Ayurvedic Body Scrub", "ayurveda", "UDVARTHANAM • MEDICATED HERBAL POLISH", "Traditional Exfoliating Herbal Powder Therapy",
     "A therapeutic Ayurvedic scrub using traditional Ayurvedic powders and natural botanicals to gently exfoliate and refresh the skin. Stimulates lymphatic circulation and helps release deep tension.",
     "40 Mins", "", "treatments/body-scrub.png"),
    ("Nasyam Therapy", "ayurveda", "PANCHAKARMA SHODHANA • CRANIAL CARE", "Classical Panchakarma Nasal Therapy",
     "A traditional Ayurvedic nasal therapy where carefully selected medicated oils or herbal extracts are administered through the nasal passages to support sinus relief, headache, migraine, and respiratory wellness.",
     "30 - 45 Mins", "", "treatments/nasyam.png"),
]

# Home page cards reuse four relaxation therapies with their own short text/photo.
HOME_CARDS = {
    "Abhyangam + Steam": ("Abhyangam + Steam Bath", "Deeply relaxes muscles, improves circulation and detoxifies the body with medicated oils.", "home/abhyangam.png"),
    "Abhyangam + Potli Kizhi": ("Abhyangam + Kizhi", "Relieves pain, reduces musculoskeletal stiffness and enhances mobility and joint flexibility.", "home/kizhi.png"),
    "Shiro Vasti": ("Shiro Vasthi", "A continuous stream of warm herbal oil to support relaxation and mental well-being.", "home/shirovasthi.png"),
    "Glow Therapy + Polishing": ("Glow Therapy + Polishing", "Refresh skin, remove sun tan, and restore radiant natural vitality and dermal balance.", "home/glow-therapy.png"),
}

PACKAGES = [
    ("Obesity Management", "Individualised weight-management support.", "treatments/package-obesity.png"),
    ("Postnatal Care", "Personalised care after childbirth.", "treatments/package-postnatal.png"),
    ("Neck Pain Care", "Traditional therapies selected after assessment.", "treatments/package-neck.png"),
    ("Back Pain Care", "Individualised support for back discomfort.", "treatments/package-back.png"),
]

HOMEOPATHY = [
    ("1) Comprehensive Physical Assessment and Diagnosis", "BIOLOGICAL & DIAGNOSTIC",
     "We begin by understanding the physical and biological aspects of the condition through accurate medical evaluation, including laboratory investigations, imaging studies, and appropriate diagnostic methods. This helps us identify the nature of the health condition and understand the possible underlying organic factors contributing to it.",
     "Lab Investigations\nImaging Studies\nOrganic Factors", "treatments/homeo-assessment.png"),
    ("2) Psychological and Emotional Factors", "PSYCHOSOMATIC HARMONY",
     "In homeopathy, we explore the deeper aspects that may influence a person’s health. We consider the impact of emotional and psychological states, daily stress, and accumulated emotions such as sadness, anxiety, and frustration. These factors may influence the body’s balance and overall well-being. The mind and body are deeply connected, and emotional experiences play an important role in an individual’s health journey.",
     "Stress & Tension\nEmotional Balance\nMind-Body Connection", "treatments/homeo-emotional.png"),
    ("3) Lifestyle and Daily Habits", "NUTRITION & DAILY RHYTHMS",
     "We also focus on lifestyle factors, nutritional habits, and daily behaviors, as they represent an essential part of the complete health picture. Nutrition, quality of sleep, physical activity, stress management, and everyday habits may all contribute to maintaining health or influencing the development and progression of health conditions.",
     "Nutritional Habits\nSleep Quality\nDaily Behaviors", "treatments/homeo-lifestyle.png"),
]

DEPARTMENTS = [
    ("Classical Homeopathy", "CONSTITUTIONAL MEDICINE",
     "Supervised by Dr. Ehab Makki (MD, PG Hom UK) & Dr. Monika Tyagi (BHMS,PGDCR,PGDHP)",
     "Homeopathic medicine is personalized medicine. It is an approach to healthcare that tailors disease prevention, diagnosis, and treatment to each individual by considering their unique genetic, biological, medical, nutritional, and lifestyle characteristics and prescribing the medicine accordingly.",
     "Chronic Respiratory & Allergic Rhinitis\nStress, Sleep Disturbances & Anxiety\nHormonal Imbalances & Chronic Migraines\nPediatric Immunity & Eczematous Skin Conditions",
     "Book Homeopathy Desk", "services/service-homeopathy.png", "Homeopathy consultation with a digital DNA illustration"),
    ("Authentic Kerala Ayurveda", "VEDIC TRADITION & PANCHAKARMA",
     "Supervised by Dr. Ashna Muhammad (BAMS, CPC)",
     "Ancient Sanskrit medical wisdom combining diagnostic Nadi Pariksha (pulse analysis), traditional botanical formulations, and external detoxifying therapies including Abhyangam and Kizhi.",
     "Joint Degeneration & Musculoskeletal Pain\nDigestive Dysbiosis & Metabolic Sluggishness\nSystemic Panchakarma Detox & Rejuvenation\nDeep Nervous Exhaustion & Vata Disorders",
     "Book Ayurvedic Therapies", "services/service-ayurveda.png", "Shirodhara treatment with a copper vessel"),
    ("Medicinal Cupping (Hijama)", "CIRCULATORY & PAIN RELIEF",
     "Licensed Clinical Practitioners • Single-Use Sterile Sets",
     "Targeted therapeutic suction promoting local micro-circulation, loosening myofascial trigger points, clearing metabolic stasis, and accelerating deep tissue physiological regeneration.",
     "Chronic Spinal, Neck & Lumbar Tension\nAthletic Muscular Soreness & Sciatica\nMigraines & Cervicogenic Headaches\nSystemic Fatigue & Lymphatic Stagnation",
     "Book Cupping Therapies", "services/service-cupping.png", "Medicinal cupping therapy using sterile single-use sets"),
]

HIGHLIGHTS = [
    ("Authentic Ayurvedic Treatments", "For holistic healing", "flask-conical"),
    ("Digestive Health", "Improve gut health naturally", "apple"),
    ("Pain & Stress Relief", "Restore balance and wellbeing", "meditation"),
    ("Weight Management", "Support your natural balance", "person-standing"),
    ("Skin & Hair Care", "Natural care for healthy skin and hair", "smile"),
    ("Personalized Treatment Plan", "Based on your unique needs and condition", "sprout"),
]

CONDITIONS = [
    ("Stress-Related Metabolic and Weight Disorders", "Natural support for stress, weight, and metabolism.", "heart-pulse"),
    ("Allergies and Immunology", "Natural support for allergies and immune system health.", "shield-plus"),
    ("Stress-Related Gastrointestinal Disorders", "Natural support for stress-related digestive issues.", "accessibility"),
    ("Renal care", "Safe and gentle support for kidney health.", "activity"),
    ("Women’s Health and Emotional Well-Being", "Supporting women’s health and emotional balance.", "person-standing"),
    ("Dermatological Care", "Natural care to support healthy skin and overall skin wellness.", "circle-user-round"),
]

PROTOCOLS = [
    ("PROTOCOL 01", "Personalised Consultations",
     "Detailed 45–60 minute comprehensive consultations exploring medical history, stress patterns, circadian sleep rhythms, and individual bodily constitution.",
     "clipboard-list"),
    ("PROTOCOL 02", "Understanding Individual Needs",
     "Root-cause diagnostic assessment mapping metabolic balance, toxic accumulation (Ama), and constitutional temperament to eradicate deep cellular disharmony.",
     "activity"),
    ("PROTOCOL 03", "Appropriate Treatment Options",
     "Integrative care protocols blending Classical Ayurveda, Clinical Homeopathy, and Medical Cupping (Hijama) strictly aligned with individual therapeutic safety.",
     "briefcase-medical"),
]


TESTIMONIALS = [
    ("Abhishek Banerjee", "AB",
     "The Moscow International Holistic Medical Hospital is an incredible place for treatment. I went there for an Ayurvedic treatment and the doctors has been treated me so amazingly. Highly recommend to everyone Well done team Keep it up the fabulous job."),
    ("Ahmed Al Suwaidi", "AA",
     "One of the most impeccably clean and organised Holistic medical centres in Abu Dhabi. The calm, peaceful atmosphere instantly relaxes you the moment you step through the doors."),
    ("Priya Nambiar", "PN",
     "Excellent service from start to finish. The therapeutic treatments were deeply caring and relaxing, and the entire staff was exceptionally friendly, respectful, and attentive."),
]


class Command(BaseCommand):
    help = (
        "Populates the database with the original Moscow Centre content and "
        "images so the website and CMS aren't empty. Safe to re-run: a "
        "section that already has records is skipped unless --reset is given."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete the existing content of every section first, then re-seed it.",
        )

    def handle(self, *args, **options):
        reset = options["reset"]
        self.stdout.write("Seeding Moscow Centre content...")

        if reset:
            for model in (Doctor, Treatment, Service, AboutProtocol, AboutBlock, AboutContent, Testimonial, HomeSection, SiteText):
                for obj in model.objects.all():
                    obj.delete()

        self.seed_doctors()
        self.seed_treatments()
        self.seed_services()
        self.seed_about()
        self.seed_testimonials()
        self.seed_home_slots()
        self.seed_site_texts()
        self.stdout.write(self.style.SUCCESS("Done. All original website content is now stored in the database (and media in storage)."))

    # ------------------------------------------------------------------
    def seed_doctors(self):
        if Doctor.objects.exists():
            self.stdout.write("  doctors: already present, skipped")
            return
        for index, data in enumerate(DOCTORS):
            data = dict(data)
            photo = data.pop("photo")
            doctor = Doctor(order=index, **data)
            attach(doctor, "photo", photo)
            doctor.save()
        self.stdout.write(f"  doctors: {len(DOCTORS)} created")

    def seed_treatments(self):
        if Treatment.objects.exists():
            self.stdout.write("  treatments: already present, skipped")
            return
        order = 0

        def make(**fields):
            nonlocal order
            image = fields.pop("image", None)
            home_image = fields.pop("home_image", None)
            obj = Treatment(order=order, **fields)
            if image:
                attach(obj, "image", image)
            if home_image:
                attach(obj, "home_image", home_image)
            obj.image_alt = obj.image_alt or obj.title
            obj.save()
            order += 1

        for title, category, tag, subtitle, description, duration, chips, image in TREATMENTS:
            make(title=title, category=category, tag=tag, subtitle=subtitle,
                 description=description, duration=duration, chips=chips, image=image)

        for item in RELAXATION_THERAPIES:
            extra = {}
            home = HOME_CARDS.get(item["title"])
            if home:
                extra = {"show_on_home": True, "home_title": home[0],
                         "home_description": home[1], "home_image": home[2]}
            make(title=item["title"], category="relaxation", description=item["text"],
                 detail=item["detail"], points="\n".join(item["points"]),
                 image=f"treatments/{item['img']}.png", **extra)

        for title, description, image in PACKAGES:
            make(title=title, category="package", description=description, image=image)

        for title, tag, description, chips, image in HOMEOPATHY:
            make(title=title, category="homeopathy", tag=tag, description=description, chips=chips, image=image)

        self.stdout.write(f"  treatments: {order} created")

    def seed_services(self):
        if Service.objects.exists():
            self.stdout.write("  services: already present, skipped")
            return
        order = 0
        for title, tag, by, description, conditions, cta, image, alt in DEPARTMENTS:
            service = Service(title=title, kind="department", tag=tag, supervised_by=by,
                              description=description, conditions=conditions, cta_label=cta,
                              image_alt=alt, order=order)
            attach(service, "image", image)
            service.save()
            order += 1
        for title, text, icon in HIGHLIGHTS:
            Service.objects.create(title=title, kind="highlight", short_description=text, icon_key=icon, order=order)
            order += 1
        for title, text, icon in CONDITIONS:
            Service.objects.create(title=title, kind="condition", short_description=text, icon_key=icon, order=order)
            order += 1
        self.stdout.write(f"  services: {order} created")

    def seed_about(self):
        about = AboutContent.objects.first()
        if about is None:
            about = AboutContent()
            about.hero_text = (
                "Discover personalised holistic care through Homeopathy, Ayurveda, and\n"
                "Cupping Therapy. Licensed by the Ministry of Health, uniting ancient wisdom\n"
                "and modern clinical precision."
            )
            about.chips = "Ministry of Health Licensed\n15+ Years Clinical Care\nAbu Dhabi, UAE"
            about.story_heading = "Blending Timeless Wisdom with\nModern Science"
            about.story_body = (
                "At Moscow International Holistic Medical Center (MIHMC), we believe that true healthcare goes beyond temporary symptom suppression. By studying the body’s natural metabolic balance, we construct treatment plans that stimulate authentic structural recovery.\n\n"
                "Over the past 15 years, our clinic has grown into a world-class destination for patients seeking natural solutions for chronic joint pain, metabolic conditions, hair fall, hormonal imbalances, and detox. Our clinic is licensed by the Ministry of Health, ensuring every practitioner, herb, and procedure meets strict medical guidelines."
            )
            about.quote = (
                "Our mission is to empower individuals to live healthier, balanced, and vibrant lives "
                "by restoring their body’s innate self-healing capabilities."
            )
            about.quote_cite = "MIHMC CLINICAL LEADERSHIP COUNCIL"
            about.badge_title = "15+ Years"
            about.badge_text = "Of Healing Excellence in Abu Dhabi"
            about.approach_kicker = "OUR APPROACH TO HOLISTIC CARE"
            about.approach_heading = "Care That Considers the Whole You"
            about.approach_text = (
                "A patient-centred methodology viewing vitality as a harmony between physical health, mental\n"
                "calm, and biological rhythm."
            )
            about.cta_pill = "CONSULTATIONS"
            about.cta_heading = "Begin Your Journey to\nRestorative Health"
            about.cta_text = (
                "Speak with our clinical team or schedule your one-on-one consultation today in\n"
                "Abu Dhabi. Experience authentic healing supervised by licensed physicians."
            )
            attach(about, "hero_image", "about/about-clinic2.jpg")
            attach(about, "story_image", "about/about-consultation.jpeg")
            about.save()
            self.stdout.write("  about page: created")
        else:
            self.stdout.write("  about page: already present, skipped")

        if not AboutProtocol.objects.exists():
            for index, (label, title, text, icon) in enumerate(PROTOCOLS):
                AboutProtocol.objects.create(label=label, title=title, text=text, icon_key=icon, order=index)
            self.stdout.write(f"  about approach cards: {len(PROTOCOLS)} created")

    def seed_testimonials(self):
        if Testimonial.objects.exists():
            self.stdout.write("  testimonials: already present, skipped")
            return
        for index, (name, initials, review) in enumerate(TESTIMONIALS):
            Testimonial.objects.create(name=name, initials=initials, review=review, order=index)
        self.stdout.write(f"  testimonials: {len(TESTIMONIALS)} created")

    def seed_home_slots(self):
        """Store the original home/page images and the video in storage + the database."""
        if not FRONTEND_ASSETS.exists():
            self.stdout.write(self.style.WARNING(
                f"  image slots: skipped — {FRONTEND_ASSETS} not found (run this command from the full project checkout)"))
            return
        created = skipped = 0
        for slot in json.loads((SEED_DATA / "home_slots.json").read_text(encoding="utf-8")):
            if HomeSection.objects.filter(key=slot["key"]).exists():
                skipped += 1
                continue
            row = HomeSection(
                key=slot["key"],
                title=slot.get("title", ""),
                eyebrow=slot.get("eyebrow", ""),
                body=slot.get("body", ""),
            )
            for field, rel in (("image", slot.get("file")), ("video", slot.get("video"))):
                if not rel:
                    continue
                path = FRONTEND_ASSETS / rel
                if path.exists():
                    with open(path, "rb") as handle:
                        getattr(row, field).save(path.name, File(handle), save=False)
                else:
                    self.stdout.write(self.style.WARNING(f"    missing file: {path}"))
            row.save()
            created += 1
        self.stdout.write(f"  image/video slots: {created} created, {skipped} already present")

    def seed_site_texts(self):
        """Store every website text, the SEO titles/descriptions and the safe site settings."""
        data = json.loads((SEED_DATA / "site_texts.json").read_text(encoding="utf-8"))
        created = 0
        for key, value in data.items():
            _, was_created = SiteText.objects.get_or_create(key=key, defaults={"value": value})
            created += int(was_created)
        self.stdout.write(f"  website texts: {created} created, {len(data) - created} already present")
