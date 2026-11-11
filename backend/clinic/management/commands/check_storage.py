from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = (
        "Checks where uploaded images/videos are stored (local disk or Cloudflare R2) "
        "by uploading a tiny test file, printing its public URL and deleting it."
    )

    def handle(self, *args, **options):
        backend = settings.STORAGES["default"]["BACKEND"]
        using_r2 = "s3boto3" in backend.lower()

        self.stdout.write(f"Storage backend : {backend}")
        if using_r2:
            self.stdout.write(f"Bucket          : {settings.AWS_STORAGE_BUCKET_NAME}")
            self.stdout.write(f"Endpoint        : {settings.AWS_S3_ENDPOINT_URL}")
            self.stdout.write(f"Public base URL : {settings.MEDIA_URL}")
        else:
            self.stdout.write(
                self.style.WARNING(
                    "R2 is NOT configured (one of R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / "
                    "R2_BUCKET_NAME / R2_ENDPOINT_URL is missing), so files are saved to the local media/ folder."
                )
            )

        name = "healthcheck/storage-test.txt"
        try:
            saved = default_storage.save(name, ContentFile(b"moscow-center storage check"))
        except Exception as exc:  # noqa: BLE001 - show the real reason to the operator
            raise CommandError(f"Upload failed: {type(exc).__name__}: {exc}") from exc

        url = default_storage.url(saved)
        self.stdout.write(self.style.SUCCESS(f"Upload OK  -> {saved}"))
        self.stdout.write(f"Open this link in a browser (it should show the text): {url}")

        try:
            default_storage.delete(saved)
            self.stdout.write(self.style.SUCCESS("Test file deleted. Storage is working."))
        except Exception as exc:  # noqa: BLE001
            raise CommandError(f"Upload worked but delete failed: {type(exc).__name__}: {exc}") from exc
