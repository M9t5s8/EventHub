from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin,Group, Permission
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role='attendee'):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role)
        user.set_password(password)  # Hashes password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name, password, role='organizer')
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user



class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('organizer', 'Organizer'),
        ('attendee', 'Attendee'),
        ('admin','Admin')
    ]
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    joined_at = models.DateField(auto_now_add=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='attendee')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    profile_picture = models.ImageField(
        upload_to='user_images/', 
        default='user_images/default.png',  
        null=True, 
        blank=True
    )


    groups = models.ManyToManyField(Group, related_name="customuser_set", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions_set", blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def save(self, *args, **kwargs):
        if self.is_staff:
            self.role = 'admin' 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.role})"

