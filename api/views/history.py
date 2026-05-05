from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers.prediction import PredictionHistorySerializer
from crop_app.models import PredictionHistory


class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        predictions = PredictionHistory.objects.filter(user=request.user).order_by('-created_at')
        serializer = PredictionHistorySerializer(predictions, many=True)
        return Response(serializer.data)
