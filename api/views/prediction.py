from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers.prediction import PredictionInputSerializer, PredictionHistorySerializer
from crop_app.ml_utils import predict_crop
from crop_app.models import PredictionHistory


class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
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
        except FileNotFoundError as e:
            return Response(
                {'detail': f'Model file not found: {e}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            return Response(
                {'detail': 'Prediction engine error. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Save prediction record only after successful prediction
        record = PredictionHistory.objects.create(
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

        return Response({
            'crop': result['crop'],
            'crop_display': result['crop_display'],
            'emoji': result['emoji'],
            'description': result['description'],
            'record_id': record.id,
        }, status=status.HTTP_200_OK)
