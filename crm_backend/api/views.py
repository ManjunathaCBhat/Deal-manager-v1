from rest_framework import viewsets
from .models import Company, Customer, Deal
from .serializers import CompanySerializer, CustomerSerializer, DealSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from datetime import datetime


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer


class VoiceDealView(APIView):
    def post(self, request):
        transcript = request.data.get("transcript", "")

        # 🔗 Send to GPT-4 to parse
        openai_client = OpenAI(api_key="YOUR_API_KEY")
        gpt_response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that extracts deal information for a CRM from natural language."},
                {"role": "user", "content": f"Extract deal details from: '{transcript}' and respond in JSON: {{'title': '', 'company': '', 'amount': '', 'close_date': ''}}"}
            ]
        )

        content = gpt_response.choices[0].message.content
        parsed = json.loads(content)

        # Find or create company
        company, _ = Company.objects.get_or_create(name=parsed['company'])

        # Create deal
        deal = Deal.objects.create(
            title=parsed['title'],
            company=company,
            amount=parsed['amount'],
            stage="proposal",
            close_date=datetime.strptime(parsed['close_date'], "%Y-%m-%d").date()
        )

        return Response({"message": "Deal created", "deal_id": deal.id}, status=status.HTTP_201_CREATED)

