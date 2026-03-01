import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  BookOpen,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import authService from '../../services/api/authService';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    studentId: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Architecture',
    'Business Administration',
    'Economics',
  ];

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(\+251|0)[97]\d{8}$/.test(phone);
  const validatePassword = (pw) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(pw);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'At least 3 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Invalid email format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (!validatePassword(value))
          error = 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!validatePhone(value)) error = 'Use 09XXXXXXXX or +2519XXXXXXXX';
        break;
      case 'department':
        if (!value) error = 'Select your department';
        break;
      case 'studentId':
        if (!value.trim()) error = 'Student ID is required';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(formData).forEach((f) => {
      if (!validateField(f, formData[f])) valid = false;
    });
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = {};
    Object.keys(formData).forEach((k) => (allTouched[k] = true));
    setTouchedFields(allTouched);

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone: formData.phone,
        department: formData.department,
        studentId: formData.studentId,
        role: 'student',
      });
      toast.success(response.message || 'Registration successful!');
      localStorage.setItem('registeredUser', JSON.stringify(response.user));
      setTimeout(() => {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      setErrors((prev) => ({ ...prev, form: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const completedFields = Object.keys(formData).filter(
    (k) => formData[k] && !errors[k]
  ).length;
  const totalFields = Object.keys(formData).length;
  const progress = Math.round((completedFields / totalFields) * 100);

  const inputBase =
    'block w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0';
  const inputNormal = `${inputBase} border-gray-200 focus:border-blue-500 focus:ring-blue-500/20`;
  const inputError = `${inputBase} border-red-300 focus:border-red-500 focus:ring-red-500/20`;

  const Field = ({ label, name, icon: Icon, children, required = true }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
        )}
        {children}
      </div>
      {touchedFields[name] && errors[name] && (
        <p className="mt-1.5 text-xs text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Register as a student to submit and track complaints
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500">Profile completion</span>
          <span className="text-xs font-semibold text-blue-600">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form Error */}
      {errors.form && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" name="fullName" icon={User}>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.fullName && errors.fullName ? inputError : inputNormal} pl-11`}
              placeholder="Abebe Kebede"
              disabled={isLoading}
            />
          </Field>

          <Field label="Email" name="email" icon={Mail}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.email && errors.email ? inputError : inputNormal} pl-11`}
              placeholder="you@astu.edu.et"
              disabled={isLoading}
            />
          </Field>
        </div>

        {/* Row 2: Student ID & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Student ID" name="studentId" icon={CreditCard}>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.studentId && errors.studentId ? inputError : inputNormal} pl-11`}
              placeholder="ASTU/22/1234"
              disabled={isLoading}
            />
          </Field>

          <Field label="Phone" name="phone" icon={Phone}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.phone && errors.phone ? inputError : inputNormal} pl-11`}
              placeholder="0912345678"
              disabled={isLoading}
            />
          </Field>
        </div>

        {/* Department */}
        <Field label="Department" name="department" icon={BookOpen}>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${touchedFields.department && errors.department ? inputError : inputNormal} pl-11 appearance-none`}
            disabled={isLoading}
          >
            <option value="">Select your department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        {/* Row 3: Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Password" name="password" icon={Lock}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.password && errors.password ? inputError : inputNormal} pl-11 pr-11`}
              placeholder="Min 8 characters"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </Field>

          <Field label="Confirm Password" name="confirmPassword" icon={Lock}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${touchedFields.confirmPassword && errors.confirmPassword ? inputError : inputNormal} pl-11 pr-11`}
              placeholder="Re-enter password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </Field>
        </div>

        {/* Password strength hints */}
        {touchedFields.password && formData.password && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { ok: formData.password.length >= 8, text: '8+ characters' },
              { ok: /[A-Z]/.test(formData.password), text: 'Uppercase letter' },
              { ok: /[a-z]/.test(formData.password), text: 'Lowercase letter' },
              { ok: /\d/.test(formData.password), text: 'Number' },
            ].map((rule) => (
              <div key={rule.text} className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${rule.ok ? 'text-green-500' : 'text-gray-300'}`}
                />
                <span
                  className={`text-xs ${rule.ok ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {rule.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Terms */}
        <p className="text-xs text-gray-500 leading-relaxed">
          By creating an account you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
