import json
from datetime import datetime

from django.db import transaction
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import localtime
from django.contrib.auth.models import User

from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.paginator import Paginator

from openai import OpenAI

from .models import Company, Customer, Deal
from .serializers import CompanySerializer, CustomerSerializer, DealSerializer
from .llm import generate_reply


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer


class DealChatView(APIView):
    """
    Conversational deal creation chat.

    Expects POST body:
    {
      "message": "user text",
      "deal_state": { ... }  // or null on first turn
    }

    Returns:
    {
      "ai_message": "text to show in chat",
      "deal_state": { ... updated ... }
    }
    """

    permission_classes = [permissions.AllowAny]  
    def post(self, request):
        user_message = (request.data.get("message") or "").strip()
        deal_state = request.data.get("deal_state")

        if not user_message:
            ai_message = generate_reply(
                user_prompt="Tell the user you did not receive any text and ask them to type something.",
                context_note="User sent an empty message.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        lowered = user_message.lower()
        if lowered in ["start new deal", "start a new deal", "new deal", "create a new deal"]:
            deal_state = None

        # First turn: init state and ask for title
        if deal_state is None:
            deal_state = {
                "step": "title",
                "title": None,
                "company_name": None,
                "company_id": None,
                "amount": None,
                "stage": None,
                "close_date": None,
                "contacts": [],
                "pending_company_choice": None,
            }
            ai_message = generate_reply(
                user_prompt="Greet the user, explain you will help them create a new deal, then ask for the deal title.",
                context_note="Starting a new deal creation flow.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        step = deal_state.get("step")

        if step == "title":
            return self.handle_title_step(user_message, deal_state)

        if step == "company":
            return self.handle_company_step(user_message, deal_state)

        if step == "amount":
            return self.handle_amount_step(user_message, deal_state)

        if step == "stage":
            return self.handle_stage_step(user_message, deal_state)

        if step == "close_date":
            return self.handle_close_date_step(user_message, deal_state)

        if step == "contacts":
            return self.handle_contacts_step(user_message, deal_state)

        ai_message = generate_reply(
            user_prompt="Tell the user this deal is already created and they can start a new one.",
            context_note=f"deal_state.step is '{step}', which means the flow is complete.",
        )
        return Response(
            {"ai_message": ai_message, "deal_state": deal_state},
            status=status.HTTP_200_OK,
        )

    def handle_title_step(self, user_message, deal_state):
        if len(user_message) < 3:
            ai_message = generate_reply(
                user_prompt=(
                    f"The user entered a very short title: '{user_message}'. "
                    "Ask them for a more descriptive deal title."
                ),
                context_note="We are on the title step and need something longer.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        deal_state["title"] = user_message
        deal_state["step"] = "company"
        ai_message = generate_reply(
            user_prompt=(
                f"Confirm the title '{user_message}' quickly and ask which company this deal is with."
            ),
            context_note="Title accepted, moving to company selection.",
        )
        return Response(
            {"ai_message": ai_message, "deal_state": deal_state},
            status=status.HTTP_200_OK,
        )

    def handle_company_step(self, user_message, deal_state):
        """
        Two modes:
        - If pending_company_choice is set, expect an id from the user
        - Otherwise treat message as a name search
        """
        pending = deal_state.get("pending_company_choice")
        if pending:
            # Expect numeric id from the options
            try:
                chosen_id = int(user_message)
            except ValueError:
                ai_message = generate_reply(
                    user_prompt=(
                        f"The user replied '{user_message}' which is not a valid numeric id. "
                        f"Ask them to reply with a number from this list: {pending}."
                    ),
                    context_note="Waiting for company id from a previous options list.",
                )
                return Response(
                    {"ai_message": ai_message, "deal_state": deal_state},
                    status=status.HTTP_200_OK,
                )

            if chosen_id not in pending:
                ai_message = generate_reply(
                    user_prompt=(
                        f"The user chose id {chosen_id} which is not in the valid ids {pending}. "
                        "Ask them to pick one of those ids."
                    ),
                    context_note="User chose an invalid company id.",
                )
                return Response(
                    {"ai_message": ai_message, "deal_state": deal_state},
                    status=status.HTTP_200_OK,
                )

            try:
                company = Company.objects.get(id=chosen_id)
            except Company.DoesNotExist:
                ai_message = generate_reply(
                    user_prompt=(
                        f"Tell the user something went wrong because company id {chosen_id} no longer exists. "
                        "Ask them to type the company name again."
                    ),
                    context_note="Chosen company id not found in the database.",
                )
                deal_state["pending_company_choice"] = None
                return Response(
                    {"ai_message": ai_message, "deal_state": deal_state},
                    status=status.HTTP_200_OK,
                )

            deal_state["company_id"] = company.id
            deal_state["company_name"] = company.name
            deal_state["pending_company_choice"] = None
            deal_state["step"] = "amount"
            ai_message = generate_reply(
                user_prompt=(
                    f"Confirm the company '{company.name}' and ask for the deal amount in dollars."
                ),
                context_note="Company selected successfully from list.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        # Normal flow: search by name
        name = user_message
        qs = Company.objects.filter(name__icontains=name)
        count = qs.count()

        if count == 0:
            ai_message = generate_reply(
                user_prompt=(
                    f"The user typed '{name}' but there are no matching companies. "
                    "Tell them you could not find that company and ask them to try the exact name as in the CRM."
                ),
                context_note="Company search returned zero results.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        if count > 5:
            ai_message = generate_reply(
                user_prompt=(
                    f"The search for '{name}' returned more than 5 companies. "
                    "Tell the user there are too many matches and ask for a more specific company name."
                ),
                context_note="Too many company matches.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        if count > 1:
            options = [f"{c.id}: {c.name}" for c in qs]
            deal_state["pending_company_choice"] = [c.id for c in qs]
            options_text = "\n".join(options)
            ai_message = generate_reply(
                user_prompt=(
                    "Show this list of companies:\n"
                    f"{options_text}\n"
                    "Ask the user to reply with the numeric id of the correct company."
                ),
                context_note="Multiple company matches, need user to choose one.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        company = qs.first()
        deal_state["company_id"] = company.id
        deal_state["company_name"] = company.name
        deal_state["step"] = "amount"
        ai_message = generate_reply(
            user_prompt=(
                f"Confirm that the company is '{company.name}' and ask for the deal amount in dollars."
            ),
            context_note="Single company matched, auto selected.",
        )
        return Response(
            {"ai_message": ai_message, "deal_state": deal_state},
            status=status.HTTP_200_OK,
        )

    def handle_amount_step(self, user_message, deal_state):
        clean = "".join(ch for ch in user_message if ch.isdigit() or ch == ".")

        try:
            amount = float(clean)
        except ValueError:
            ai_message = generate_reply(
                user_prompt=(
                    f"The user wrote '{user_message}' which is not a clean number. "
                    "Ask them to enter just the amount like 15000 or 15000.50."
                ),
                context_note="Invalid amount format.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        if amount <= 0:
            ai_message = generate_reply(
                user_prompt=(
                    f"The user entered {amount}. Tell them the amount must be greater than zero and ask them to try again."
                ),
                context_note="Non positive deal amount.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        deal_state["amount"] = float(f"{amount:.2f}")
        deal_state["step"] = "stage"
        ai_message = generate_reply(
            user_prompt=(
                f"The deal amount is {amount}. Confirm briefly and ask which stage the deal is in. "
                "Mention allowed options: proposal, qualified, or negotiation."
            ),
            context_note="Amount accepted, moving to stage selection.",
        )
        return Response(
            {"ai_message": ai_message, "deal_state": deal_state},
            status=status.HTTP_200_OK,
        )

    def handle_stage_step(self, user_message, deal_state):
        text = user_message.strip().lower()
        valid_stages = ["proposal", "qualified", "negotiation"]
        match = None
        for s in valid_stages:
            if s in text:
                match = s
                break
        if match is None and text in valid_stages:
            match = text

        if match is None:
            ai_message = generate_reply(
                user_prompt=(
                    f"The user wrote '{user_message}'. Tell them that is not a valid stage and "
                    "remind them to choose proposal, qualified, or negotiation."
                ),
                context_note="Invalid stage input.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        deal_state["stage"] = match
        deal_state["step"] = "close_date"
        ai_message = generate_reply(
            user_prompt=(
                f"The stage is '{match}'. Confirm that and ask for the expected close date in "
                "YYYY-MM-DD format, and mention they can type 'skip' to leave it empty."
            ),
            context_note="Stage accepted, moving to close date.",
        )
        return Response(
            {"ai_message": ai_message, "deal_state": deal_state},
            status=status.HTTP_200_OK,
        )

    def handle_close_date_step(self, user_message, deal_state):
        text = user_message.strip().lower()
        if text in ["skip", "none"]:
            deal_state["close_date"] = None
            deal_state["step"] = "contacts"
            ai_message = generate_reply(
                user_prompt=(
                    "Acknowledge that there is no close date and ask if they want to associate any contacts. "
                    "Tell them they can reply with comma separated contact ids or say 'no'."
                ),
                context_note="User skipped close date.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        try:
            dt = datetime.fromisoformat(text)
            deal_state["close_date"] = dt.date().isoformat()
        except ValueError:
            ai_message = generate_reply(
                user_prompt=(
                    f"The user wrote '{user_message}'. Tell them you could not read that as a date and "
                    "remind them to use YYYY-MM-DD or type 'skip'."
                ),
                context_note="Invalid close date format.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        deal_state["step"] = "contacts"
        ai_message = generate_reply(
            user_prompt=(
                "Confirm the close date and ask if they want to link any contacts. "
                "Tell them they can enter comma separated contact ids or say 'no'."
            ),
            context_note="Close date accepted, moving to contacts.",
        )
        return Response(
            {"ai_message": ai_message, "deal_state": deal_state},
            status=status.HTTP_200_OK,
        )

    @transaction.atomic
    def handle_contacts_step(self, user_message, deal_state):
        text = user_message.strip().lower()
        contact_ids = []

        if text not in ["no", "none", "skip", ""]:
            parts = [p.strip() for p in text.split(",") if p.strip()]
            for p in parts:
                try:
                    contact_ids.append(int(p))
                except ValueError:
                    # ignore bad ids
                    pass

        title = deal_state.get("title") or "Untitled deal"
        company_id = deal_state.get("company_id")
        amount = deal_state.get("amount") or 0.0
        stage = deal_state.get("stage") or "proposal"
        close_date_str = deal_state.get("close_date")

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            deal_state["step"] = "done"
            ai_message = generate_reply(
                user_prompt=(
                    "Tell the user something went wrong because the chosen company no longer exists. "
                    "Ask them to start a new deal."
                ),
                context_note="Company disappeared before saving the deal.",
            )
            return Response(
                {"ai_message": ai_message, "deal_state": deal_state},
                status=status.HTTP_200_OK,
            )

        close_date = None
        if close_date_str:
            try:
                close_date = datetime.fromisoformat(close_date_str).date()
            except ValueError:
                close_date = None

        deal = Deal.objects.create(
            title=title,
            amount=amount,
            company=company,
            stage=stage,
            close_date=close_date,
        )

        if contact_ids:
            contacts = list(Customer.objects.filter(id__in=contact_ids))
            deal.contacts.set(contacts)

        deal_state["step"] = "done"
        ai_message = generate_reply(
            user_prompt=(
                f"Tell the user that the deal was created successfully with id {deal.id} "
                f"for company '{company.name}', thank them, and mention that they can start another deal if they want."
            ),
            context_note="Deal has been written to the database.",
        )
        return Response(
            {"ai_message": ai_message, "deal_state": deal_state},
            status=status.HTTP_200_OK,
        )


class VoiceDealView(APIView):
    def post(self, request):
        transcript = request.data.get("transcript", "")

        if not transcript:
            return Response(
                {"error": "Transcript is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        openai_client = OpenAI(api_key="YOUR_API_KEY")
        gpt_response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an assistant that extracts deal information for a CRM from natural language."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "Extract deal details from: "
                        f"'{transcript}' and respond in JSON: "
                        "{'title': '', 'company': '', 'amount': '', 'close_date': ''}"
                    ),
                },
            ],
        )

        content = gpt_response.choices[0].message.content
        parsed = json.loads(content)

        company_name = parsed.get("company")
        if not company_name:
            return Response(
                {"error": "No company name detected in transcript"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        company, _ = Company.objects.get_or_create(name=company_name)

        amount_raw = parsed.get("amount") or 0
        try:
            amount = float(amount_raw)
        except (TypeError, ValueError):
            amount = 0

        close_date_raw = parsed.get("close_date")
        close_date = None
        if close_date_raw:
            try:
                close_date = datetime.strptime(close_date_raw, "%Y-%m-%d").date()
            except ValueError:
                close_date = None

        deal = Deal.objects.create(
            title=parsed.get("title") or "Untitled deal",
            company=company,
            amount=amount,
            stage="proposal",
            close_date=close_date,
        )

        return Response(
            {"message": "Deal created", "deal_id": deal.id},
            status=status.HTTP_201_CREATED,
        )


class AdminRecentActionsAPIView(APIView):
    def get(self, request):
        log_entries = (
            LogEntry.objects.select_related("user", "content_type")
            .order_by("-action_time")[:20]
        )
        data = []
        for entry in log_entries:
            data.append(
                {
                    "id": entry.id,
                    "user": entry.user.get_full_name() or entry.user.username,
                    "user_avatar": f"https://i.pravatar.cc/150?img={entry.user.id % 70 + 1}",
                    "action_type": entry.get_action_flag_display(),
                    "object_repr": entry.object_repr,
                    "model": entry.content_type.model.capitalize(),
                    "action_time": localtime(entry.action_time).strftime(
                        "%B %d, %Y - %I:%M %p"
                    ),
                }
            )
        return Response(data, status=status.HTTP_200_OK)


class ActivityLogView(APIView):
    def get(self, request):
        page = int(request.query_params.get("page", 1))
        logs = LogEntry.objects.select_related("user", "content_type").order_by(
            "-action_time"
        )

        paginator = Paginator(logs, 20)
        page_obj = paginator.get_page(page)

        def get_action_label(flag):
            return {
                1: "Create",
                2: "Edit",
                3: "Delete",
            }.get(flag, "Unknown")

        data = []
        for entry in page_obj.object_list:
            data.append(
                {
                    "user": entry.user.get_full_name() or entry.user.username,
                    "model": entry.content_type.model.capitalize(),
                    "object_repr": entry.object_repr,
                    "action": get_action_label(entry.action_flag),
                    "time": entry.action_time.strftime("%b %d, %Y - %I:%M %p"),
                }
            )

        return Response(
            {
                "results": data,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
                "current_page": page,
                "total_pages": paginator.num_pages,
            },
            status=status.HTTP_200_OK,
        )


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
