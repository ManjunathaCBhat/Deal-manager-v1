from rest_framework import serializers
from .models import Company, Customer, Deal

MUSTAFA_AVATAR_URL = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"


class CustomerInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone_number', 'position']


class CompanySerializer(serializers.ModelSerializer):
    industry_color = serializers.SerializerMethodField()
    customers = CustomerInlineSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'description', 'website',
            'industry', 'industry_color', 'location',
            'customers',
        ]

    def get_industry_color(self, obj):
        return obj.industry_color()


class CustomerSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    industry = serializers.CharField(source='company.industry', read_only=True)

    class Meta:
        model = Customer
        fields = [
            'id',
            'name',
            'email',
            'phone_number',
            'position',
            'company',
            'company_name',
            'industry',
        ]


class DealSerializer(serializers.ModelSerializer):
    contacts = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        many=True
    )
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Deal
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['contacts'] = [
            {
                'id': c.id,
                'name': c.name,
                'email': c.email,
                'phone_number': c.phone_number,
                'avatar_url': MUSTAFA_AVATAR_URL,
                'position': c.position,
            }
            for c in instance.contacts.all()
        ]
        return rep