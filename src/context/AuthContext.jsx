import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/api/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedToken && storedUser) {
          // Verify token validity
          const isValid = await verifyToken(storedToken);
          if (isValid) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            setToken(storedToken);
            startSessionTimer();
          } else {
            // Token invalid, try to refresh
            await refreshAccessToken();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Token verification
  const verifyToken = async (token) => {
    try {
      // Implement token verification logic
      return true; // Placeholder
    } catch (error) {
      return false;
    }
  };

  // Session timer
  const startSessionTimer = () => {
    const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour
    setSessionExpiry(expiryTime);
  };

  // Check session expiry
  useEffect(() => {
    if (sessionExpiry) {
      const interval = setInterval(() => {
        if (Date.now() > sessionExpiry) {
          toast.error('Session expired. Please login again.');
          logout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [sessionExpiry]);

  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken(refreshToken);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
          setRefreshToken(response.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [refreshToken]);

  // Login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.token && response.user) {
        // Store in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
          setRefreshToken(response.refreshToken);
        }

        // Update state
        setUser(response.user);
        setToken(response.token);
        setIsAuthenticated(true);
        startSessionTimer();

        toast.success(`Welcome back, ${response.user.name}!`);
        
        // Redirect based on role
        const dashboardRoutes = {
          student: '/student/dashboard',
          staff: '/staff/dashboard',
          admin: '/admin/dashboard'
        };
        
        navigate(dashboardRoutes[response.user.role] || '/');
        
        return response;
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
      
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Reset state
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setSessionExpiry(null);
      
      toast.success('Logged out successfully');
      navigate('/login');
    }
  }, [navigate]);

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(profileData);
      
      if (response.user) {
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update state
        setUser(response.user);
        
        toast.success('Profile updated successfully');
        return response;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await authService.changePassword(passwordData);
      toast.success('Password changed successfully');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check permission
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'any') return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  // Context value
  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    token,
    
    // Auth methods
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshAccessToken,
    
    // Permissions
    hasPermission,
    
    // User helpers
    isStudent: user?.role === 'student',
    isStaff: user?.role === 'staff',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};