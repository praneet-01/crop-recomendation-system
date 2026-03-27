# 🌱 CropSense — AI Crop Recommendation System
### Django + Scikit-learn + Bootstrap

---

## 📁 Project Structure

```
crop_project/
├── manage.py
├── requirements.txt
├── db.sqlite3                  ← auto-created after migrations
├── model_store/
│   └── model.pkl               ← ⚠️ PLACE YOUR MODEL HERE
├── crop_project/               ← Django project config
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── crop_app/                   ← Main application
│   ├── __init__.py
│   ├── admin.py
│   ├── forms.py
│   ├── ml_utils.py             ← ML model loading & prediction
│   ├── models.py               ← CustomUser + PredictionHistory
│   ├── urls.py
│   ├── views.py
│   ├── migrations/
│   └── templates/
│       └── crop_app/
│           ├── base.html
│           ├── landing.html
│           ├── signup.html
│           ├── login.html
│           ├── dashboard.html
│           ├── history.html
│           ├── profile.html
│           ├── change_password.html
│           ├── about.html
│           ├── contact.html
│           ├── admin_dashboard.html
│           ├── admin_user_detail.html
│           └── admin_all_predictions.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

---

## ⚙️ Setup Instructions (Step by Step)

### Step 1 — Clone / Download the Project

```bash
cd Desktop
# if using git:
git clone <your-repo-url> crop_project
cd crop_project
```

---

### Step 2 — Create a Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

---

### Step 3 — Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- Django 4.x
- scikit-learn
- pandas
- numpy
- Pillow

---

### Step 4 — Place Your Trained Model

Copy your trained `model.pkl` file into the `model_store/` folder:

```
crop_project/
└── model_store/
    └── model.pkl   ← paste it here
```

> ⚠️ If this file is missing, the prediction endpoint will show a clear error message.

---

### Step 5 — Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

This creates:
- `db.sqlite3` database
- All required tables (CustomUser, PredictionHistory, etc.)

---

### Step 6 — Create a Superuser (Admin)

```bash
python manage.py createsuperuser
```

Enter username, email, and password. This account can:
- Access the custom Admin Dashboard at `/admin-panel/`
- Access the Django Admin panel at `/admin/`

---

### Step 7 — Run the Development Server

```bash
python manage.py runserver
```

Open in browser: **http://127.0.0.1:8000**

---

## 🌐 Application URLs

| URL | Description |
|-----|-------------|
| `/` | Landing Page |
| `/signup/` | User Registration |
| `/login/` | User Login |
| `/logout/` | Logout |
| `/dashboard/` | Prediction Dashboard (auth required) |
| `/history/` | Prediction History (auth required) |
| `/profile/` | User Profile (auth required) |
| `/about/` | About Page |
| `/contact/` | Contact Page |
| `/admin-panel/` | Custom Admin Dashboard (staff only) |
| `/admin/` | Django Built-in Admin |

---

## 🧪 Testing the ML Integration

After logging in, go to the Dashboard and try these sample values:

**Rice:**
- N=90, P=42, K=43, Temp=20.8, Humidity=82, pH=6.5, Rainfall=202

**Maize:**
- N=77, P=52, K=17, Temp=22.6, Humidity=82, pH=6.0, Rainfall=100

**Coffee:**
- N=101, P=28, K=29, Temp=23.7, Humidity=90, pH=6.9, Rainfall=141

---

## 🔧 Troubleshooting

### "Model file not found"
→ Ensure `model.pkl` is in `crop_project/model_store/model.pkl`

### "No module named django"
→ Activate your virtual environment first: `venv\Scripts\activate` (Windows)

### "Table does not exist"
→ Run: `python manage.py migrate`

### Static files not loading
→ Run: `python manage.py collectstatic` (for production)
→ In development, make sure `DEBUG = True` in settings.py

### Model prediction gives wrong feature names warning
→ This is handled in `ml_utils.py` using a pandas DataFrame with named columns

---

## 📦 Exporting Model from Google Colab

If your model is still in Colab, download it with:

```python
import pickle
from google.colab import files

# Save the model
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Download it
files.download('model.pkl')
```

Then place `model.pkl` in the `model_store/` directory.

---

## 🚀 Future Enhancements

- Real-time weather API integration (OpenWeatherMap)
- Crop yield prediction module
- Fertilizer recommendation system
- Mobile-responsive PWA
- Multi-language support
- REST API with Django REST Framework
- Docker deployment

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript |
| Backend | Django 4.x (Python) |
| ML Model | Random Forest (Scikit-learn) |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Auth | Django Custom User Model |
| Fonts | Syne + DM Sans (Google Fonts) |

---

*Final Year B.E. Project — Crop Recommendation System*
