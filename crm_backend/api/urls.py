from django.urls import path
from api.views import DealListCreate, CompanyListCreate, CustomerListCreate

urlpatterns = [
    path('deals/', DealListCreate.as_view(), name='deal-list'),
    path('companies/', CompanyListCreate.as_view(), name='company-list'),
    path('customers/', CustomerListCreate.as_view(), name='customer-list'),
]
