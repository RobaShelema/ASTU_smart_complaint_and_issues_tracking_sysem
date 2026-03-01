import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginValidation } from '../../utils/validators/authValidator';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const fieldErrors = loginValidation({ [name]: formData[name] });
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = loginValidation(formData);
    setErrors(validationErrors);
    setTouchedFields({ email: true, password: true });

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        await login({ email: formData.email, password: formData.password });
        toast.success('Login successful! Redirecting...');
      } catch (error) {
        toast.error(error.message || 'Login failed. Please check your credentials.');
        setErrors({ form: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = async (role) => {
    const creds = {
      student: { email: 'student@astu.edu.et', password: 'Student123' },
      staff: { email: 'staff@astu.edu.et', password: 'Staff123' },
      admin: { email: 'admin@astu.edu.et', password: 'Admin123' }
    }[role];

    setFormData({ ...creds, rememberMe: false });
    setIsLoading(true);
    try {
      await login(creds);
      toast.success('Login successful! Redirecting...');
    } catch (error) {
      toast.error(error.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    'block w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0';
  const inputNormal = `${inputBase} border-gray-200 focus:border-blue-500 focus:ring-blue-500/20`;
  const inputError = `${inputBase} border-red-300 focus:border-red-500 focus:ring-red-500/20`;

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Sign in to your account to continue
        </p>
      </div>

      {/* Demo Quick Access */}
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-500 mb-3 text-center uppercase tracking-wider">
          Quick Demo Access
        </p>
        <div className="flex gap-2">
          {[
            { role: 'student', color: 'bg-blue-600 hover:bg-blue-700', label: 'Student' },
            { role: 'staff', color: 'bg-emerald-600 hover:bg-emerald-700', label: 'Staff' },
            { role: 'admin', color: 'bg-violet-600 hover:bg-violet-700', label: 'Admin' },
          ].map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => handleDemoLogin(item.role)}
              disabled={isLoading}
              className={`flex-1 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50 ${item.color}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 px-3 text-gray-400 font-medium">or sign in with email</span>
        </div>
      </div>

      {/* Form Error */}
      {errors.form && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.email && errors.email ? inputError : inputNormal} pl-11`}
              placeholder="you@astu.edu.et"
              disabled={isLoading}
            />
          </div>
          {touchedFields.email && errors.email && (
            <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.password && errors.password ? inputError : inputNormal} pl-11 pr-11`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
          {touchedFields.password && errors.password && (
            <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe === true}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
          />
          <span className="text-sm text-gray-600">Remember me for 30 days</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </>
          )}
        </button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
