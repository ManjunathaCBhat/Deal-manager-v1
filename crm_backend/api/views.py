from rest_framework import viewsets
from .models import Company, Customer, Deal
from .serializers import CompanySerializer, CustomerSerializer, DealSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from datetime import datetime
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import localtime
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from rest_framework_simplejwt.tokens import RefreshToken


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

class AdminRecentActionsAPIView(APIView):
    def get(self, request):
        log_entries = LogEntry.objects.select_related('user', 'content_type').order_by('-action_time')[:20]
        data = []
        for entry in log_entries:
            data.append({
                "id": entry.id,
                "user": entry.user.get_full_name() or entry.user.username,
                "user_avatar": f"https://i.pravatar.cc/150?img={entry.user.id % 70 + 1}",
                "action_type": entry.get_action_flag_display(),
                "object_repr": entry.object_repr,
                "model": entry.content_type.model.capitalize(),
                "action_time": localtime(entry.action_time).strftime('%B %d, %Y – %I:%M %p')
            })
        return Response(data, status=status.HTTP_200_OK)

class ActivityLogView(APIView):
    def get(self, request):
        page = int(request.query_params.get("page", 1))  # Get ?page= from URL, default to 1
        logs = LogEntry.objects.select_related('user', 'content_type').order_by('-action_time')

        paginator = Paginator(logs, 20)  # 20 entries per page
        page_obj = paginator.get_page(page)

        def get_action_label(flag):
            return {
                1: "Create",
                2: "Edit",
                3: "Delete"
            }.get(flag, "Unknown")

        data = []
        for entry in page_obj.object_list:
            data.append({
                "user": entry.user.get_full_name() or entry.user.username,
                "model": entry.content_type.model.capitalize(),
                "object_repr": entry.object_repr,
                "action": get_action_label(entry.action_flag),
                "time": entry.action_time.strftime("%b %d, %Y – %I:%M %p")
            })

        return Response({
            "results": data,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
            "current_page": page,
            "total_pages": paginator.num_pages
        }, status=status.HTTP_200_OK)

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
