from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from clinic.models import AboutProtocol, AppointmentRequest, Doctor, Service, SiteText, Testimonial, Treatment


class PublicApiSmokeTests(APITestCase):
    """Keep the public CMS endpoints covered by a small regression suite."""

    endpoints = (
        "home-sections",
        "treatments",
        "services",
        "doctors",
        "about-content",
        "about-protocols",
        "about-blocks",
        "testimonials",
        "site-texts",
    )

    def test_public_content_endpoints_return_200(self):
        for endpoint in self.endpoints:
            with self.subTest(endpoint=endpoint):
                response = self.client.get(f"/api/{endpoint}/")
                self.assertEqual(response.status_code, 200)

    def test_content_write_operations_require_staff(self):
        for endpoint in self.endpoints:
            with self.subTest(endpoint=endpoint):
                response = self.client.post(f"/api/{endpoint}/", {})
                self.assertIn(response.status_code, (401, 403))

    def test_staff_can_access_admin_content_endpoint(self):
        user = get_user_model().objects.create_user(
            username="cms-test", password="test-password", is_staff=True
        )
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/doctors/")
        self.assertEqual(response.status_code, 200)


class SiteStatusTests(APITestCase):
    def test_counts_include_hidden_records(self):
        self.assertEqual(self.client.get("/api/site-status/").json()["doctors"], 0)
        Doctor.objects.create(name="Hidden", is_published=False)
        self.assertEqual(self.client.get("/api/site-status/").json()["doctors"], 1)


class PublishingTests(APITestCase):
    """Hidden content must never reach the public website."""

    def setUp(self):
        Doctor.objects.create(name="Visible Doctor", is_published=True)
        Doctor.objects.create(name="Hidden Doctor", is_published=False)
        Treatment.objects.create(title="Visible Treatment", is_published=True)
        Treatment.objects.create(title="Hidden Treatment", is_published=False)
        Service.objects.create(title="Visible Service", is_published=True)
        Service.objects.create(title="Hidden Service", is_published=False)
        AboutProtocol.objects.create(title="Hidden card", is_published=False)
        Testimonial.objects.create(name="Hidden reviewer", review="x", is_published=False)

    def names(self, endpoint, key):
        return [item[key] for item in self.client.get(f"/api/{endpoint}/").json()]

    def test_public_sees_published_only(self):
        self.assertEqual(self.names("doctors", "name"), ["Visible Doctor"])
        self.assertEqual(self.names("treatments", "title"), ["Visible Treatment"])
        self.assertEqual(self.names("services", "title"), ["Visible Service"])
        self.assertEqual(self.names("about-protocols", "title"), [])
        self.assertEqual(self.names("testimonials", "name"), [])

    def test_staff_sees_everything(self):
        user = get_user_model().objects.create_user(
            username="editor", password="test-password", is_staff=True
        )
        self.client.force_authenticate(user=user)
        self.assertEqual(len(self.names("doctors", "name")), 2)
        self.assertEqual(len(self.names("treatments", "title")), 2)
        self.assertEqual(len(self.names("testimonials", "name")), 1)

    def test_doctor_text_fields_are_parsed_into_lists(self):
        doctor = Doctor.objects.get(name="Visible Doctor")
        doctor.cards = "Pain Care | Relief for joints | bone"
        doctor.facts = "LICENSURE | DOH Abu Dhabi"
        doctor.bio = "First paragraph.\n\nSecond paragraph."
        doctor.save()
        data = self.client.get("/api/doctors/").json()[0]
        self.assertEqual(data["cards_list"][0], {"title": "Pain Care", "text": "Relief for joints", "icon": "bone"})
        self.assertEqual(data["facts_list"][0], {"label": "LICENSURE", "value": "DOH Abu Dhabi"})
        self.assertEqual(data["bio_paragraphs"], ["First paragraph.", "Second paragraph."])

    def test_slug_is_generated_and_unique(self):
        first = Treatment.objects.create(title="Shirodhara")
        second = Treatment.objects.create(title="Shirodhara")
        self.assertEqual(first.slug, "shirodhara")
        self.assertEqual(second.slug, "shirodhara-2")


class SiteTextTests(APITestCase):
    def staff(self):
        user = get_user_model().objects.create_user(username="editor", password="test-password", is_staff=True)
        self.client.force_authenticate(user=user)

    def test_public_can_read_but_not_save(self):
        self.assertEqual(self.client.get("/api/site-texts/").status_code, 200)
        response = self.client.post("/api/site-texts/bulk/", {"values": {"a.b": "x"}}, format="json")
        self.assertIn(response.status_code, (401, 403))

    def test_staff_can_save_and_reset_texts(self):
        self.staff()
        self.client.post("/api/site-texts/bulk/", {"values": {"home.hero.x": "New heading"}}, format="json")
        self.assertEqual(SiteText.objects.get(key="home.hero.x").value, "New heading")
        self.assertEqual(self.client.get("/api/site-texts/").json(), [{"key": "home.hero.x", "value": "New heading"}])
        self.client.post("/api/site-texts/bulk/", {"values": {"home.hero.x": None}}, format="json")
        self.assertFalse(SiteText.objects.exists())


class AppointmentRequestTests(APITestCase):
    payload = {
        "full_name": "Mariam Al Mansoori",
        "phone": "50 123 4567",
        "email": "mariam@example.com",
        "department": "Kerala Ayurveda",
        "preferred_date": "2026-12-01",
        "preferred_time": "Morning",
        "concern": "Back pain",
        "source": "contact",
    }

    def staff(self):
        user = get_user_model().objects.create_user(username="editor", password="test-password", is_staff=True)
        self.client.force_authenticate(user=user)

    def test_visitor_can_submit_but_not_read(self):
        response = self.client.post("/api/appointments/", self.payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(AppointmentRequest.objects.count(), 1)
        self.assertIn(self.client.get("/api/appointments/").status_code, (401, 403))

    def test_honeypot_submissions_are_discarded(self):
        response = self.client.post("/api/appointments/", {**self.payload, "website": "http://spam.example"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(AppointmentRequest.objects.count(), 0)

    def test_name_and_phone_are_required(self):
        response = self.client.post("/api/appointments/", {"concern": "hi"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_staff_can_list_and_mark_handled(self):
        self.client.post("/api/appointments/", self.payload, format="json")
        self.staff()
        listing = self.client.get("/api/appointments/").json()
        self.assertEqual(len(listing), 1)
        self.client.patch(f"/api/appointments/{listing[0]['id']}/", {"is_handled": True}, format="json")
        self.assertTrue(AppointmentRequest.objects.get().is_handled)
