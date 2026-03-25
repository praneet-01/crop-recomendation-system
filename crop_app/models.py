from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """Extended User model with additional fields."""
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email or self.username

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class PredictionHistory(models.Model):
    """Stores every prediction made by users."""
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='predictions'
    )

    # Soil / Climate Inputs
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    ph = models.FloatField()
    rainfall = models.FloatField()

    # Output
    predicted_crop = models.CharField(max_length=100)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.predicted_crop} ({self.created_at.strftime('%d %b %Y')})"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Prediction'
        verbose_name_plural = 'Predictions'
