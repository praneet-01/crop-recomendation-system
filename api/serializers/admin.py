from rest_framework import serializers

from crop_app.models import CustomUser, PredictionHistory


class AdminStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_predictions = serializers.IntegerField()
    predictions_last_7_days = serializers.IntegerField()
    top_crops = serializers.ListField(child=serializers.DictField())


class AdminUserSerializer(serializers.ModelSerializer):
    prediction_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'prediction_count']
        read_only_fields = fields


class AdminPredictionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = PredictionHistory
        fields = [
            'id', 'username', 'email',
            'nitrogen', 'phosphorus', 'potassium',
            'temperature', 'humidity', 'ph', 'rainfall',
            'predicted_crop', 'created_at',
        ]
        read_only_fields = fields
