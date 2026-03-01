import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    console.error('❌ [API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ [API] Response Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Handle token expiration (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Attempt to refresh token
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          if (response.data.token) {
            // Store new tokens
            localStorage.setItem('token', response.data.token);
            if (response.data.refreshToken) {
              localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            // Update authorization header
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            
            // Retry original request
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - redirect to login
          localStorage.clear();
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - redirect to login
        localStorage.clear();
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    }

    // Handle forbidden (403)
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }

    // Handle not found (404)
    if (error.response?.status === 404) {
      toast.error('Resource not found');
    }

    // Handle validation errors (422)
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      if (errors) {
        Object.values(errors).forEach((errorMessages) => {
          errorMessages.forEach((message) => {
            toast.error(message);
          });
        });
      }
    }

    // Handle server errors (500)
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// ============ MOCK DATA ============

const MOCK_COMPLAINTS = [
  { id: 'CMP001', title: 'Broken AC in Lab 101', description: 'The air conditioner in computer lab 101 is not working.', category: 'Facilities', status: 'pending', priority: 'high', department: 'Maintenance', createdAt: '2026-02-25T08:00:00Z', deadline: '2026-03-05T08:00:00Z', assignedAt: '2026-02-25T10:00:00Z', studentId: 'mock-student', studentName: 'Abebe Kebede', assignedTo: 'mock-staff' },
  { id: 'CMP002', title: 'Internet connectivity issue', description: 'Wi-Fi keeps disconnecting in the library.', category: 'IT', status: 'in_progress', priority: 'medium', department: 'IT', createdAt: '2026-02-26T10:00:00Z', deadline: '2026-03-06T10:00:00Z', assignedAt: '2026-02-26T12:00:00Z', studentId: 'mock-student', studentName: 'Sara Hailu', assignedTo: 'mock-staff' },
  { id: 'CMP003', title: 'Projector not working in Room 205', description: 'The projector has a burnt bulb.', category: 'Equipment', status: 'resolved', priority: 'low', department: 'IT', createdAt: '2026-02-20T09:00:00Z', deadline: '2026-02-28T09:00:00Z', assignedAt: '2026-02-20T11:00:00Z', resolvedAt: '2026-02-27T15:00:00Z', studentId: 'mock-student', studentName: 'Dawit Alemu', assignedTo: 'mock-staff' },
  { id: 'CMP004', title: 'Water leakage in dormitory', description: 'Water is leaking from the ceiling in Block C Room 312.', category: 'Facilities', status: 'pending', priority: 'urgent', department: 'Maintenance', createdAt: '2026-02-28T14:00:00Z', deadline: '2026-03-02T14:00:00Z', assignedAt: '2026-02-28T15:00:00Z', studentId: 'mock-student', studentName: 'Hana Girma', assignedTo: 'mock-staff' },
  { id: 'CMP005', title: 'Cafeteria hygiene complaint', description: 'Food serving area is not properly cleaned.', category: 'Cafeteria', status: 'closed', priority: 'medium', department: 'Student Affairs', createdAt: '2026-02-15T11:00:00Z', deadline: '2026-02-22T11:00:00Z', assignedAt: '2026-02-15T14:00:00Z', resolvedAt: '2026-02-21T09:00:00Z', studentId: 'mock-student', studentName: 'Liya Teshome', assignedTo: 'mock-staff' },
  { id: 'CMP006', title: 'Missing library books', description: 'Several reference books missing from shelf B3.', category: 'Library', status: 'in_progress', priority: 'low', department: 'Library', createdAt: '2026-02-27T13:00:00Z', deadline: '2026-03-07T13:00:00Z', assignedAt: '2026-02-27T16:00:00Z', studentId: 'mock-student', studentName: 'Yonas Bekele', assignedTo: 'mock-staff' },
];

const MOCK_USERS = [
  { id: 'u1', name: 'Abebe Kebede', email: 'abebe@astu.edu.et', role: 'student', department: 'Computer Science', joinedDate: '2025-09-01', status: 'active' },
  { id: 'u2', name: 'Sara Hailu', email: 'sara@astu.edu.et', role: 'student', department: 'Engineering', joinedDate: '2025-09-01', status: 'active' },
  { id: 'u3', name: 'Tekle Berhan', email: 'tekle@astu.edu.et', role: 'staff', department: 'IT', joinedDate: '2024-01-15', status: 'active' },
  { id: 'u4', name: 'Meron Tadesse', email: 'meron@astu.edu.et', role: 'staff', department: 'Maintenance', joinedDate: '2024-03-10', status: 'active' },
  { id: 'u5', name: 'Admin User', email: 'admin@astu.edu.et', role: 'admin', department: 'Administration', joinedDate: '2023-06-01', status: 'active' },
];

