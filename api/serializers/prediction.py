from rest_framework import serializers

from crop_app.models import PredictionHistory


class PredictionInputSerializer(serializers.Serializer):
    nitrogen = serializers.FloatField(min_value=0)
    phosphorus = serializers.FloatField(min_value=0)
    potassium = serializers.FloatField(min_value=0)
    temperature = serializers.FloatField()
    humidity = serializers.FloatField(min_value=0, max_value=100)
    ph = serializers.FloatField(min_value=0, max_value=14)
    rainfall = serializers.FloatField(min_value=0)


class PredictionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionHistory
        fields = [
            'id', 'nitrogen', 'phosphorus', 'potassium',
            'temperature', 'humidity', 'ph', 'rainfall',
            'predicted_crop', 'created_at',
        ]
        read_only_fields = fields
