from django.db import models
from django.contrib.auth.models import User
from PIL import Image

# Create your models here.
class UserProfile(models.Model):
    EMPLOYEE_CATEGORY = (
        ("EN", "Engineer"),
        ("MD", "Director"),
        ("SU", "Surveyor")
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_number = models.CharField("ID Number", max_length=13)
    profile_pic = models.ImageField("Profile Picture", default="user3.png", upload_to="uploads")
    employee_status = models.CharField("Employee Category", choices=EMPLOYEE_CATEGORY, max_length=50)
    phone_number = models.CharField("Phone Number", max_length=15)
    department = models.CharField("Department", max_length=50)
    ward = models.CharField("Ward", max_length=50)
    constituency = models.CharField("Constituency", max_length=50)
    county = models.CharField("County", max_length=50)

        

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return self.user.username

    # def get_absolute_url(self):
    #     return reverse("_detail", kwargs={"pk": self.pk})

    def save(self,*args, **kwargs):
        super().save(*args, **kwargs)

        size = (300, 300)
        img = Image.open(self.profile_pic.path)
        if img.height > 300 or img.width > 300:
             img.thumbnail(size)
             img.save(self.profile_pic.path)