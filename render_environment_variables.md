# Render Frontend Environment Variables Configuration

## Environment Variables to Add in Render Dashboard

When deploying your React frontend to Render, add these environment variables in your Render service dashboard:

### Required Environment Variable

**Variable Name:** `REACT_APP_API_URL`  
**Variable Value:** `https://your-backend-service-name.onrender.com`

### Step-by-Step Instructions

1. **Go to your Render Dashboard**
   - Navigate to [render.com](https://render.com)
   - Log in to your account
   - Select your frontend service (React app)

2. **Access Environment Variables**
   - Click on your frontend service
   - Go to the "Environment" tab
   - Click "Add Environment Variable"

3. **Add the API URL Variable**
   ```
   Key: REACT_APP_API_URL
   Value: https://your-backend-service-name.onrender.com
   ```

### Finding Your Backend URL

Your backend URL on Render follows this pattern:
- `https://[SERVICE-NAME].onrender.com`

**Common Examples:**
- `https://lms-backend.onrender.com`
- `https://learning-management-system-api.onrender.com`
- `https://gift-lms-backend.onrender.com`

### How to Find Your Exact Backend URL

1. Go to your Render dashboard
2. Click on your backend service
3. Copy the URL shown at the top of the service page
4. Use this URL as the value for `REACT_APP_API_URL`

### Additional Optional Environment Variables

You may also want to add these for better configuration:

```
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
GENERATE_SOURCEMAP=false
```

### Complete Environment Variables List

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com` | Backend API endpoint |
| `REACT_APP_ENVIRONMENT` | `production` | Environment type |
| `REACT_APP_DEBUG` | `false` | Disable debug mode |
| `GENERATE_SOURCEMAP` | `false` | Disable source maps for smaller build |

### After Adding Variables

1. **Save the environment variables**
2. **Trigger a new deployment** (or wait for auto-deploy)
3. **Test the connection** once deployed

### Verification Steps

Once deployed with the new environment variables:

1. **Check the frontend logs** in Render dashboard
2. **Open browser developer tools** on your deployed frontend
3. **Try to login** - you should get proper authentication errors instead of connection refused
4. **Check network tab** - requests should go to your Render backend URL

### Troubleshooting

If you still get connection errors:

1. **Verify backend is running** - check your backend service status in Render
2. **Check backend URL** - ensure it's accessible and returns responses
3. **CORS configuration** - ensure your backend allows requests from your frontend domain
4. **SSL/HTTPS** - ensure your backend supports HTTPS (Render provides this automatically)

### Sample Backend CORS Configuration

Your Django backend should have CORS settings like:

```python
# In your Django settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-app.onrender.com",
    "http://localhost:3000",  # for local development
]

# Or for development (less secure):
CORS_ALLOW_ALL_ORIGINS = True
```

### Testing Locally with Render Backend

If you want to test locally against your Render backend, create a `.env.local` file:

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

This will override the default localhost setting for local testing.