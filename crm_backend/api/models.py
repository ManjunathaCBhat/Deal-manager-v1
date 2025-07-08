from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


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
