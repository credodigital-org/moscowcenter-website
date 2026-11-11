from django.contrib import admin

from .models import (
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

admin.site.site_header = "Moscow International Holistic Medical Center"
admin.site.site_title = "MIHMC Admin"


def _publish(modeladmin, request, queryset):
    queryset.update(is_published=True)


def _hide(modeladmin, request, queryset):
    queryset.update(is_published=False)


_publish.short_description = "Publish selected items"
_hide.short_description = "Hide selected items"


@admin.register(HomeSection)
class HomeSectionAdmin(admin.ModelAdmin):
    list_display = ("key", "title", "updated_at")
    search_fields = ("key", "title")


@admin.register(Treatment)
class TreatmentAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "show_on_page", "show_on_home", "order", "is_published")
    list_filter = ("category", "is_published", "show_on_home")
    list_editable = ("order", "is_published")
    search_fields = ("title", "tag", "description")
    actions = [_publish, _hide]


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "order", "is_published")
    list_filter = ("kind", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "short_description", "description")
    actions = [_publish, _hide]


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "specialty", "order", "is_published")
    list_filter = ("is_published",)
    list_editable = ("order", "is_published")
    search_fields = ("name", "specialty", "bio")
    actions = [_publish, _hide]


@admin.register(AboutContent)
class AboutContentAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not AboutContent.objects.exists()


@admin.register(AboutProtocol)
class AboutProtocolAdmin(admin.ModelAdmin):
    list_display = ("title", "label", "order", "is_published")
    list_editable = ("order", "is_published")


@admin.register(AboutBlock)
class AboutBlockAdmin(admin.ModelAdmin):
    list_display = ("heading", "order", "is_published")
    list_editable = ("order", "is_published")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "order", "is_published")
    list_editable = ("order", "is_published")
    actions = [_publish, _hide]


@admin.register(SiteText)
class SiteTextAdmin(admin.ModelAdmin):
    list_display = ("key", "updated_at")
    search_fields = ("key", "value")


@admin.register(AppointmentRequest)
class AppointmentRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone", "department", "source", "created_at", "is_handled")
    list_filter = ("is_handled", "source", "department")
    list_editable = ("is_handled",)
    search_fields = ("full_name", "phone", "email", "concern")
    date_hierarchy = "created_at"
