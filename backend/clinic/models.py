from django.db import models

from .utils import text_lines, text_paragraphs, text_rows, unique_slug
from .validators import validate_image_size, validate_video_file

# ---------------------------------------------------------------------------
# HOME PAGE & SITE IMAGES — replaceable images / videos / text on the original design
# ---------------------------------------------------------------------------

# Every slot maps to one place on the home page. A slot with no database row
# simply shows the original design content, so deleting a row = "reset".
HOME_SLOTS = [
    {
        "key": "hero-ayurveda",
        "label": "Hero panel — Ayurveda",
        "help": "Large panel image at the top of the home page.",
        "group": "home",
        "fields": ["image"],
    },
    {
        "key": "hero-hijama",
        "label": "Hero panel — Hijama",
        "help": "Large panel image at the top of the home page.",
        "group": "home",
        "fields": ["image"],
    },
    {
        "key": "hero-homeopathy",
        "label": "Hero panel — Homeopathy",
        "help": "Large panel image at the top of the home page.",
        "group": "home",
        "fields": ["image"],
    },
    {
        "key": "why-choose-us",
        "label": "Why Choose Us — video",
        "help": "Video beside the 'Why choose us' text. The photo is the cover shown before playing.",
        "group": "home",
        "fields": ["video", "image"],
    },
    {
        "key": "stats-banner",
        "label": "Statistics banner — background",
        "help": "Background photo behind the clinic statistics.",
        "group": "home",
        "fields": ["image"],
    },
    {
        "key": "discipline-ayurveda",
        "label": "Therapeutic discipline — Ayurveda card",
        "help": "First card of the 'Therapeutic Disciplines' row.",
        "group": "home",
        "fields": ["title", "eyebrow", "body", "image"],
    },
    {
        "key": "discipline-homeopathy",
        "label": "Therapeutic discipline — Homeopathy card",
        "help": "Second card of the 'Therapeutic Disciplines' row.",
        "group": "home",
        "fields": ["title", "eyebrow", "body", "image"],
    },
    {
        "key": "discipline-cupping",
        "label": "Therapeutic discipline — Cupping card",
        "help": "Third card of the 'Therapeutic Disciplines' row.",
        "group": "home",
        "fields": ["title", "eyebrow", "body", "image"],
    },
    {
        "key": "homeopathy-care",
        "label": "Homeopathy care banner",
        "help": "Image in the homeopathy care section.",
        "group": "home",
        "fields": ["image"],
    },
    {
        "key": "cupping-hero",
        "label": "Cupping banner",
        "help": "Image in the cupping therapy banner.",
        "group": "home",
        "fields": ["image"],
    },
    {
        "key": "home-contact-map",
        "label": "Home page — contact section map",
        "help": "Map picture in the contact section at the bottom of the home page.",
        "group": "home",
        "fields": ["image"],
    },
    {
        "key": "page-hero-treatments",
        "label": "Treatments page — banner photo",
        "help": "Photo beside the heading at the top of the Treatments page.",
        "group": "treatments",
        "fields": ["image"],
    },
    {
        "key": "treatments-cupping",
        "label": "Treatments page — cupping section photo",
        "help": "Photo in the cupping therapy section of the Treatments page.",
        "group": "treatments",
        "fields": ["image"],
    },
    {
        "key": "page-hero-services",
        "label": "Services page — banner photo",
        "help": "Photo beside the heading at the top of the Services page.",
        "group": "services",
        "fields": ["image"],
    },
    {
        "key": "page-hero-contact",
        "label": "Contact page — banner photo",
        "help": "Photo beside the heading at the top of the Contact page.",
        "group": "contact",
        "fields": ["image"],
    },
    {
        "key": "contact-map",
        "label": "Contact page — map image",
        "help": "Map picture on the Contact page.",
        "group": "contact",
        "fields": ["image"],
    },
    {
        "key": "site-logo",
        "label": "Logo (navbar and footer)",
        "help": "Clinic logo shown in the navigation bar and the footer. A PNG with a transparent background works best.",
        "group": "site",
        "fields": ["image"],
    },
]
HOME_SLOT_KEYS = [slot["key"] for slot in HOME_SLOTS]


class HomeSection(models.Model):
    """One customised slot of the home page (image, video and/or text)."""

    key = models.SlugField(max_length=60, unique=True)
    title = models.CharField(max_length=200, blank=True)
    eyebrow = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="home/", blank=True, null=True, validators=[validate_image_size]
    )
    video = models.FileField(
        upload_to="home/", blank=True, null=True, validators=[validate_video_file]
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]
        verbose_name = "Home page section"
        verbose_name_plural = "Home page sections"

    def __str__(self):
        label = next((s["label"] for s in HOME_SLOTS if s["key"] == self.key), self.key)
        return label


# ---------------------------------------------------------------------------
# TREATMENTS
# ---------------------------------------------------------------------------


