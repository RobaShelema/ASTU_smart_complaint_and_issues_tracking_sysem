import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginValidation } from '../../utils/validators/authValidator';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, ArrowRight, ChevronDown, ChevronUp, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'Student', email: 'student@astu.edu.et', password: 'Student123', color: 'blue' },
  { role: 'Staff', email: 'staff@astu.edu.et', password: 'Staff123', color: 'emerald' },
  { role: 'Admin', email: 'admin@astu.edu.et', password: 'Admin123', color: 'violet' },
];

const DemoCredentials = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Demo Account Credentials
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2">
          {DEMO_ACCOUNTS.map((a) => (
            <div key={a.role} className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-700">
              <span className={`font-semibold ${a.color === 'blue' ? 'text-blue-600' : a.color === 'emerald' ? 'text-emerald-600' : 'text-violet-600'}`}>
                {a.role}
              </span>
              <span className="text-gray-500">
                {a.email} / <span className="font-mono">{a.password}</span>
              </span>
            </div>
          ))}
          <p className="text-[10px] text-gray-400 text-center pt-1">
            Or register a new account with any role
          </p>
        </div>
      )}
    </div>
  );
};

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

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const fieldErrors = loginValidation({ [name]: value });
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }, []);

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

  const inputBase =
    'block w-full rounded-xl border bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-900';
  const inputNormal = `${inputBase} border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20`;
  const inputError = `${inputBase} border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20`;

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Welcome back</h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Sign in to your account to continue
        </p>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
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
          <span className="text-sm text-gray-600 dark:text-gray-400">Remember me for 30 days</span>
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

      {/* Demo Credentials */}
      <DemoCredentials />

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