const VALID_ACCOUNTS = [
  { email: 'student@astu.edu.et', password: 'Student123', role: 'student', name: 'Abebe Kebede', id: 'u1' },
  { email: 'staff@astu.edu.et', password: 'Staff123', role: 'staff', name: 'Tekle Berhan', id: 'u3' },
  { email: 'admin@astu.edu.et', password: 'Admin123', role: 'admin', name: 'Admin User', id: 'u5' },
];

function getMockLoginResponse(credentials) {
  const email = (credentials?.email || '').toLowerCase().trim();
  const password = credentials?.password || '';

  // Check registered users from localStorage
  let registeredAccounts = [];
  try {
    const stored = localStorage.getItem('registeredUsers');
    if (stored) {
      const users = JSON.parse(stored);
      if (Array.isArray(users)) {
        registeredAccounts = users.map(u => ({
          email: (u.email || '').toLowerCase(),
          password: u.password || 'Password123',
          role: u.role || 'student',
          name: u.name || 'User',
          id: u.id || 'reg-' + Date.now(),
        }));
      }
    }
  } catch (_) {}

  const allAccounts = [...VALID_ACCOUNTS, ...registeredAccounts];
  const match = allAccounts.find(a => a.email === email && a.password === password);

  if (!match) {
    throw new Error('Invalid email or password. Please check your credentials and try again.');
  }

  return {
    token: 'mock-jwt-' + Math.random().toString(36).slice(2),
    refreshToken: 'mock-refresh-' + Math.random().toString(36).slice(2),
    user: { id: match.id, name: match.name, email: match.email, role: match.role },
  };
}

const MOCK_DEPARTMENTS = [
  { id: 'd1', name: 'Computer Science', code: 'CS', description: 'Department of Computer Science', headOfDepartment: 'Dr. Alemayehu', email: 'cs@astu.edu.et', phone: '+251-22-111-0101', location: 'Block A', staffCount: 15, isActive: true },
  { id: 'd2', name: 'Maintenance', code: 'MNT', description: 'Facilities maintenance department', headOfDepartment: 'Ato Bekele', email: 'maintenance@astu.edu.et', phone: '+251-22-111-0102', location: 'Block B', staffCount: 22, isActive: true },
  { id: 'd3', name: 'IT Services', code: 'IT', description: 'Information Technology department', headOfDepartment: 'Dr. Chaltu', email: 'it@astu.edu.et', phone: '+251-22-111-0103', location: 'Block C', staffCount: 10, isActive: true },
  { id: 'd4', name: 'Library', code: 'LIB', description: 'University Library', headOfDepartment: 'Ato Daniel', email: 'library@astu.edu.et', phone: '+251-22-111-0104', location: 'Library Building', staffCount: 8, isActive: true },
  { id: 'd5', name: 'Student Affairs', code: 'SA', description: 'Student affairs and welfare', headOfDepartment: 'W/ro Firehiwot', email: 'studentaffairs@astu.edu.et', phone: '+251-22-111-0105', location: 'Admin Block', staffCount: 6, isActive: true },
];

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Facilities', description: 'Building and infrastructure issues', department: 'Maintenance', priority: 'high', slaDays: 3, isActive: true, complaintCount: 35 },
  { id: 'c2', name: 'IT & Network', description: 'Internet, computers and tech issues', department: 'IT Services', priority: 'medium', slaDays: 2, isActive: true, complaintCount: 25 },
  { id: 'c3', name: 'Cafeteria', description: 'Food quality and hygiene', department: 'Student Affairs', priority: 'medium', slaDays: 1, isActive: true, complaintCount: 15 },
  { id: 'c4', name: 'Library', description: 'Library resources and services', department: 'Library', priority: 'low', slaDays: 5, isActive: true, complaintCount: 12 },
  { id: 'c5', name: 'Equipment', description: 'Lab and classroom equipment', department: 'IT Services', priority: 'high', slaDays: 2, isActive: true, complaintCount: 8 },
  { id: 'c6', name: 'Dormitory', description: 'Student housing issues', department: 'Student Affairs', priority: 'high', slaDays: 1, isActive: true, complaintCount: 18 },
];

