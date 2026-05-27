from django.db import models

class Activity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Application(models.Model):
    # Grade level dropdown options
    GRADE_CHOICES = [
        ('K', 'Kindergarten'),
        ('1', 'Grade 1'),
        ('2', 'Grade 2'),
        ('3', 'Grade 3'),
        ('4', 'Grade 4'),
        ('5', 'Grade 5'),
        ('6', 'Grade 6'),
        ('7', 'Grade 7'),
        ('8', 'Grade 8'),
        ('9', 'Grade 9'),
        ('10', 'Grade 10'),
        ('11', 'Grade 11'),
        ('12', 'Grade 12'),
    ]

    # Gender radio options
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),

    ]

    # Status choices
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    applicant_name = models.TextField()
    grade_level = models.CharField(max_length=10, choices=GRADE_CHOICES)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    activities = models.ManyToManyField(Activity, blank=True, help_text="Select extracurricular activities.")
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    document = models.FileField(upload_to='documents/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_name} ({self.get_grade_level_display()})"
