# ASTU Smart Complaint & Issue Tracking System

A full-featured, role-based complaint management platform built for **Adama Science and Technology University (ASTU)**. Students can submit and track campus complaints, staff members resolve them, and administrators oversee the entire process through analytics dashboards.

## Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| Framework    | React 18 + Vite                                             |
| Routing      | React Router v6 (role-based private/public routes)          |
| Styling      | Tailwind CSS 3 (with forms, typography, aspect-ratio plugins) |
| State        | React Context API (Auth, Theme, Notification, Chatbot)      |
| Charts       | Recharts                                                    |
| HTTP Client  | Axios (with built-in mock API for development)              |
| Icons        | Lucide React                                                |
| Toasts       | React Hot Toast                                             |
| Dates        | date-fns                                                    |
| File Upload  | react-dropzone                                              |

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/RobaShelema/ASTU_smart_complaint_and_issues_tracking_sysem.git
cd ASTU_smart_complaint_and_issues_tracking_sysem

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

### Demo Accounts

The app ships with a **mock API** — no backend needed. Use these credentials on the login page:

| Role    | Email               | Password    |
| ------- | ------------------- | ----------- |
| Student | student@astu.edu.et | Student123  |
| Staff   | staff@astu.edu.et   | Staff123    |
| Admin   | admin@astu.edu.et   | Admin123    |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific widgets (QuickActions, SystemHealth)
│   ├── charts/          # Recharts wrappers (Complaints, Department, Trends)
│   ├── chatbot/         # AI chatbot UI (ChatWindow, ChatMessage, FAQSection)
│   ├── common/          # Shared components (Navbar, Sidebar, StatsCard, StatusBadge)
│   ├── feedback/        # NotificationBell, NotificationToast
│   ├── forms/           # ComplaintForm
│   ├── layout/          # Page layouts (AuthLayout, DashboardLayout)
│   ├── modals/          # ResolutionModal
│   ├── tables/          # Data tables (ComplaintTable, AssignedComplaintsTable)
│   └── ui/              # Base UI primitives (FormField, Typography, CardGrid)
│
├── context/             # React Context providers
│   ├── AuthContext.jsx          # Authentication state, login/logout, session timer
│   ├── ThemeContext.jsx         # Light/dark theme toggle
│   ├── NotificationContext.jsx  # Real-time notification state
│   └── ChatbotContext.jsx       # Chatbot open/close, messages, mock responses
│
├── hooks/               # Custom React hooks
│   ├── useAuth.js               # Auth shortcut hook
│   ├── useComplaint.js          # Complaint CRUD operations
│   ├── useFormValidation.js     # Form validation logic
│   └── useApi.js / useAsync.js  # Generic async data fetching
│
├── pages/               # Route-level page components
│   ├── LandingPage.jsx          # Public marketing/landing page
│   ├── auth/                    # Login, Register, ForgotPassword, ResetPassword
│   ├── student/                 # StudentDashboard, NewComplaint, MyComplaints, History
│   ├── staff/                   # StaffDashboard, AssignedComplaints, Resolved, Stats
│   ├── admin/                   # AdminDashboard, ManageUsers, Departments, Categories,
│   │                            #   Analytics, Reports, SystemLogs, Settings
│   ├── common/                  # HelpSupport (shared across all roles)
│   └── errors/                  # Unauthorized, NotFound
│
├── routes/              # Routing configuration
│   ├── routeConfig.js           # Route paths and default dashboard per role
│   ├── PrivateRoute.jsx         # Auth guard with role checking
│   └── PublicRoute.jsx          # Redirects authenticated users to dashboard
│
├── services/            # API service layer
│   ├── api/
│   │   ├── axiosConfig.js       # Axios instance + full mock API with sample data
│   │   ├── authService.js       # Login, register, logout, token refresh
│   │   ├── complaintService.js  # Complaint CRUD, status updates, comments
│   │   ├── adminService.js      # User/department/category management, stats, reports
│   │   └── chatbotService.js    # Chatbot message handling
│   └── mockApi.js               # Alternative mock API implementation
│
├── utils/               # Utility functions
│   ├── constants.js             # App-wide constants
│   ├── validation.js            # Validation helpers
│   └── validators/
│       └── authValidator.js     # Login/register form validation rules
│
└── styles/
    └── layout.css               # Additional layout styles
```

---

## Key Features

### Student Portal
- **Submit Complaints** — categorized form with priority, department, file attachments
- **My Complaints** — filterable list with status badges and date range filters
- **Complaint History** — view resolved/closed complaints
- **Complaint Details** — full timeline view with status tracking

### Staff Portal
- **Assigned Complaints** — table with priority/status filters, inline status updates
- **Resolved Complaints** — archive of completed work
- **My Statistics** — performance metrics (resolution rate, avg. time, satisfaction)

### Admin Portal
- **Dashboard** — KPIs, trend charts, department distribution, system health
- **Manage Users** — create, edit, deactivate user accounts
- **Manage Departments** — department CRUD with contact info
- **Manage Categories** — complaint category configuration with SLA days
- **All Complaints** — system-wide complaint management with bulk actions
- **Analytics** — trend charts, department/category breakdown, resolution performance
- **Reports** — generate PDF/Excel/CSV reports with date and filter options
- **System Logs** — audit log viewer with level/source filters
- **Settings** — general, notification, security, complaint, and system configuration

### Shared
- **Help & Support** — searchable FAQ, quick-start guide, contact info
- **Dark Mode** — system-wide theme toggle
- **Notifications** — bell icon with real-time notification dropdown
- **AI Chatbot** — floating chat widget with FAQ suggestions and mock responses
- **Responsive Design** — mobile-first layout with collapsible sidebar

---

## Authentication & Routing

- **AuthContext** manages login state, JWT tokens, and session timeout
- **PrivateRoute** guards dashboard routes by role (`student`, `staff`, `admin`)
- **PublicRoute** redirects authenticated users to their role-specific dashboard
- Navigation after login is deferred with `setTimeout` to avoid React state race conditions

## Mock API

All API calls go through `axiosConfig.js` which provides a complete mock implementation:
- Realistic sample data for complaints, users, departments, and categories
- Login returns role-based mock JWT tokens
- GET endpoints return appropriate arrays/objects per URL pattern
- POST/PUT/DELETE return success responses

To connect a real backend, replace the mock methods in `axiosConfig.js` with actual Axios HTTP calls.

---

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server (HMR enabled)  |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Serve production build locally       |

---

## License

This project is developed for **Adama Science and Technology University**.

&copy; 2026 ASTU. All rights reserved.
