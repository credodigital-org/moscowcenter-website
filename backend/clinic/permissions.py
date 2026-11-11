from rest_framework.permissions import SAFE_METHODS, BasePermission


class PublicReadAdminWrite(BasePermission):
    """Public visitors may read published content; staff may manage it."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
