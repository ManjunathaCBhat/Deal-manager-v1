from django.db import models

class Company(models.Model):
    INDUSTRY_CHOICES = [
        ('technology', 'Technology'),
        ('healthcare', 'Healthcare'),
        ('finance', 'Finance'),
        ('sports', 'Sports'),
        ('manufacturing', 'Manufacturing'),
        ('retail', 'Retail'),
        ('energy', 'Energy'),
        ('aviation', 'Aviation'),
        ('other', 'Other'),
        ('real estate', 'Real Estate'),
        ('food & beverage', 'Food & Beverage'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

    def industry_color(self):
        mapping = {
            'technology': 'blue',
            'healthcare': 'green',
            'finance': 'orange',
            'sports': 'purple',
            'manufacturing': 'gray',
            'retail': 'pink',
            'energy': 'yellow',
            'aviation': 'teal',
            'real estate': 'magenta',
            'food & beverage': 'gold',
        }
        return mapping.get(self.industry, 'default')


class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='customers')

    def __str__(self):
        return self.name


class Deal(models.Model):
    STAGE_CHOICES = [
        ('proposal', 'Proposal'),
        ('qualified', 'Qualified'),
        ('negotiation', 'Negotiation'),
    ]

    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='deals')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='proposal')
    close_date = models.DateField(null=True, blank=True)
    contacts = models.ManyToManyField(Customer, related_name='deals')

    def __str__(self):
        return self.title
