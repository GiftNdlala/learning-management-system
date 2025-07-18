# Login Error Analysis: ERR_CONNECTION_REFUSED

## Problem Summary

You're experiencing a **network connection error** (`ERR_CONNECTION_REFUSED`) when attempting to log in, instead of the expected "invalid credentials" error. The error occurs when the frontend tries to make a POST request to `http://localhost:8000/api/accounts/login/`.

## Root Cause

**The backend server is not running on port 8000.** This is confirmed by:

1. **Error Type**: `ERR_CONNECTION_REFUSED` indicates the browser cannot establish a connection to the server
2. **Port Check**: Verification shows port 8000 is not in use
3. **Missing Backend**: No backend server processes are currently running

## Technical Details

### Frontend Configuration
- **Base URL**: `http://localhost:8000` (from `src/services/api.js`)
- **Login Endpoint**: `/api/accounts/login/`
- **Expected Response**: Should return `access`, `refresh`, `user`, and `role_data`

### Error Flow
1. User submits login form with credentials: `{email: 'ndlalagift14@gmail.com', password: 'ghiuoijouhiyguh', role: 'student'}`
2. Frontend calls `auth.login()` function in `src/services/api.js:258`
3. Axios attempts POST to `http://localhost:8000/api/accounts/login/`
4. Connection fails because no server is listening on port 8000
5. Browser throws `ERR_CONNECTION_REFUSED` error

## Solutions

### 1. **Start the Backend Server (Primary Solution)**

You need to start your backend server. Based on the API structure, this appears to be a Django backend:

```bash
# If you have a separate backend directory, navigate to it
cd ../backend  # or wherever your Django project is located

# Start the Django development server
python manage.py runserver 8000
```

### 2. **Check for Backend Code**

If you don't have the backend code locally:
- Check if there's a separate repository for the backend
- Look for a `backend/` directory in your project root
- Check if the backend is containerized (look for `docker-compose.yml`)

### 3. **Environment Configuration**

If the backend is running on a different port or URL:

```bash
# Set the correct API URL as an environment variable
export REACT_APP_API_URL=http://localhost:YOUR_ACTUAL_PORT

# Or create a .env file in your React app root:
echo "REACT_APP_API_URL=http://localhost:YOUR_ACTUAL_PORT" > .env
```

### 4. **Docker Setup (if applicable)**

If using Docker:
```bash
# Look for docker-compose.yml and start services
docker-compose up -d

# Or start individual containers
docker run -p 8000:8000 your-backend-image
```

### 5. **Development Setup**

If you need to set up the backend from scratch, you'll need:
- Django project with appropriate apps
- Database configuration
- CORS settings to allow frontend requests
- Authentication endpoints

## Verification Steps

After starting the backend:

1. **Check if server is running**:
   ```bash
   curl http://localhost:8000/api/accounts/login/
   # Should return a method not allowed error (since we're using GET instead of POST)
   ```

2. **Test login endpoint**:
   ```bash
   curl -X POST http://localhost:8000/api/accounts/login/ \
     -H "Content-Type: application/json" \
     -d '{"email":"test@email.com","password":"testpass","role":"student"}'
   ```

3. **Check React app**:
   - Try logging in again
   - Should now get proper validation errors instead of connection errors

## Expected Behavior After Fix

Once the backend is running:
- Invalid credentials should return HTTP 401 with "Invalid email or password"
- Valid credentials should return HTTP 200 with tokens and user data
- No more `ERR_CONNECTION_REFUSED` errors

## Additional Notes

- The frontend is properly configured and the error handling logic is correct
- The issue is purely infrastructure-related (missing backend server)
- All API calls in the codebase point to `localhost:8000`, so ensure your backend runs on this port
- Consider adding a health check endpoint (`/api/health/`) for easier debugging in the future