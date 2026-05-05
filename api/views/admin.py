from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView

from api.permissions import IsAdminUser
from api.serializers.admin import AdminStatsSerializer, AdminUserSerializer, AdminPredictionSerializer
from api.serializers.prediction import PredictionHistorySerializer
from api.serializers.profile import ProfileSerializer
from crop_app.models import CustomUser, PredictionHistory


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        week_ago = timezone.now() - timedelta(days=7)
        top_crops = list(
            PredictionHistory.objects
            .values('predicted_crop')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
            .values('predicted_crop', 'count')
        )
        # Rename key for consistent API shape
        top_crops_formatted = [{'crop': c['predicted_crop'], 'count': c['count']} for c in top_crops]

        data = {
            'total_users': CustomUser.objects.filter(is_staff=False).count(),
            'total_predictions': PredictionHistory.objects.count(),
            'predictions_last_7_days': PredictionHistory.objects.filter(created_at__gte=week_ago).count(),
            'top_crops': top_crops_formatted,
        }
        return Response(data)


class AdminPredictionsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        predictions = PredictionHistory.objects.select_related('user').order_by('-created_at')
        serializer = AdminPredictionSerializer(predictions, many=True)
        return Response(serializer.data)


class AdminUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = (
            CustomUser.objects
            .filter(is_staff=False)
            .annotate(prediction_count=Count('predictions'))
            .order_by('-date_joined')
        )
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)


class AdminUserDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=404)

        predictions = PredictionHistory.objects.filter(user=user).order_by('-created_at')
        return Response({
            'user': ProfileSerializer(user).data,
            'predictions': PredictionHistorySerializer(predictions, many=True).data,
        })
