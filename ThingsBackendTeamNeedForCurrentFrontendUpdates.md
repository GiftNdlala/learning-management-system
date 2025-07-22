# Backend Updates Required for Frontend UI/UX Improvements

## Overview
The frontend has been significantly updated to match Blackboard's professional standard while maintaining the youthful GAS branding. This document outlines the backend changes needed to support these improvements.

## 1. API Response Format Updates

### User Authentication Response
The login system now expects enhanced user data for better dashboard personalization:

```json
{
  "access": "jwt_token",
  "refresh": "refresh_token",
  "user": {
    "id": 123,
    "first_name": "John",
    "last_name": "Doe",
    "email": "student@example.com",
    "student_id": "221106189",
    "profile_image": "url_to_image",
    "enrollment_date": "2023-01-15",
    "program": "Renewable Energy Technology",
    "role": "student"
  }
}
```

### Dashboard Statistics API
New endpoint needed: `GET /api/dashboard/stats/`

```json
{
  "enrolled_courses": 5,
  "active_modules": 8,
  "completed_modules": 12,
  "pending_assignments": 3,
  "recent_activities": [
    {
      "type": "module_completion",
      "title": "Solar Panel Installation",
      "date": "2024-01-15T10:30:00Z",
      "icon": "✅"
    }
  ]
}
```

### Enhanced Course/Module Data
Update course and module endpoints to include:

```json
{
  "id": 1,
  "title": "Solar Energy Fundamentals",
  "description": "Learn the basics of solar energy",
  "instructor_name": "Dr. Jane Smith",
  "instructor_image": "url_to_image",
  "progress": 75,
  "status": "active",
  "difficulty_level": "intermediate",
  "estimated_hours": 40,
  "tags": ["renewable", "solar", "energy"],
  "thumbnail": "url_to_thumbnail",
  "last_accessed": "2024-01-15T10:30:00Z"
}
```

## 2. New API Endpoints Required

### Dashboard Overview
- `GET /api/dashboard/overview/` - Main dashboard data
- `GET /api/dashboard/recent-modules/` - Recently accessed modules
- `GET /api/dashboard/quick-stats/` - Statistics for dashboard cards

### Enhanced Profile Management
- `GET /api/profile/academic-info/` - Academic information section
- `PUT /api/profile/academic-info/` - Update academic info (if allowed)
- `GET /api/profile/learning-progress/` - Overall learning progress

### Notification System
- `GET /api/notifications/` - All notifications
- `PUT /api/notifications/{id}/read/` - Mark as read
- `GET /api/notifications/unread-count/` - Unread count for badges

## 3. Database Schema Updates

### User Profile Enhancements
Add these fields to the user/profile model:
```sql
ALTER TABLE user_profiles ADD COLUMN profile_image VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN enrollment_date DATE;
ALTER TABLE user_profiles ADD COLUMN program VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN bio TEXT;
ALTER TABLE user_profiles ADD COLUMN learning_preferences JSON;
```

### Course/Module Progress Tracking
```sql
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    module_id INTEGER REFERENCES modules(id),
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT NOW(),
    completion_date TIMESTAMP NULL,
    time_spent INTEGER DEFAULT 0
);
```

### Activity Tracking
```sql
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR(50),
    related_object_id INTEGER,
    related_object_type VARCHAR(50),
    title VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. Performance Optimizations

### Caching Strategy
Implement caching for:
- Dashboard statistics (cache for 15 minutes)
- User progress data (cache for 5 minutes)
- Course/module thumbnails (cache for 1 hour)
- Navigation menu data (cache for 30 minutes)

### Database Indexing
Add indexes for:
```sql
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_progress_last_accessed ON user_progress(last_accessed);
```

## 5. File Upload Enhancements

### Profile Images
- Support for profile image uploads
- Image resizing and optimization (recommended: 200x200px thumbnails)
- CDN integration for faster loading

### Course/Module Thumbnails
- Bulk thumbnail generation for existing content
- Automatic thumbnail creation for new content
- Multiple sizes: 400x300 (card), 800x600 (detail view)

## 6. Security Considerations

### Enhanced Authentication
- Implement proper CORS headers for the new login design
- Add rate limiting for login attempts
- Session management improvements for better UX

### Data Privacy
- Ensure profile image uploads are properly validated
- Implement proper access controls for enhanced user data
- Add audit logging for profile changes

## Priority Order

1. **High Priority** (Week 1-2):
   - Enhanced login response format
   - Dashboard statistics API
   - Database schema updates
   - Basic progress tracking

2. **Medium Priority** (Week 3-4):
   - File upload functionality
   - Caching implementation
   - Performance optimizations
   - Enhanced profile APIs

3. **Low Priority** (Week 5-6):
   - Advanced analytics
   - CDN integration
   - Performance monitoring
   - Documentation updates

## Notes

- All new APIs should follow RESTful conventions
- Implement proper pagination for list endpoints
- Use appropriate HTTP status codes
- Include comprehensive error messages for frontend error handling
- Consider backward compatibility for any existing API changes
- Test thoroughly in staging environment before production deployment

## Contact

For any questions or clarifications about these requirements, please reach out to the frontend development team.
