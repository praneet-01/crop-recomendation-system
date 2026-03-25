"""
ML Utility module for loading the trained model and making predictions.
Handles model loading with caching to avoid repeated disk reads.
"""
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from django.conf import settings

# Module-level cache — model loaded once, reused for all requests
_model_cache = None

# Crop emoji mapping for better UX
CROP_EMOJIS = {
    'rice': '🌾', 'maize': '🌽', 'chickpea': '🫘', 'kidneybeans': '🫘',
    'pigeonpeas': '🌿', 'mothbeans': '🌿', 'mungbean': '🌿', 'blackgram': '🌿',
    'lentil': '🌿', 'pomegranate': '🍎', 'banana': '🍌', 'mango': '🥭',
    'grapes': '🍇', 'watermelon': '🍉', 'muskmelon': '🍈', 'apple': '🍎',
    'orange': '🍊', 'papaya': '🍈', 'coconut': '🥥', 'cotton': '🌸',
    'jute': '🌿', 'coffee': '☕',
}

# Crop descriptions
CROP_INFO = {
    'rice': 'Staple food crop ideal for high humidity and warm climates.',
    'maize': 'Versatile cereal crop widely grown across tropical regions.',
    'chickpea': 'Protein-rich legume suited for semi-arid conditions.',
    'kidneybeans': 'Nutritious legume needing moderate rainfall and warm temperatures.',
    'pigeonpeas': 'Drought-resistant legume popular in tropical regions.',
    'mothbeans': 'Hardy legume that thrives in dry, arid conditions.',
    'mungbean': 'Fast-growing legume well-suited for warm, humid climates.',
    'blackgram': 'High-protein legume cultivated in tropical and subtropical regions.',
    'lentil': 'Cool-season legume rich in protein and fiber.',
    'pomegranate': 'Fruit crop thriving in semi-arid, warm climates.',
    'banana': 'Tropical fruit requiring warm temperatures and high humidity.',
    'mango': 'Tropical fruit tree needing well-drained soil and warm weather.',
    'grapes': 'Vine fruit ideal for moderate climates with low humidity.',
    'watermelon': 'Summer fruit crop needing warm soil and plenty of sunshine.',
    'muskmelon': 'Sweet melon requiring warm, dry conditions.',
    'apple': 'Temperate fruit needing cool winters for proper fruiting.',
    'orange': 'Citrus fruit thriving in subtropical climates.',
    'papaya': 'Tropical fruit growing best in warm, humid conditions.',
    'coconut': 'Tropical palm producing fruits in coastal, humid regions.',
    'cotton': 'Industrial fiber crop needing warm climate and well-drained soil.',
    'jute': 'Natural fiber crop thriving in warm, humid conditions.',
    'coffee': 'Beverage crop requiring tropical highland conditions.',
}


def load_model():
    """Load the ML model from disk with caching."""
    global _model_cache
    if _model_cache is None:
        model_path = settings.MODEL_PATH
        if not Path(model_path).exists():
            raise FileNotFoundError(
                f"Model file not found at: {model_path}\n"
                "Please place your model.pkl file in the model_store/ directory."
            )
        with open(model_path, 'rb') as f:
            _model_cache = pickle.load(f)
    return _model_cache


def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    """
    Make a crop prediction using the loaded model.
    
    Args:
        N: Nitrogen content
        P: Phosphorus content
        K: Potassium content
        temperature: Temperature in Celsius
        humidity: Relative humidity (%)
        ph: pH value of soil
        rainfall: Rainfall in mm
    
    Returns:
        dict with 'crop', 'emoji', 'description' keys
    """
    model = load_model()

    # Build input as DataFrame to preserve feature names (avoids sklearn warnings)
    input_df = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    )

    prediction = model.predict(input_df)[0]
    crop_name = str(prediction).lower().strip()

    return {
        'crop': prediction,
        'crop_display': prediction.capitalize(),
        'emoji': CROP_EMOJIS.get(crop_name, '🌱'),
        'description': CROP_INFO.get(crop_name, 'A suitable crop for your soil and climate conditions.'),
    }
