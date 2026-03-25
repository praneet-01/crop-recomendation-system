from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from .models import CustomUser, PredictionHistory
from .forms import SignupForm, LoginForm, ProfileUpdateForm, PredictionForm
from .ml_utils import predict_crop


# ─── Helper ────────────────────────────────────────────────────────────────────

def is_admin(user):
    return user.is_staff or user.is_superuser


# ─── Public Views ──────────────────────────────────────────────────────────────

def landing(request):
    """Home / Landing page."""
    if request.user.is_authenticated:
        return redirect('dashboard')
    params = [
        {'icon': '🌿', 'name': 'Nitrogen (N)'},
        {'icon': '🔴', 'name': 'Phosphorus (P)'},
        {'icon': '🟡', 'name': 'Potassium (K)'},
        {'icon': '🌡️', 'name': 'Temperature'},
        {'icon': '💧', 'name': 'Humidity'},
        {'icon': '🧪', 'name': 'pH Value'},
        {'icon': '🌧️', 'name': 'Rainfall'},
    ]
    return render(request, 'crop_app/landing.html', {'params': params})


def about(request):
    techs = ['Django', 'Python', 'Scikit-learn', 'Random Forest', 'Bootstrap 5', 'HTML/CSS/JS', 'SQLite', 'pandas']
    return render(request, 'crop_app/about.html', {'techs': techs})


def contact(request):
    if request.method == 'POST':
        messages.success(request, "Thanks for reaching out! We'll get back to you soon.")
        return redirect('contact')
    return render(request, 'crop_app/contact.html')


# ─── Authentication ────────────────────────────────────────────────────────────

def signup_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"Welcome, {user.first_name or user.username}! Your account was created.")
            return redirect('dashboard')
        else:
            messages.error(request, "Please fix the errors below.")
    else:
        form = SignupForm()

    return render(request, 'crop_app/signup.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Welcome back, {user.first_name or user.username}!")
            next_url = request.GET.get('next', 'dashboard')
            return redirect(next_url)
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = LoginForm()

    return render(request, 'crop_app/login.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('landing')


# ─── Core App Views ────────────────────────────────────────────────────────────

@login_required
def dashboard(request):
    """Main prediction dashboard."""
    result = None
    form = PredictionForm()

    if request.method == 'POST':
        form = PredictionForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            try:
                result = predict_crop(
                    N=data['nitrogen'],
                    P=data['phosphorus'],
                    K=data['potassium'],
                    temperature=data['temperature'],
                    humidity=data['humidity'],
                    ph=data['ph'],
                    rainfall=data['rainfall'],
                )

                # Save prediction to database
                PredictionHistory.objects.create(
                    user=request.user,
                    nitrogen=data['nitrogen'],
                    phosphorus=data['phosphorus'],
                    potassium=data['potassium'],
                    temperature=data['temperature'],
                    humidity=data['humidity'],
                    ph=data['ph'],
                    rainfall=data['rainfall'],
                    predicted_crop=result['crop'],
                )

                messages.success(request, f"Prediction successful! Recommended crop: {result['crop_display']}")

            except FileNotFoundError as e:
                messages.error(request, f"Model not found. Please ensure model.pkl is in model_store/. Error: {e}")
            except Exception as e:
                messages.error(request, f"Prediction failed: {str(e)}")
        else:
            messages.error(request, "Please enter valid values in all fields.")

    # Get user's recent predictions
    recent_predictions = PredictionHistory.objects.filter(user=request.user)[:5]
    total_predictions = PredictionHistory.objects.filter(user=request.user).count()

    context = {
        'form': form,
        'result': result,
        'recent_predictions': recent_predictions,
        'total_predictions': total_predictions,
    }
    return render(request, 'crop_app/dashboard.html', context)


@login_required
def history(request):
    """User's full prediction history."""
    predictions = PredictionHistory.objects.filter(user=request.user)
    return render(request, 'crop_app/history.html', {'predictions': predictions})


@login_required
def profile(request):
    """User profile view and update."""
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully.")
            return redirect('profile')
        else:
            messages.error(request, "Please fix the errors below.")
    else:
        form = ProfileUpdateForm(instance=request.user)

    return render(request, 'crop_app/profile.html', {'form': form})


@login_required
def change_password(request):
    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password1 = request.POST.get('new_password1')
        new_password2 = request.POST.get('new_password2')

        if not request.user.check_password(old_password):
            messages.error(request, "Current password is incorrect.")
        elif new_password1 != new_password2:
            messages.error(request, "New passwords do not match.")
        elif len(new_password1) < 8:
            messages.error(request, "Password must be at least 8 characters.")
        else:
            request.user.set_password(new_password1)
            request.user.save()
            update_session_auth_hash(request, request.user)
            messages.success(request, "Password changed successfully.")
            return redirect('profile')

    return render(request, 'crop_app/change_password.html')


# ─── Admin Views ───────────────────────────────────────────────────────────────

@login_required
@user_passes_test(is_admin, login_url='dashboard')
def admin_dashboard(request):
    """Custom admin dashboard with stats."""
    total_users = CustomUser.objects.filter(is_staff=False).count()
    total_predictions = PredictionHistory.objects.count()

    # Predictions in last 7 days
    week_ago = timezone.now() - timedelta(days=7)
    recent_count = PredictionHistory.objects.filter(created_at__gte=week_ago).count()

    # Top 5 predicted crops
    top_crops = (
        PredictionHistory.objects
        .values('predicted_crop')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )

    # Latest 10 predictions
    latest_predictions = PredictionHistory.objects.select_related('user').order_by('-created_at')[:10]

    # All users
    all_users = CustomUser.objects.filter(is_staff=False).order_by('-date_joined')

    context = {
        'total_users': total_users,
        'total_predictions': total_predictions,
        'recent_count': recent_count,
        'top_crops': top_crops,
        'latest_predictions': latest_predictions,
        'all_users': all_users,
    }
    return render(request, 'crop_app/admin_dashboard.html', context)


@login_required
@user_passes_test(is_admin, login_url='dashboard')
def admin_user_detail(request, user_id):
    """Admin view for a specific user's predictions."""
    target_user = get_object_or_404(CustomUser, pk=user_id)
    predictions = PredictionHistory.objects.filter(user=target_user)
    return render(request, 'crop_app/admin_user_detail.html', {
        'target_user': target_user,
        'predictions': predictions
    })


@login_required
@user_passes_test(is_admin, login_url='dashboard')
def admin_all_predictions(request):
    """Admin view for all predictions."""
    predictions = PredictionHistory.objects.select_related('user').order_by('-created_at')
    return render(request, 'crop_app/admin_all_predictions.html', {'predictions': predictions})