function getMockGetResponse(url) {
  // Complaint endpoints
  if (url.includes('/complaints/my') || url.includes('/complaints/student'))
    return MOCK_COMPLAINTS;
  if (url.includes('/complaints/assigned') || url.includes('/complaints/staff'))
    return MOCK_COMPLAINTS.filter(c => c.status !== 'closed');
  if (url.includes('/complaints/stats'))
    return { total: 6, pending: 2, inProgress: 2, resolved: 1, closed: 1 };
  if (url.includes('/complaints/recent'))
    return MOCK_COMPLAINTS;

  // Admin stats endpoints (check before broader admin patterns)
  if (url.includes('/admin/stats/dashboard'))
    return { totalUsers: 152, totalComplaints: 89, pendingComplaints: 23, resolvedComplaints: 54, activeStaff: 12, avgResolutionTime: 2.5, satisfactionRate: 87, escalatedCount: 3 };
  if (url.includes('/admin/stats/trends'))
    return [
      { date: 'Mon', submitted: 5, resolved: 3 }, { date: 'Tue', submitted: 8, resolved: 6 },
      { date: 'Wed', submitted: 6, resolved: 7 }, { date: 'Thu', submitted: 9, resolved: 5 },
      { date: 'Fri', submitted: 7, resolved: 8 }, { date: 'Sat', submitted: 3, resolved: 2 },
      { date: 'Sun', submitted: 2, resolved: 1 },
    ];
  if (url.includes('/admin/stats/departments'))
    return [
      { name: 'IT', complaints: 25 }, { name: 'Maintenance', complaints: 32 },
      { name: 'Library', complaints: 12 }, { name: 'Cafeteria', complaints: 15 },
      { name: 'Student Affairs', complaints: 8 },
    ];
  if (url.includes('/admin/stats/categories'))
    return [
      { name: 'Facilities', value: 35 }, { name: 'IT', value: 25 },
      { name: 'Cafeteria', value: 15 }, { name: 'Library', value: 12 },
      { name: 'Equipment', value: 8 }, { name: 'Other', value: 5 },
    ];

  // Admin resource endpoints
  if (url.includes('/admin/departments'))
    return MOCK_DEPARTMENTS;
  if (url.includes('/admin/categories'))
    return MOCK_CATEGORIES;
  if (url.includes('/admin/users/recent'))
    return MOCK_USERS;
  if (url.includes('/admin/users'))
    return MOCK_USERS;
  if (url.includes('/admin/complaints'))
    return MOCK_COMPLAINTS;
  if (url.includes('/admin/system/logs'))
    return [
      { id: 'l1', action: 'User Login', user: 'admin@astu.edu.et', timestamp: '2026-03-01T08:00:00Z', level: 'info', details: 'Successful login' },
      { id: 'l2', action: 'Complaint Created', user: 'student@astu.edu.et', timestamp: '2026-03-01T07:30:00Z', level: 'info', details: 'New complaint CMP001' },
      { id: 'l3', action: 'User Created', user: 'admin@astu.edu.et', timestamp: '2026-02-28T15:00:00Z', level: 'info', details: 'New staff user added' },
    ];
  if (url.includes('/admin/system/health'))
    return { cpu: 45, memory: 62, storage: 38, apiLatency: 120, uptime: '99.9%', status: 'healthy' };
  if (url.includes('/admin/reports'))
    return [];

  // Single complaint by ID — match /complaints/<id> but not sub-paths already handled
  const idMatch = url.match(/\/complaints\/([^/]+)$/);
  if (idMatch) {
    const found = MOCK_COMPLAINTS.find(c => c.id === idMatch[1]);
    return found || MOCK_COMPLAINTS[0];
  }

  // Generic complaints fallback
  if (url.includes('/complaints'))
    return MOCK_COMPLAINTS;

  return {};
}

// Mock API (used when backend is not available)
export const api = {
  get: async (url, config = {}) => {
    if (import.meta.env.DEV) console.log('Mock API GET:', url);
    return { data: getMockGetResponse(url) };
  },
  post: async (url, data = {}, config = {}) => {
    if (import.meta.env.DEV) console.log('Mock API POST:', url, data);
    if (url === '/auth/login' && data) return { data: getMockLoginResponse(data) };
    if (url === '/auth/register' && data) {
      const newUser = {
        id: 'reg-' + Date.now(),
        name: data.name || data.fullName || 'New User',
        email: (data.email || '').toLowerCase().trim(),
        password: data.password,
        role: data.role || 'student',
      };
      let existing = [];
      try {
        const stored = localStorage.getItem('registeredUsers');
        if (stored) existing = JSON.parse(stored);
        if (!Array.isArray(existing)) existing = [];
      } catch (_) { existing = []; }
      if (existing.some(u => u.email === newUser.email)) {
        throw new Error('An account with this email already exists. Please use a different email or sign in.');
      }
      existing.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existing));
      return { data: { success: true, message: 'Registration successful! Please login with your credentials.', user: newUser } };
    }
    if (url === '/auth/logout') return { data: { success: true } };
    if (url.includes('/complaints') && !url.includes('/assign') && !url.includes('/resolve') && !url.includes('/comments'))
      return { data: { id: 'CMP' + Date.now().toString().slice(-4), ...data, status: 'pending', createdAt: new Date().toISOString() } };
    return { data: { success: true } };
  },
  put: async (url, data = {}, config = {}) => {
    if (import.meta.env.DEV) console.log('Mock API PUT:', url, data);
    return { data: { success: true, ...data } };
  },
  patch: async (url, data = {}, config = {}) => {
    if (import.meta.env.DEV) console.log('Mock API PATCH:', url, data);
    return { data: { success: true, ...data } };
  },
  delete: async (url, config = {}) => {
    if (import.meta.env.DEV) console.log('Mock API DELETE:', url);
    return { data: { success: true } };
  }
};

export default api;