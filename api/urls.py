from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from api.views import (
    RegisterView, LoginView, LogoutView,
    PredictView,
    HistoryView,
    ProfileView, ChangePasswordView,
    AdminStatsView, AdminPredictionsView, AdminUsersView, AdminUserDetailView,
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='api_register'),
    path('auth/login/', LoginView.as_view(), name='api_login'),
    path('auth/logout/', LogoutView.as_view(), name='api_logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='api_token_refresh'),

    # Prediction
    path('predict/', PredictView.as_view(), name='api_predict'),

    # History
    path('history/', HistoryView.as_view(), name='api_history'),

    # Profile
    path('profile/', ProfileView.as_view(), name='api_profile'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='api_change_password'),

    # Admin
    path('admin/stats/', AdminStatsView.as_view(), name='api_admin_stats'),
    path('admin/predictions/', AdminPredictionsView.as_view(), name='api_admin_predictions'),
    path('admin/users/', AdminUsersView.as_view(), name='api_admin_users'),
    path('admin/users/<int:user_id>/', AdminUserDetailView.as_view(), name='api_admin_user_detail'),
]
