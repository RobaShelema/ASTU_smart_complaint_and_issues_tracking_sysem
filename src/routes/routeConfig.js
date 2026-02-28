// Route paths as constants for maintainability
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Student routes
  STUDENT: '/student',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_NEW_COMPLAINT: '/student/new-complaint',
  STUDENT_MY_COMPLAINTS: '/student/complaints',
  STUDENT_COMPLAINT_DETAIL: '/student/complaints/:id',
  STUDENT_PROFILE: '/student/profile',
  
  // Staff routes
  STAFF: '/staff',
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_ASSIGNED: '/staff/assigned',
  STAFF_COMPLAINT_DETAIL: '/staff/complaints/:id',
  STAFF_RESOLVE: '/staff/resolve/:id',
  STAFF_PROFILE: '/staff/profile',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_COMPLAINTS: '/admin/complaints',
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Error routes
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
};

// Route titles for breadcrumbs and page titles
export const ROUTE_TITLES = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.REGISTER]: 'Register',
  [ROUTES.STUDENT_DASHBOARD]: 'Student Dashboard',
  [ROUTES.STUDENT_NEW_COMPLAINT]: 'New Complaint',
  [ROUTES.STUDENT_MY_COMPLAINTS]: 'My Complaints',
  [ROUTES.STAFF_DASHBOARD]: 'Staff Dashboard',
  [ROUTES.STAFF_ASSIGNED]: 'Assigned Complaints',
  [ROUTES.ADMIN_DASHBOARD]: 'Admin Dashboard',
  [ROUTES.ADMIN_COMPLAINTS]: 'Manage Complaints',
  [ROUTES.ADMIN_USERS]: 'Manage Users',
  [ROUTES.ADMIN_ANALYTICS]: 'Analytics',
};