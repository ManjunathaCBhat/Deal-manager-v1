from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, CustomerViewSet, DealViewSet, VoiceDealView, AdminRecentActionsAPIView

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'deals', DealViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('voice-deal/', VoiceDealView.as_view(), name='voice-deal'),
path('activity-log/', AdminRecentActionsAPIView.as_view(), name='activity-log'),
]
