import os

from django.core.exceptions import ValidationError

MAX_IMAGE_MB = 10
MAX_VIDEO_MB = 150
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".m4v"}


def validate_image_size(file):
    """Reject oversized photos before they reach storage (Cloudflare R2)."""
    if file.size > MAX_IMAGE_MB * 1024 * 1024:
        raise ValidationError(f"Images must be {MAX_IMAGE_MB} MB or smaller.")


def validate_video_file(file):
    """Allow only common web video formats, up to MAX_VIDEO_MB."""
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in VIDEO_EXTENSIONS:
        raise ValidationError("Upload a video in MP4, WebM or MOV format.")
    if file.size > MAX_VIDEO_MB * 1024 * 1024:
        raise ValidationError(f"Videos must be {MAX_VIDEO_MB} MB or smaller.")
