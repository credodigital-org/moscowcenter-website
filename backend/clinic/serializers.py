from rest_framework import serializers

from .models import (
    HOME_SLOT_KEYS,
    HOME_SLOTS,
    AboutBlock,
    AboutContent,
    AboutProtocol,
    AppointmentRequest,
    Doctor,
    HomeSection,
    Service,
    SiteText,
    Testimonial,
    Treatment,
)


class HomeSectionSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = HomeSection
        fields = ["id", "key", "label", "title", "eyebrow", "body", "image", "video", "updated_at"]
        read_only_fields = ["id", "updated_at"]

    def get_label(self, obj):
        return next((s["label"] for s in HOME_SLOTS if s["key"] == obj.key), obj.key)

    def validate_key(self, value):
        if value not in HOME_SLOT_KEYS:
            raise serializers.ValidationError("Unknown home page slot.")
        return value


class TreatmentSerializer(serializers.ModelSerializer):
    chips_list = serializers.SerializerMethodField()
    points_list = serializers.SerializerMethodField()

    class Meta:
        model = Treatment
        fields = [
            "id", "title", "slug", "category", "tag", "subtitle", "description",
            "duration", "chips", "chips_list", "detail", "points", "points_list", "image", "image_alt",
            "show_on_page", "show_on_home", "home_title", "home_description",
            "home_image", "order", "is_published",
        ]
        extra_kwargs = {"slug": {"required": False}}

    def get_chips_list(self, obj):
        return obj.chips_list()

    def get_points_list(self, obj):
        return obj.points_list()


class ServiceSerializer(serializers.ModelSerializer):
    conditions_list = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "id", "title", "kind", "tag", "supervised_by", "short_description",
            "description", "conditions", "conditions_list", "cta_label",
            "icon_key", "image", "image_alt", "order", "is_published",
        ]

    def get_conditions_list(self, obj):
        return obj.conditions_list()


class DoctorSerializer(serializers.ModelSerializer):
    bio_paragraphs = serializers.SerializerMethodField()
    cards_list = serializers.SerializerMethodField()
    stages_list = serializers.SerializerMethodField()
    facts_list = serializers.SerializerMethodField()
    languages_list = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            "id", "name", "slug", "photo", "role", "specialty", "experience",
            "qualification", "card_description", "availability", "photo_label",
            "tag", "subtitle", "quote", "quote_by", "bio", "bio_paragraphs",
            "highlight_title", "highlight_text", "stages_heading", "stages",
            "stages_list", "section_heading", "cards", "cards_list", "note",
            "languages", "languages_list", "badge", "facts", "facts_list",
            "book_label", "whatsapp_label", "whatsapp_url", "order", "is_published",
        ]
        extra_kwargs = {"slug": {"required": False}}

    def get_bio_paragraphs(self, obj):
        return obj.bio_paragraphs()

    def get_cards_list(self, obj):
        return obj.cards_list()

    def get_stages_list(self, obj):
        return obj.stages_list()

    def get_facts_list(self, obj):
        return obj.facts_list()

    def get_languages_list(self, obj):
        return obj.languages_list()


class AboutContentSerializer(serializers.ModelSerializer):
    chips_list = serializers.SerializerMethodField()
    story_paragraphs = serializers.SerializerMethodField()

    class Meta:
        model = AboutContent
        fields = "__all__"

    def get_chips_list(self, obj):
        return obj.chips_list()

    def get_story_paragraphs(self, obj):
        return obj.story_paragraphs()


class AboutProtocolSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutProtocol
        fields = ["id", "label", "title", "text", "icon_key", "order", "is_published"]


class AboutBlockSerializer(serializers.ModelSerializer):
    body_paragraphs = serializers.SerializerMethodField()

    class Meta:
        model = AboutBlock
        fields = ["id", "kicker", "heading", "body", "body_paragraphs", "image", "order", "is_published"]

    def get_body_paragraphs(self, obj):
        return obj.body_paragraphs()


class SiteTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteText
        fields = ["key", "value"]


class TestimonialSerializer(serializers.ModelSerializer):
    initials_display = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ["id", "name", "initials", "initials_display", "review", "order", "is_published"]

    def get_initials_display(self, obj):
        return obj.get_initials()


class AppointmentRequestSerializer(serializers.ModelSerializer):
    """Staff view of an enquiry (the CMS inbox)."""

    class Meta:
        model = AppointmentRequest
        fields = [
            "id", "full_name", "phone", "email", "department", "preferred_date",
            "preferred_time", "concern", "source", "is_handled", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class AppointmentRequestCreateSerializer(serializers.ModelSerializer):
    """What the public website may send. `website` is a hidden honeypot field."""

    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = AppointmentRequest
        fields = [
            "full_name", "phone", "email", "department", "preferred_date",
            "preferred_time", "concern", "source", "website",
        ]
        extra_kwargs = {
            "full_name": {"max_length": 150},
            "concern": {"max_length": 3000},
        }
