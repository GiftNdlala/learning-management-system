# Frontend-Backend Connection Verification Guide

## Current Status Check

✅ **Workspace**: Located at `/workspace` (React frontend)  
❌ **Backend**: Not running on port 8000  
❌ **Frontend**: Not running on port 3000  

## Step-by-Step Verification Process

### 1. Start the Frontend (React App)

```bash
# In the current directory (/workspace)
npm install  # Install dependencies if needed
npm start    # Start React development server
```

**Expected Result**: React app should start on `http://localhost:3000`

### 2. Start the Backend Server

You need to locate and start your backend. Try these options:

**Option A: If backend is in a separate directory**
```bash
# Look for backend directory
find . -name "manage.py" -o -name "requirements.txt" -o -name "Pipfile" 2>/dev/null
cd ../backend  # or wherever your Django project is
python manage.py runserver 8000
```

**Option B: If using Docker**
```bash
# Look for Docker files
ls -la | grep -i docker
docker-compose up -d  # if docker-compose.yml exists
```

**Option C: If backend is in current project**
```bash
# Search for Python backend files
find . -name "*.py" | grep -E "(manage|wsgi|asgi|settings)" | head -10
```

### 3. Connection Tests

Once both servers are running, use these tests:

#### Test 1: Basic Backend Health Check
```bash
curl -v http://localhost:8000/
```
**Expected**: Any response (even 404) means the server is running

#### Test 2: API Endpoint Test
```bash
curl -v http://localhost:8000/api/
```
**Expected**: Should return API structure or 404 (but not connection refused)

#### Test 3: Login Endpoint Test (GET - will fail but shows endpoint exists)
```bash
curl -v http://localhost:8000/api/accounts/login/
```
**Expected**: Method not allowed (405) or similar, NOT connection refused

#### Test 4: Login Endpoint Test (POST with dummy data)
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test","role":"student"}' \
  -v
```
**Expected**: Authentication error (401/400), NOT connection refused

#### Test 5: Frontend-Backend Integration
```bash
# Check if frontend can reach backend (from browser console)
fetch('http://localhost:8000/api/')
  .then(response => console.log('Backend reachable:', response.status))
  .catch(error => console.log('Backend error:', error.message));
```

### 4. CORS Verification

If backend is running but frontend can't connect, check CORS settings:

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8000/api/accounts/login/ \
     -v
```

**Expected CORS Headers**:
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: POST, GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Troubleshooting Common Issues

### Issue 1: Backend Not Found
**Symptoms**: Can't find `manage.py` or backend files  
**Solution**: Backend might be in a separate repository or not cloned yet

### Issue 2: Port Already in Use
**Symptoms**: `Address already in use` error  
**Solution**: 
```bash
# Find what's using the port
lsof -i :8000
# Kill the process if needed
kill -9 <PID>
```

### Issue 3: CORS Errors
**Symptoms**: Frontend loads but API calls fail with CORS errors  
**Solution**: Configure Django CORS settings in backend

### Issue 4: Environment Variables
**Symptoms**: Wrong API URL being used  
**Solution**: Check and set environment variables:
```bash
# In React app directory
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

## Environment Variables Check

Current frontend configuration:
- **Default Base URL**: `http://localhost:8000` (from `src/services/api.js`)
- **Environment Override**: `process.env.REACT_APP_API_URL`

## Quick Verification Commands

Run these commands in sequence:

```bash
# 1. Check if ports are free
echo "Checking ports..."
lsof -i :3000 && echo "Port 3000 in use" || echo "Port 3000 free"
lsof -i :8000 && echo "Port 8000 in use" || echo "Port 8000 free"

# 2. Start frontend (in one terminal)
npm start

# 3. Test backend connection (in another terminal)
curl http://localhost:8000/api/ || echo "Backend not reachable"

# 4. Test frontend access
curl http://localhost:3000/ || echo "Frontend not reachable"
```

## Success Indicators

✅ **Frontend Running**: React app loads at `http://localhost:3000`  
✅ **Backend Running**: API responds at `http://localhost:8000`  
✅ **API Endpoints**: Login endpoint returns proper HTTP errors (not connection refused)  
✅ **CORS Configured**: Cross-origin requests work from frontend to backend  
✅ **Authentication Flow**: Login attempts return validation errors instead of network errors  

## Next Steps After Verification

Once connection is verified:
1. Test actual login with valid credentials
2. Verify token storage and retrieval
3. Test protected API endpoints
4. Check user session management

---

**Note**: Save this verification process for future debugging. The main goal is to change the error from "ERR_CONNECTION_REFUSED" to proper authentication errors like "Invalid credentials".