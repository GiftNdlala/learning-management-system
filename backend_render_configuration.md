# Backend Django Configuration for Render

## Your Frontend API Endpoints Analysis

Based on your frontend code, your Django backend needs these endpoints:

### 🔍 **Critical Login Endpoint**
```
POST /api/accounts/login/
```

### 📋 **All Required API Endpoints**
```
POST /api/accounts/login/                           # Authentication
POST /api/accounts/register/student/                # Student registration
GET  /api/accounts/instructors/profile/             # Instructor profile
PATCH /api/accounts/instructors/profile/            # Update instructor profile
GET  /api/accounts/instructors/students/            # Get students
POST /api/accounts/instructors/add_student/         # Add student
DELETE /api/accounts/instructors/students/{id}/     # Delete student
GET  /api/accounts/instructors/assigned_modules/    # Get assigned modules
GET  /api/accounts/student/profile/                 # Student profile
```

## ✅ **Backend Configuration for Render**

### 1. **Environment Variables in Render Backend Dashboard**

Add these environment variables to your Django backend service on Render:

```bash
# Domain Configuration
ALLOWED_HOSTS=gas-learning-management-system.onrender.com,localhost,127.0.0.1

# Frontend Domain for CORS
FRONTEND_URL=https://gas-learning-management-system.onrender.com

# Database (if using external DB)
DATABASE_URL=your_database_url_here

# Django Settings
DEBUG=False
SECRET_KEY=your_secret_key_here

# Optional: If using different environment names
RENDER=True
PRODUCTION=True
```

### 2. **Django Settings Configuration (settings.py)**

```python
import os
from decouple import config

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

# Allowed hosts
ALLOWED_HOSTS = [
    'gas-learning-management-system.onrender.com',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',  # For Render internal communication
]

# If you want to read from environment variable:
# ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "https://gas-learning-management-system.onrender.com",
    "http://localhost:3000",  # For local development
]

# For development/testing (less secure - remove in production):
CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS', default=False, cast=bool)

# CORS Headers
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# If using CSRF
CSRF_TRUSTED_ORIGINS = [
    "https://gas-learning-management-system.onrender.com",
]
```

### 3. **URL Configuration (urls.py)**

Make sure your main `urls.py` includes the accounts API:

```python
# project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),  # Your accounts app
    path('api/modules/', include('modules.urls')),    # If you have modules
    path('api/assignments/', include('assignments.urls')),  # If you have assignments
    # Add other API paths as needed
]
```

### 4. **Accounts App URLs (accounts/urls.py)**

```python
# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('login/', views.LoginView.as_view(), name='login'),
    
    # Student endpoints
    path('register/student/', views.StudentRegistrationView.as_view(), name='student_register'),
    path('student/profile/', views.StudentProfileView.as_view(), name='student_profile'),
    
    # Instructor endpoints
    path('instructors/profile/', views.InstructorProfileView.as_view(), name='instructor_profile'),
    path('instructors/students/', views.InstructorStudentsView.as_view(), name='instructor_students'),
    path('instructors/add_student/', views.AddStudentView.as_view(), name='add_student'),
    path('instructors/students/<int:student_id>/', views.DeleteStudentView.as_view(), name='delete_student'),
    path('instructors/assigned_modules/', views.AssignedModulesView.as_view(), name='assigned_modules'),
]
```

### 5. **Required Django Packages**

Make sure you have these in your `requirements.txt`:

```txt
django
django-cors-headers
djangorestframework
python-decouple
psycopg2-binary  # If using PostgreSQL
dj-database-url  # For database URL parsing
```

### 6. **CORS Installation in Django**

In your `settings.py`, add to INSTALLED_APPS:

```python
INSTALLED_APPS = [
    'corsheaders',  # Add this
    'rest_framework',
    'accounts',  # Your app
    # ... other apps
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]
```

## 🔧 **Testing Your Backend Endpoints**

### Test the login endpoint specifically:

```bash
# Test if your backend is live
curl https://gas-learning-management-system.onrender.com/api/accounts/login/

# Should return a method not allowed (405) or options, NOT connection refused

# Test actual login
curl -X POST https://gas-learning-management-system.onrender.com/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass","role":"student"}'

# Should return authentication error (401/400), NOT connection refused
```

### CORS Test:

```bash
curl -H "Origin: https://gas-learning-management-system.onrender.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://gas-learning-management-system.onrender.com/api/accounts/login/
```

## 🚨 **Common Issues & Solutions**

### Issue 1: 404 Not Found
**Problem:** `/api/accounts/login/` returns 404
**Solution:** Check your URL routing in `urls.py`

### Issue 2: CORS Errors
**Problem:** CORS policy blocks requests
**Solution:** Verify `CORS_ALLOWED_ORIGINS` includes your frontend domain

### Issue 3: 500 Internal Server Error
**Problem:** Backend crashes on requests
**Solution:** Check Render logs and ensure all environment variables are set

### Issue 4: ALLOWED_HOSTS Error
**Problem:** "Invalid HTTP_HOST header"
**Solution:** Add your Render domain to `ALLOWED_HOSTS`

## ✅ **Verification Checklist**

- [ ] Backend service is running on Render
- [ ] Login endpoint `/api/accounts/login/` responds (even with 405/401)
- [ ] CORS headers are present in OPTIONS requests
- [ ] Frontend domain is in `CORS_ALLOWED_ORIGINS`
- [ ] `ALLOWED_HOSTS` includes your Render domain
- [ ] All required environment variables are set in Render dashboard

## 🔗 **Frontend Environment Variable**

Make sure your frontend has:
```
REACT_APP_API_URL=https://gas-learning-management-system.onrender.com
```

Once these configurations are in place, your login should work with proper authentication errors instead of connection refused errors.