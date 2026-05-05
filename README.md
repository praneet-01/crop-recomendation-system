# � AgriTech — AI-Powered Crop Recommendation System

> A full-stack web application that uses a trained Random Forest ML model to recommend the most suitable crop based on soil and climate parameters.

**Stack:** React 18 + Vite (frontend) · Django REST Framework + JWT (backend) · scikit-learn Random Forest (ML) · SQLite (database)

---

## 📁 Project Structure

```
AgriTech/
├── manage.py
├── requirements.txt
├── db.sqlite3                        ← auto-created after migrations
├── model_store/
│   └── model.pkl                     ← trained ML model
├── crop_project/                     ← Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── crop_app/                         ← Django app (models, ML utils)
│   ├── models.py                     ← CustomUser + PredictionHistory
│   ├── ml_utils.py                   ← ML model loading & prediction
│   └── migrations/
├── api/                              ← Django REST Framework API
│   ├── urls.py                       ← all /api/ routes
│   ├── permissions.py
│   ├── serializers/
│   │   ├── auth.py
│   │   ├── prediction.py
│   │   ├── profile.py
│   │   └── admin.py
│   └── views/
│       ├── auth.py
│       ├── prediction.py
│       ├── history.py
│       ├── profile.py
│       └── admin.py
└── frontend/                         ← React 18 + Vite SPA
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/                      ← Axios API functions
        ├── context/                  ← AuthContext (JWT state)
        ├── components/               ← Reusable UI components
        ├── pages/                    ← All page components
        └── styles/                   ← CSS Modules + design tokens
```

---

## ⚙️ Setup & Running

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

---

### Step 1 — Install Python dependencies

```bash
pip install -r requirements.txt
```

---

### Step 2 — Apply database migrations

```bash
python manage.py migrate
```

---

### Step 3 — Create an admin account

```bash
python manage.py createsuperuser
```

Enter a username, email, and password. Use this account to access the Admin Dashboard.

---

### Step 4 — Install frontend dependencies

```bash
cd frontend
npm install
```

---

### Step 5 — Run both servers

Open **two terminals**:

**Terminal 1 — Django backend** (run from project root):
```bash
python manage.py runserver
```
Backend runs at: http://127.0.0.1:8000

**Terminal 2 — React frontend** (run from `frontend/` folder):
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

---

### Step 6 — Open the app

Go to **http://localhost:5173** in your browser.

---

## 🌐 Pages

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page | Public |
| `/about` | About AgriTech | Public |
| `/contact` | Contact form | Public |
| `/login` | Sign in | Guest only |
| `/register` | Create account | Guest only |
| `/dashboard` | Crop prediction form + result | Required |
| `/history` | Past predictions | Required |
| `/profile` | Edit profile + change password | Required |
| `/admin` | Admin dashboard (stats, users) | Admin only |
| `/admin/predictions` | All predictions | Admin only |
| `/admin/users/:id` | User detail + history | Admin only |

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | None | Register new user |
| POST | `/api/auth/login/` | None | Login, returns JWT tokens |
| POST | `/api/auth/logout/` | Required | Blacklist refresh token |
| POST | `/api/auth/token/refresh/` | None | Refresh access token |
| POST | `/api/predict/` | Required | Run ML prediction |
| GET | `/api/history/` | Required | User's prediction history |
| GET | `/api/profile/` | Required | Get profile |
| PATCH | `/api/profile/` | Required | Update profile |
| POST | `/api/profile/change-password/` | Required | Change password |
| GET | `/api/admin/stats/` | Admin | Platform statistics |
| GET | `/api/admin/users/` | Admin | All users |
| GET | `/api/admin/users/<id>/` | Admin | User detail |
| GET | `/api/admin/predictions/` | Admin | All predictions |

---

## 🧪 Sample Prediction Values

Try these on the Dashboard after logging in:

| Crop | N | P | K | Temp | Humidity | pH | Rainfall |
|------|---|---|---|------|----------|----|----------|
| Rice | 90 | 42 | 43 | 20.8 | 82 | 6.5 | 202 |
| Maize | 77 | 52 | 17 | 22.6 | 82 | 6.0 | 100 |
| Coffee | 101 | 28 | 29 | 23.7 | 90 | 6.9 | 141 |
| Banana | 100 | 82 | 50 | 27.0 | 85 | 6.0 | 105 |
| Cotton | 118 | 33 | 30 | 23.0 | 80 | 6.5 | 80 |

---

## 🔧 Troubleshooting

**"Model file not found"**
→ Make sure `model.pkl` is in `model_store/model.pkl`

**"No module named django" or "No module named rest_framework"**
→ Run `pip install -r requirements.txt`

**"Table does not exist"**
→ Run `python manage.py migrate`

**CORS error in browser**
→ Make sure Django is running on port 8000 and React on port 5173

**Frontend shows blank page**
→ Make sure you ran `npm install` inside the `frontend/` folder first

---

## � Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios, CSS Modules |
| Backend | Django 4.2, Django REST Framework, SimpleJWT |
| ML Model | Random Forest (scikit-learn) |
| Database | SQLite |
| Auth | JWT (access + refresh tokens) |
| Fonts | Inter (Google Fonts) |
