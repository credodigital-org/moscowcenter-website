"""Small helpers that turn the simple text fields editors fill in (one item
per line, ``Title | Text`` rows, blank-line separated paragraphs) into
structured lists for the public API."""

from django.utils.text import slugify


def text_lines(text):
    return [line.strip() for line in (text or "").splitlines() if line.strip()]


def text_rows(text, min_cols=2):
    """``Title | Text | extra`` per line -> list of cell lists, padded."""
    rows = []
    for line in text_lines(text):
        cells = [cell.strip() for cell in line.split("|")]
        while len(cells) < min_cols:
            cells.append("")
        rows.append(cells)
    return rows


def text_paragraphs(text):
    chunks = [chunk.strip() for chunk in (text or "").replace("\r\n", "\n").split("\n\n")]
    return [chunk for chunk in chunks if chunk]


def unique_slug(model, value, instance=None, max_length=220):
    base = slugify(value)[: max_length - 6] or "item"
    slug, n = base, 2
    qs = model.objects.all()
    if instance is not None and instance.pk:
        qs = qs.exclude(pk=instance.pk)
    while qs.filter(slug=slug).exists():
        slug = f"{base}-{n}"
        n += 1
    return slug
