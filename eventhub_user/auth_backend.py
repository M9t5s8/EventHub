from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from eventhub_user.models import CustomUser  # Import your CustomUser model

class EmailAuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(email=email)
            if check_password(password, user.password):  # Verify hashed password
                return user
        except CustomUser.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None
