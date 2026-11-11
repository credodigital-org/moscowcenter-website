from rest_framework.routers import DefaultRouter

from django.urls import path

from .views import (
    AboutBlockViewSet,
    AboutContentViewSet,
    AboutProtocolViewSet,
    AppointmentRequestViewSet,
    DoctorViewSet,
    HomeSectionViewSet,
    ServiceViewSet,
    SiteTextViewSet,
    TestimonialViewSet,
    TreatmentViewSet,
    site_status,
)

router = DefaultRouter()
router.register("home-sections", HomeSectionViewSet, basename="home-section")
router.register("treatments", TreatmentViewSet, basename="treatment")
router.register("services", ServiceViewSet, basename="service")
router.register("doctors", DoctorViewSet, basename="doctor")
router.register("about-content", AboutContentViewSet, basename="about-content")
router.register("about-protocols", AboutProtocolViewSet, basename="about-protocol")
router.register("about-blocks", AboutBlockViewSet, basename="about-block")
router.register("testimonials", TestimonialViewSet, basename="testimonial")
router.register("appointments", AppointmentRequestViewSet, basename="appointment")
router.register("site-texts", SiteTextViewSet, basename="site-text")

urlpatterns = [path("site-status/", site_status, name="site-status")] + router.urls
