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
  [ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
  [ROUTES.RESET_PASSWORD]: 'Reset Password',
  [ROUTES.STUDENT_DASHBOARD]: 'Student Dashboard',
  [ROUTES.STUDENT_NEW_COMPLAINT]: 'New Complaint',
  [ROUTES.STUDENT_MY_COMPLAINTS]: 'My Complaints',
  [ROUTES.STUDENT_COMPLAINT_DETAIL]: 'Complaint Details',
  [ROUTES.STUDENT_PROFILE]: 'Profile',
  [ROUTES.STAFF_DASHBOARD]: 'Staff Dashboard',
  [ROUTES.STAFF_ASSIGNED]: 'Assigned Complaints',
  [ROUTES.STAFF_COMPLAINT_DETAIL]: 'Complaint Details',
  [ROUTES.STAFF_RESOLVE]: 'Resolve Complaint',
  [ROUTES.STAFF_PROFILE]: 'Profile',
  [ROUTES.ADMIN_DASHBOARD]: 'Admin Dashboard',
  [ROUTES.ADMIN_COMPLAINTS]: 'Manage Complaints',
  [ROUTES.ADMIN_USERS]: 'Manage Users',
  [ROUTES.ADMIN_CATEGORIES]: 'Manage Categories',
  [ROUTES.ADMIN_DEPARTMENTS]: 'Manage Departments',
  [ROUTES.ADMIN_ANALYTICS]: 'Analytics',
  [ROUTES.ADMIN_REPORTS]: 'Reports',
  [ROUTES.ADMIN_LOGS]: 'System Logs',
  [ROUTES.ADMIN_SETTINGS]: 'Settings',
  [ROUTES.UNAUTHORIZED]: 'Unauthorized Access',
  [ROUTES.NOT_FOUND]: 'Page Not Found',
};

// Role-based default routes
export const DEFAULT_ROUTES = {
  student: ROUTES.STUDENT_DASHBOARD,
  staff: ROUTES.STAFF_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
};

// Navigation menu items
export const NAV_ITEMS = {
  student: [
    { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'New Complaint', path: ROUTES.STUDENT_NEW_COMPLAINT, icon: 'FileText' },
    { label: 'My Complaints', path: ROUTES.STUDENT_MY_COMPLAINTS, icon: 'FolderOpen' },
    { label: 'Profile', path: ROUTES.STUDENT_PROFILE, icon: 'User' },
  ],
  staff: [
    { label: 'Dashboard', path: ROUTES.STAFF_DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Assigned', path: ROUTES.STAFF_ASSIGNED, icon: 'Clock' },
    { label: 'Profile', path: ROUTES.STAFF_PROFILE, icon: 'User' },
  ],
  admin: [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Complaints', path: ROUTES.ADMIN_COMPLAINTS, icon: 'AlertCircle' },
    { label: 'Users', path: ROUTES.ADMIN_USERS, icon: 'Users' },
    { label: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: 'Tag' },
    { label: 'Departments', path: ROUTES.ADMIN_DEPARTMENTS, icon: 'Building' },
    { label: 'Analytics', path: ROUTES.ADMIN_ANALYTICS, icon: 'BarChart3' },
    { label: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: 'Download' },
    { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: 'Settings' },
  ],
};