class Treatment(models.Model):
    """A treatment card. Shown on the Treatments page and/or the home page."""

    CATEGORY_CHOICES = [
        ("ayurveda", "Ayurveda treatments"),
        ("relaxation", "Relaxation therapies"),
        ("package", "Treatment packages"),
        ("homeopathy", "Homeopathy approach"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="ayurveda")
    tag = models.CharField(max_length=160, blank=True, help_text="Small label above the title.")
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=40, blank=True, help_text="e.g. 45 Mins")
    chips = models.TextField(blank=True, help_text="One short label per line (homeopathy cards).")
    detail = models.TextField(blank=True, help_text="Longer text on the back of a relaxation therapy card.")
    points = models.TextField(blank=True, help_text="One benefit per line (back of a relaxation therapy card).")
    image = models.ImageField(
        upload_to="treatments/", blank=True, null=True, validators=[validate_image_size]
    )
    image_alt = models.CharField(max_length=200, blank=True)

    show_on_page = models.BooleanField(default=True, help_text="Show on the Treatments page.")
    show_on_home = models.BooleanField(default=False, help_text="Show in the home page treatments section.")
    home_title = models.CharField(max_length=200, blank=True, help_text="Optional shorter title for the home page.")
    home_description = models.TextField(blank=True, help_text="Optional shorter text for the home page.")
    home_image = models.ImageField(
        upload_to="treatments/", blank=True, null=True, validators=[validate_image_size]
    )

    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(Treatment, self.title, self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def chips_list(self):
        return text_lines(self.chips)

    def points_list(self):
        return text_lines(self.points)


# ---------------------------------------------------------------------------
# SERVICES
# ---------------------------------------------------------------------------


class Service(models.Model):
    """A service. ``kind`` decides where it appears on the website."""

    KIND_CHOICES = [
        ("department", "Services page — department card"),
        ("highlight", "Home page — 'Our Services' highlights"),
        ("condition", "Home page — conditions we care for"),
    ]

    title = models.CharField(max_length=200)
    kind = models.CharField(max_length=20, choices=KIND_CHOICES, default="department")
    tag = models.CharField(max_length=160, blank=True)
    supervised_by = models.CharField(max_length=300, blank=True)
    short_description = models.TextField(blank=True, help_text="Short line used on the home page cards.")
    description = models.TextField(blank=True)
    conditions = models.TextField(blank=True, help_text="One condition per line (department cards).")
    cta_label = models.CharField(max_length=100, blank=True)
    icon_key = models.CharField(max_length=40, blank=True)
    image = models.ImageField(
        upload_to="services/", blank=True, null=True, validators=[validate_image_size]
    )
    image_alt = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title

    def conditions_list(self):
        return text_lines(self.conditions)


# ---------------------------------------------------------------------------
# DOCTORS
# ---------------------------------------------------------------------------


class Doctor(models.Model):
    """A doctor. Feeds the home page team slider and the full Doctors page."""

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    photo = models.ImageField(
        upload_to="doctors/", blank=True, null=True, validators=[validate_image_size]
    )

    # Home page team card
    role = models.CharField(max_length=120, blank=True, help_text="e.g. Managing Director")
    specialty = models.CharField(max_length=160, blank=True, help_text="e.g. HOMEOPATHIC PRACTITIONER")
    experience = models.CharField(max_length=80, blank=True, help_text="e.g. 17+ Years Experience")
    qualification = models.TextField(blank=True)
    card_description = models.TextField(blank=True)
    availability = models.CharField(max_length=60, blank=True, default="Mon – Sat")

    # Doctors page profile
    photo_label = models.CharField(max_length=120, blank=True)
    tag = models.CharField(max_length=200, blank=True, help_text="Small heading above the name.")
    subtitle = models.CharField(max_length=250, blank=True)
    quote = models.TextField(blank=True)
    quote_by = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True, help_text="Separate paragraphs with a blank line.")
    highlight_title = models.CharField(max_length=200, blank=True)
    highlight_text = models.TextField(blank=True)
    stages_heading = models.CharField(max_length=200, blank=True)
    stages = models.TextField(blank=True, help_text="One per line: STAGE 01 | Title | Text")
    section_heading = models.CharField(max_length=250, blank=True)
    cards = models.TextField(blank=True, help_text="One per line: Title | Text | icon (optional)")
    note = models.CharField(max_length=300, blank=True)
    languages = models.CharField(max_length=200, blank=True, help_text="Comma separated.")
    badge = models.CharField(max_length=160, blank=True)
    facts = models.TextField(blank=True, help_text="One per line: LABEL | Value")
    book_label = models.CharField(max_length=100, blank=True)
    whatsapp_label = models.CharField(max_length=120, blank=True)
    whatsapp_url = models.URLField(blank=True)

    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(Doctor, self.name, self, max_length=170)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def bio_paragraphs(self):
        return text_paragraphs(self.bio)

    def cards_list(self):
        return [{"title": r[0], "text": r[1], "icon": r[2]} for r in text_rows(self.cards, 3)]

    def stages_list(self):
        return [{"no": r[0], "title": r[1], "text": r[2]} for r in text_rows(self.stages, 3)]

    def facts_list(self):
        return [{"label": r[0], "value": r[1]} for r in text_rows(self.facts, 2)]

    def languages_list(self):
        return [item.strip() for item in self.languages.split(",") if item.strip()]


