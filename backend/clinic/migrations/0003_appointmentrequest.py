from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("clinic", "0002_sitetext_testimonial_delete_galleryitem"),
    ]

    operations = [
        migrations.CreateModel(
            name="AppointmentRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=150)),
                ("phone", models.CharField(max_length=50)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("department", models.CharField(blank=True, max_length=150)),
                ("preferred_date", models.CharField(blank=True, max_length=60)),
                ("preferred_time", models.CharField(blank=True, max_length=60)),
                ("concern", models.TextField(blank=True)),
                ("source", models.CharField(choices=[("home", "Home page form"), ("contact", "Contact page form")], default="contact", max_length=20)),
                ("is_handled", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Appointment request",
                "verbose_name_plural": "Appointment requests",
                "ordering": ["-created_at"],
            },
        ),
    ]
