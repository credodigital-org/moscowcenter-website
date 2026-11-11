from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import (
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
from .permissions import PublicReadAdminWrite
from .serializers import (
    AboutBlockSerializer,
    AboutContentSerializer,
    AboutProtocolSerializer,
    AppointmentRequestCreateSerializer,
    AppointmentRequestSerializer,
    DoctorSerializer,
    HomeSectionSerializer,
    ServiceSerializer,
    SiteTextSerializer,
    TestimonialSerializer,
    TreatmentSerializer,
)


def is_staff_request(request):
    return bool(request.user and request.user.is_staff)


class PublishedModelViewSet(viewsets.ModelViewSet):
    """Visitors only ever receive published records; staff see everything."""

    permission_classes = [PublicReadAdminWrite]
    model = None

    def get_queryset(self):
        qs = self.model.objects.all()
        if not is_staff_request(self.request):
            qs = qs.filter(is_published=True)
        return qs


class SingletonModelViewSet(viewsets.ModelViewSet):
    permission_classes = [PublicReadAdminWrite]
    singleton_model = None

    def get_queryset(self):
        return self.singleton_model.objects.all()

    def create(self, request, *args, **kwargs):
        obj = self.singleton_model.objects.first()
        if obj:
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        return super().create(request, *args, **kwargs)


class HomeSectionViewSet(viewsets.ModelViewSet):
    queryset = HomeSection.objects.all()
    serializer_class = HomeSectionSerializer
    permission_classes = [PublicReadAdminWrite]

    @action(detail=False, methods=["get"], url_path="slots")
    def slots(self, request):
        """The editable slots of the home page (used by the CMS)."""
        return Response(HOME_SLOTS)


class TreatmentViewSet(PublishedModelViewSet):
    model = Treatment
    serializer_class = TreatmentSerializer


class ServiceViewSet(PublishedModelViewSet):
    model = Service
    serializer_class = ServiceSerializer


class DoctorViewSet(PublishedModelViewSet):
    model = Doctor
    serializer_class = DoctorSerializer


class AboutContentViewSet(SingletonModelViewSet):
    serializer_class = AboutContentSerializer
    singleton_model = AboutContent

    def list(self, request, *args, **kwargs):
        info = AboutContent.objects.first()
        if info is None:
            return Response({})
        return Response(self.get_serializer(info).data)


class AboutProtocolViewSet(PublishedModelViewSet):
    model = AboutProtocol
    serializer_class = AboutProtocolSerializer


class AboutBlockViewSet(PublishedModelViewSet):
    model = AboutBlock
    serializer_class = AboutBlockSerializer


class TestimonialViewSet(PublishedModelViewSet):
    model = Testimonial
    serializer_class = TestimonialSerializer


class SiteTextViewSet(viewsets.ReadOnlyModelViewSet):
    """Public list of edited website texts; staff save them in bulk."""

    queryset = SiteText.objects.all()
    serializer_class = SiteTextSerializer
    permission_classes = [PublicReadAdminWrite]
    pagination_class = None

    @action(detail=False, methods=["post"], url_path="bulk")
    def bulk(self, request):
        """Body: {"values": {"some.key": "new text", "other.key": null}}.

        A string saves the edited text; null removes the edit so the website
        shows the original wording again."""
        if not is_staff_request(request):
            return Response({"detail": "Staff access required."}, status=403)
        values = request.data.get("values")
        if not isinstance(values, dict):
            return Response({"detail": "Send a 'values' object."}, status=400)
        saved = removed = 0
        for key, value in values.items():
            key = str(key)[:190]
            if value is None:
                removed += SiteText.objects.filter(key=key).delete()[0]
            else:
                SiteText.objects.update_or_create(key=key, defaults={"value": str(value)})
                saved += 1
        return Response({"saved": saved, "removed": removed})


class AppointmentRequestViewSet(viewsets.ModelViewSet):
    """Visitors may only create a request; staff read and manage them in the CMS inbox."""

    queryset = AppointmentRequest.objects.all()
    throttle_scope = "enquiry"

    def get_serializer_class(self):
        return AppointmentRequestCreateSerializer if self.action == "create" else AppointmentRequestSerializer

    def get_permissions(self):
        return [AllowAny()] if self.action == "create" else [IsAdminUser()]

    def get_throttles(self):
        # Only the public form is rate limited; staff using the CMS are not.
        return [ScopedRateThrottle()] if self.action == "create" else []

    def create(self, request, *args, **kwargs):
        # Honeypot: real visitors never see or fill this field, bots do.
        if str(request.data.get("website", "")).strip():
            return Response({"ok": True}, status=201)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = {k: v for k, v in serializer.validated_data.items() if k != "website"}
        enquiry = AppointmentRequest.objects.create(**data)
        notify_new_enquiry(enquiry)
        return Response({"ok": True}, status=201)


def notify_new_enquiry(enquiry):
    """Email the clinic about a new request (only if ENQUIRY_NOTIFY_EMAILS is configured)."""
    recipients = settings.ENQUIRY_NOTIFY_EMAILS
    if not recipients:
        return
    lines = [
        f"Name: {enquiry.full_name}",
        f"Phone: {enquiry.phone}",
        f"Email: {enquiry.email or '-'}",
        f"Department: {enquiry.department or '-'}",
        f"Preferred date: {enquiry.preferred_date or '-'} {enquiry.preferred_time}".rstrip(),
        f"Form: {enquiry.get_source_display()}",
        "",
        enquiry.concern or "(no message)",
    ]
    send_mail(
        subject=f"New appointment request — {enquiry.full_name}",
        message="\n".join(lines),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipients,
        fail_silently=True,  # a mail problem must never lose the enquiry or break the form
    )


def site_status(request):
    """How many records exist per content type, hidden ones included.

    The website uses this to tell "never configured" (show the original design
    content) apart from "everything hidden on purpose" (show nothing)."""
    return JsonResponse(
        {
            "doctors": Doctor.objects.count(),
            "treatments": Treatment.objects.count(),
            "services": Service.objects.count(),
            "about-protocols": AboutProtocol.objects.count(),
            "testimonials": Testimonial.objects.count(),
        }
    )


def health_check(request):
    return JsonResponse({"status": "ok"})