# ---------------------------------------------------------------------------
# ABOUT PAGE
# ---------------------------------------------------------------------------


class AboutContent(models.Model):
    """Singleton: the editable text and images of the About page."""

    hero_pill = models.CharField(max_length=100, default="ABOUT US")
    hero_heading = models.CharField(max_length=200, default="A Holistic Approach to Better Health")
    hero_text = models.TextField(blank=True)
    hero_image = models.ImageField(
        upload_to="about/", blank=True, null=True, validators=[validate_image_size]
    )
    chips = models.TextField(blank=True, help_text="One badge per line under the hero buttons.")

    story_kicker = models.CharField(max_length=100, default="OUR STORY")
    story_heading = models.CharField(max_length=250, blank=True)
    story_body = models.TextField(blank=True, help_text="Separate paragraphs with a blank line.")
    quote = models.TextField(blank=True)
    quote_cite = models.CharField(max_length=160, blank=True)
    story_image = models.ImageField(
        upload_to="about/", blank=True, null=True, validators=[validate_image_size]
    )
    badge_title = models.CharField(max_length=80, blank=True)
    badge_text = models.CharField(max_length=160, blank=True)

    approach_kicker = models.CharField(max_length=120, blank=True)
    approach_heading = models.CharField(max_length=200, blank=True)
    approach_text = models.TextField(blank=True)

    cta_pill = models.CharField(max_length=100, blank=True)
    cta_heading = models.CharField(max_length=250, blank=True)
    cta_text = models.TextField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About page content"
        verbose_name_plural = "About page content"

    def __str__(self):
        return "About page content"

    def chips_list(self):
        return text_lines(self.chips)

    def story_paragraphs(self):
        return text_paragraphs(self.story_body)


class AboutProtocol(models.Model):
    """One of the 'Our approach' cards on the About page."""

    label = models.CharField(max_length=60, blank=True, help_text="e.g. PROTOCOL 01")
    title = models.CharField(max_length=200)
    text = models.TextField(blank=True)
    icon_key = models.CharField(max_length=40, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "About approach card"
        verbose_name_plural = "About approach cards"

    def __str__(self):
        return self.title


class AboutBlock(models.Model):
    """An extra content section (text + optional image) added to the About page."""

    kicker = models.CharField(max_length=120, blank=True)
    heading = models.CharField(max_length=250)
    body = models.TextField(blank=True, help_text="Separate paragraphs with a blank line.")
    image = models.ImageField(
        upload_to="about/", blank=True, null=True, validators=[validate_image_size]
    )
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "About extra section"
        verbose_name_plural = "About extra sections"

    def __str__(self):
        return self.heading

    def body_paragraphs(self):
        return text_paragraphs(self.body)


# ---------------------------------------------------------------------------
# SITE TEXT & REVIEWS
# ---------------------------------------------------------------------------


class SiteText(models.Model):
    """An edited piece of website text.

    Every text on the website ships with its original wording. A row here
    replaces it; deleting the row (the CMS "Reset" button) restores the original.
    """

    key = models.CharField(max_length=190, unique=True)
    value = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["key"]
        verbose_name = "Website text"
        verbose_name_plural = "Website texts"

    def __str__(self):
        return self.key


class Testimonial(models.Model):
    """A patient review shown in the home page testimonials section."""

    name = models.CharField(max_length=150)
    initials = models.CharField(max_length=4, blank=True, help_text="Leave blank to use the name's initials.")
    review = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name

    def get_initials(self):
        if self.initials:
            return self.initials.upper()
        parts = [p for p in self.name.split() if p]
        return "".join(p[0] for p in parts[:2]).upper() or "?"


# ---------------------------------------------------------------------------
# ENQUIRIES (appointment / contact form submissions)
# ---------------------------------------------------------------------------


class AppointmentRequest(models.Model):
    """A submission from the 'Book an appointment' forms (home page and Contact page)."""

    SOURCE_CHOICES = [("home", "Home page form"), ("contact", "Contact page form")]

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=50)
    email = models.EmailField(blank=True)
    department = models.CharField(max_length=150, blank=True)
    preferred_date = models.CharField(max_length=60, blank=True)
    preferred_time = models.CharField(max_length=60, blank=True)
    concern = models.TextField(blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="contact")
    is_handled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Appointment request"
        verbose_name_plural = "Appointment requests"

    def __str__(self):
        return f"{self.full_name} ({self.created_at:%Y-%m-%d})"
