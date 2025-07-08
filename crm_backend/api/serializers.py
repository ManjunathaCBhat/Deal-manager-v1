from rest_framework import serializers
from .models import Company, Customer, Deal

class CompanySerializer(serializers.ModelSerializer):
    industry_color = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'description', 'website',
            'industry', 'industry_color', 'location'
        ]

    def get_industry_color(self, obj):
        return obj.industry_color()


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'
