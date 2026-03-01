// Mock database
const mockDatabase = {
  users: [
    {
      id: '1',
      name: 'John Student',
      email: 'student@astu.edu.et',
      password: 'Student123!',
      role: 'student',
      studentId: 'ASTU/22/1234',
      department: 'Computer Science',
      phone: '0912345678'
    },
    {
      id: '2',
      name: 'Jane Staff',
      email: 'staff@astu.edu.et',
      password: 'Staff123!',
      role: 'staff',
      department: 'IT',
      phone: '0923456789'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@astu.edu.et',
      password: 'Admin123!',
      role: 'admin',
      department: 'Administration',
      phone: '0934567890'
    }
  ],
  
  complaints: [
    {
      id: 'CMP001',
      title: 'Broken AC in Dormitory',
      description: 'Air conditioning not working in Room 101, Block A',
      category: 'dormitory',
      priority: 'high',
      status: 'pending',
      location: 'Block A, Room 101',
      studentId: '1',
      studentName: 'John Student',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'CMP002',
      title: 'Internet connectivity issue',
      description: 'No internet connection in Library',
      category: 'internet',
      priority: 'urgent',
      status: 'in_progress',
      location: 'Library, 2nd Floor',
      studentId: '1',
      studentName: 'John Student',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    },
    {
      id: 'CMP003',
      title: 'Projector not working',
      description: 'Projector in Lecture Hall 201 is malfunctioning',
      category: 'classroom',
      priority: 'medium',
      status: 'resolved',
      location: 'Lecture Hall 201',
      studentId: '1',
      studentName: 'John Student',
      createdAt: '2024-01-10T11:00:00Z',
      updatedAt: '2024-01-12T16:30:00Z'
    }
  ]
};

// Initialize localStorage with mock data
const initializeMockData = () => {
  if (!localStorage.getItem('mockUsers')) {
    // Store users without passwords for safety
    const usersForStorage = mockDatabase.users.map(({ password, ...user }) => user);
    localStorage.setItem('mockUsers', JSON.stringify(usersForStorage));
  }
  
  if (!localStorage.getItem('mockComplaints')) {
    localStorage.setItem('mockComplaints', JSON.stringify(mockDatabase.complaints));
  }
};

// Call this immediately
initializeMockData();

// Mock API service
export const mockApi = {
  // Auth endpoints
  auth: {
    login: (credentials) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockDatabase.users.find(
            u => u.email === credentials.email && u.password === credentials.password
          );
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            const token = 'mock-jwt-token-' + Date.now();
            
            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            
            resolve({
              data: {
                token,
                user: userWithoutPassword,
                message: 'Login successful'
              }
            });
          } else {
            reject({
              response: {
                status: 401,
                data: { message: 'Invalid email or password' }
              }
            });
          }
        }, 800); // Simulate network delay
      });
    },
    
    register: (userData) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if user already exists
          const existingUser = mockDatabase.users.find(u => u.email === userData.email);
          
          if (existingUser) {
            reject({
              response: {
                status: 409,
                data: { message: 'User already exists with this email' }
              }
            });
            return;
          }
          
          // Create new user
          const newUser = {
            id: String(mockDatabase.users.length + 1),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'student',
            studentId: userData.studentId || `ASTU/23/${String(1000 + mockDatabase.users.length).slice(1)}`,
            department: userData.department || 'Computer Science',
            phone: userData.phone || '',
            createdAt: new Date().toISOString()
          };
          
          // Add to mock database
          mockDatabase.users.push(newUser);
          
          // Update localStorage
          const usersForStorage = mockDatabase.users.map(({ password, ...u }) => u);
          localStorage.setItem('mockUsers', JSON.stringify(usersForStorage));
          
          const { password, ...userWithoutPassword } = newUser;
          
          resolve({
            data: {
              success: true,
              message: 'Registration successful!',
              user: userWithoutPassword
            }
          });
        }, 800);
      });
    },
    
    logout: () => {
      return new Promise((resolve) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        resolve({ data: { success: true } });
      });
    },
    
    getProfile: () => {
      return new Promise((resolve) => {
        const user = localStorage.getItem('user');
        resolve({ data: user ? JSON.parse(user) : null });
      });
    }
  },
  
  // Complaints endpoints
  complaints: {
    getAll: (filters = {}) => {
      return new Promise((resolve) => {
        let complaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
        
        // Apply filters if needed
        if (filters.status) {
          complaints = complaints.filter(c => c.status === filters.status);
        }
        
        setTimeout(() => {
          resolve({ data: complaints });
        }, 500);
      });
    },
    
    getById: (id) => {
      return new Promise((resolve, reject) => {
        const complaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
        const complaint = complaints.find(c => c.id === id);
        
        setTimeout(() => {
          if (complaint) {
            resolve({ data: complaint });
          } else {
            reject({ response: { status: 404, data: { message: 'Complaint not found' } } });
          }
        }, 500);
      });
    },
    
    create: (complaintData) => {
      return new Promise((resolve) => {
        const complaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const newComplaint = {
          id: `CMP${String(complaints.length + 1).padStart(3, '0')}`,
          ...complaintData,
          studentId: user.id,
          studentName: user.name,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        complaints.push(newComplaint);
        localStorage.setItem('mockComplaints', JSON.stringify(complaints));
        
        setTimeout(() => {
          resolve({ data: newComplaint });
        }, 800);
      });
    },
    
    updateStatus: (id, status, remarks) => {
      return new Promise((resolve, reject) => {
        const complaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
        const index = complaints.findIndex(c => c.id === id);
        
        if (index !== -1) {
          complaints[index].status = status;
          complaints[index].updatedAt = new Date().toISOString();
          if (remarks) {
            complaints[index].lastRemarks = remarks;
          }
          localStorage.setItem('mockComplaints', JSON.stringify(complaints));
          
          setTimeout(() => {
            resolve({ data: complaints[index] });
          }, 500);
        } else {
          reject({ response: { status: 404, data: { message: 'Complaint not found' } } });
        }
      });
    }
  },
  
  // Admin endpoints
  admin: {
    getUsers: () => {
      return new Promise((resolve) => {
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        setTimeout(() => {
          resolve({ data: users });
        }, 500);
      });
    },
    
    getStats: () => {
      return new Promise((resolve) => {
        const complaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        
        const stats = {
          totalUsers: users.length,
          totalComplaints: complaints.length,
          pendingComplaints: complaints.filter(c => c.status === 'pending').length,
          inProgressComplaints: complaints.filter(c => c.status === 'in_progress').length,
          resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
          students: users.filter(u => u.role === 'student').length,
          staff: users.filter(u => u.role === 'staff').length,
          admins: users.filter(u => u.role === 'admin').length
        };
        
        setTimeout(() => {
          resolve({ data: stats });
        }, 500);
      });
    }
  }
};