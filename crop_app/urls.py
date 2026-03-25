from django.urls import path
from . import views

urlpatterns = [
    # Public
    path('', views.landing, name='landing'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),

    # Auth
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # User App
    path('dashboard/', views.dashboard, name='dashboard'),
    path('history/', views.history, name='history'),
    path('profile/', views.profile, name='profile'),
    path('profile/change-password/', views.change_password, name='change_password'),

    # Admin
    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-panel/predictions/', views.admin_all_predictions, name='admin_all_predictions'),
    path('admin-panel/user/<int:user_id>/', views.admin_user_detail, name='admin_user_detail'),
]
