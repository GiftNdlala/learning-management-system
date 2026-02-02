import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Skip adding token in demo mode
    if (process.env.REACT_APP_DEMO_MODE !== 'true' && localStorage.getItem('demo_mode') !== 'true') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, logout the user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('role_data');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Error handling function
const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    throw new Error('No response received from server');
  } else {
    throw new Error('Error setting up request');
  }
};

// Fetches a list of students from the Django backend using a GET request.
// The function returns a promise that resolves to the JSON response.
// If the request fails, it logs an error to the console.
/*export const fetchStudents = () => {
    return fetch("http://localhost:8000/api/modules/instructor/modules/1/students/")
        .then(response => response.json())
        .catch(error => console.error("Error:", error));
};*/


// Module Management Functions
export const getModules = async () => {
  try {
    const response = await api.get('/api/courses/modules/');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getModuleById = async (moduleId) => {
  try {
    const response = await api.get(`/api/courses/modules/${moduleId}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createModule = async (moduleData) => {
  try {
    const response = await api.post('/api/courses/modules/', moduleData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateModule = async (moduleId, moduleData) => {
  try {
    const response = await api.put(`/api/courses/modules/${moduleId}/`, moduleData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteModule = async (moduleId) => {
  try {
    await api.delete(`/api/courses/modules/${moduleId}/`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getModuleStudents = async (moduleId) => {
  try {
    const response = await api.get(`/api/courses/modules/${moduleId}/students/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateModuleStudents = async (moduleId, studentIds) => {
  try {
    const response = await api.put(`/api/courses/modules/${moduleId}/students/`, {
      student_ids: studentIds
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getModuleContent = async (moduleId) => {
  try {
    const response = await api.get(`/api/courses/modules/${moduleId}/content/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateModuleContent = async (moduleId, contentData) => {
  try {
    const response = await api.put(`/api/courses/modules/${moduleId}/content/`, contentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Quiz Management Functions
export const quizzes = {
  // Instructor endpoints
  getModuleQuizzes: async (moduleId) => {
    try {
      const response = await api.get(`/api/modules/modules/${moduleId}/quizzes/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching module quizzes:', error);
      throw error;
    }
  },

  createQuiz: async (moduleId, quizData) => {
    try {
      const response = await api.post(`/api/modules/modules/${moduleId}/quizzes/create/`, quizData);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  addQuizQuestion: async (quizId, questionData) => {
    try {
      const response = await api.post(`/api/modules/quizzes/${quizId}/questions/`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error adding quiz question:', error);
      throw error;
    }
  },

  publishQuiz: async (quizId) => {
    try {
      const response = await api.post(`/api/modules/quizzes/${quizId}/publish/`);
      return response.data;
    } catch (error) {
      console.error('Error publishing quiz:', error);
      throw error;
    }
  },

  // Student endpoints
  getStudentQuizzes: async (moduleId) => {
    try {
      const response = await api.get(`/api/modules/student/modules/${moduleId}/quizzes/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student quizzes:', error);
      throw error;
    }
  },

  startQuizAttempt: async (quizId) => {
    try {
      const response = await api.post(`/api/modules/quizzes/${quizId}/attempt/`);
      return response.data;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      throw error;
    }
  },

  submitQuizAttempt: async (attemptId, answers) => {
    try {
      const response = await api.post(`/api/modules/quiz-attempts/${attemptId}/submit/`, { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      throw error;
    }
  },

  getQuizQuestions: async (quizId) => {
    try {
      const response = await api.get(`/api/modules/quizzes/${quizId}/get-questions/`);
      return response.data;
    } catch (error) {
      console.error('Error getting quiz questions:', error);
      throw error;
    }
  }
};

// Export API objects

export const instructor = {
  addStudent: (data) => api.post('/api/accounts/instructors/add_student/', data),
  getProfile: () => api.get('/api/accounts/instructors/profile/'),
  getStudents: () => api.get('/api/accounts/instructors/students/'),
  deleteStudent: (studentId) => api.delete(`/api/accounts/instructors/students/${studentId}/`),
  getModules: () => api.get('/api/modules/instructor/modules/'),
  getModule: (id) => api.get(`/api/modules/instructor/modules/${id}/`),
  createModule: (data) => api.post('/api/modules/instructor/modules/', data),
  updateModule: (id, data) => api.put(`/api/modules/instructor/modules/${id}/`, data),
  deleteModule: (id) => api.delete(`/api/modules/instructor/modules/${id}/`),
  getModuleContent: (moduleId) => api.get(`/api/modules/instructor/modules/${moduleId}/content/`),
  addModuleContent: (moduleId, data) => api.post(`/api/modules/instructor/modules/${moduleId}/content/`, data),
  updateModuleContent: (moduleId, contentId, data) => 
    api.put(`/api/modules/instructor/modules/${moduleId}/content/${contentId}/`, data),
  deleteModuleContent: (moduleId, contentId) => 
    api.delete(`/api/modules/instructor/modules/${moduleId}/content/${contentId}/`),
};

export const courses = {
  list: () => {
    if (process.env.REACT_APP_DEMO_MODE === 'true' || localStorage.getItem('demo_mode') === 'true') {
      return Promise.resolve({
        data: [
          { id: 1, title: 'Introduction to Business', description: 'Learn the basics of business.' },
          { id: 2, title: 'Advanced Entrepreneurship', description: 'Deep dive into entrepreneurship.' }
        ]
      });
    }
    return api.get('/api/courses/');
  },
  getEnrolledCourses: () => api.get('/api/courses/enrolled/'),
  getCourse: (id) => api.get(`/api/courses/${id}/`),
  enroll: (courseId) => api.post(`/api/courses/${courseId}/enroll/`),
  unenroll: (courseId) => api.post(`/api/courses/${courseId}/unenroll/`),
  getModules: (courseId) => api.get(`/api/courses/${courseId}/modules/`),
  getModule: (courseId, moduleId) => api.get(`/api/courses/${courseId}/modules/${moduleId}/`),
  completeModule: (courseId, moduleId) => api.post(`/api/courses/${courseId}/modules/${moduleId}/complete/`),
  getProgress: (courseId) => api.get(`/api/courses/${courseId}/progress/`),
  getRecentModules: () => {
    if (process.env.REACT_APP_DEMO_MODE === 'true' || localStorage.getItem('demo_mode') === 'true') {
      return Promise.resolve({
        data: [
          { id: 1, title: 'Module 1: Basics', description: 'Basic concepts.' },
          { id: 2, title: 'Module 2: Advanced', description: 'Advanced topics.' }
        ]
      });
    }
    return api.get('/api/courses/recent-modules/');
  },
};

export const assignments = {
  list: (courseId) => api.get(`/api/courses/${courseId}/assignments/`),
  get: (courseId, assignmentId) => api.get(`/api/courses/${courseId}/assignments/${assignmentId}/`),
  submit: (courseId, assignmentId, data) => 
    api.post(`/api/courses/${courseId}/assignments/${assignmentId}/submit/`, data),
  getSubmissions: (courseId, assignmentId) => 
    api.get(`/api/courses/${courseId}/assignments/${assignmentId}/submissions/`),
};

export const grades = {
  getCourseGrades: (courseId) => api.get(`/api/courses/${courseId}/grades/`),
  getAssignmentGrade: (courseId, assignmentId) => 
    api.get(`/api/courses/${courseId}/assignments/${assignmentId}/grade/`),
  getAllGrades: () => api.get('/api/grades/'),
};

export const auth = {
  login: (credentials) => {
    if (process.env.REACT_APP_DEMO_MODE === 'true' || localStorage.getItem('demo_mode') === 'true') {
      // Mock login response for demo
      return Promise.resolve({
        data: {
          access: 'demo_access_token',
          refresh: 'demo_refresh_token',
          user: {
            id: 1,
            first_name: 'Demo',
            last_name: 'User',
            email: credentials.email || 'demo@example.com'
          },
          role_data: { role: credentials.role || 'student' }
        }
      });
    }
    return api.post('/api/auth/login/', credentials);
  },
  getCurrentUser: () => {
    const demoMode = process.env.REACT_APP_DEMO_MODE === 'true' || localStorage.getItem('demo_mode');
    if (demoMode) {
      let role = 'student';
      let name = 'Student';
      if (demoMode === 'instructor') {
        role = 'instructor';
        name = 'Instructor';
      }
      return Promise.resolve({
        data: {
          id: 1,
          first_name: 'Demo',
          last_name: name,
          email: 'demo@example.com',
          role: role
        }
      });
    }
    return api.get('/api/auth/user/');
  },
  register: (userData) => api.post('/api/auth/register/', userData),
  logout: () => api.post('/api/auth/logout/'),
};

// Default export for backward compatibility
export default api; 