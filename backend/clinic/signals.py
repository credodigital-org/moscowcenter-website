"""Keep storage (local disk or Cloudflare R2) tidy.

When a record is deleted, or one of its images/videos is replaced or cleared
from the CMS, the old file is removed from storage so nothing is orphaned.
"""

from django.db import transaction
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver


def _is_clinic_model(sender):
    return sender._meta.app_label == "clinic"


def _file_fields(instance):
    from django.db.models import FileField

    return [f for f in instance._meta.concrete_fields if isinstance(f, FileField)]


@receiver(post_delete)
def delete_files_with_record(sender, instance, **kwargs):
    if not _is_clinic_model(sender):
        return
    for field in _file_fields(instance):
        stored = getattr(instance, field.name, None)
        if stored and stored.name:
            name, storage = stored.name, stored.storage
            transaction.on_commit(lambda n=name, s=storage: s.delete(n))


@receiver(pre_save)
def delete_replaced_files(sender, instance, **kwargs):
    if not _is_clinic_model(sender) or not instance.pk:
        return
    try:
        old = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return
    for field in _file_fields(instance):
        old_file = getattr(old, field.name, None)
        new_file = getattr(instance, field.name, None)
        if old_file and old_file.name and (not new_file or old_file.name != new_file.name):
            name, storage = old_file.name, old_file.storage
            transaction.on_commit(lambda n=name, s=storage: s.delete(n))
