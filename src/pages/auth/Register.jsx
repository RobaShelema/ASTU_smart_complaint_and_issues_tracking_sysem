import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerValidation } from '../../utils/validators/authValidator';
import authService from '../../services/api/authService';
import { User, Mail, Lock, Phone, Calendar, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    universityId: '',
    email: '',
    phone: '',
    department: '',
    yearOfStudy: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [registrationStep, setRegistrationStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Departments list
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
    'Economics'
  ];

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    return strength;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  // Next step
  const handleNextStep = () => {
    const stepFields = {
      1: ['fullName', 'universityId', 'email', 'phone'],
      2: ['department', 'yearOfStudy'],
      3: ['password', 'confirmPassword', 'agreeTerms']
    };

    const currentFields = stepFields[registrationStep];
    const stepErrors = {};
    
    currentFields.forEach(field => {
      if (!formData[field]) {
        stepErrors[field] = `${field} is required`;
      }
    });

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setTouchedFields(prev => ({
        ...prev,
        ...currentFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      }));
      return;
    }

    setRegistrationStep(prev => prev + 1);
  };

  // Previous step
  const handlePrevStep = () => {
    setRegistrationStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = registerValidation(formData);
    setErrors(validationErrors);
    setTouchedFields({
      fullName: true,
      universityId: true,
      email: true,
      phone: true,
      department: true,
      yearOfStudy: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true
    });

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);

      try {
        await authService.register({
          name: formData.fullName,
          universityId: formData.universityId,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          yearOfStudy: parseInt(formData.yearOfStudy),
          password: formData.password,
          role: 'student'
        });

        toast.success('Registration successful! Please check your email to verify your account.');
        
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Registration successful! Please login with your credentials.' }
          });
        }, 2000);

      } catch (error) {
        toast.error(error.message || 'Registration failed. Please try again.');
        setErrors({ form: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Password strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Register as a student to submit and track complaints
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              registrationStep >= step
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {registrationStep > step ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div className={`w-12 h-1 mx-2 ${
                registrationStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Error */}
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{errors.form}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Personal Information */}
        {registrationStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    touchedFields.fullName && errors.fullName
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } rounded-lg`}
                  placeholder="John Doe"
                />
              </div>
              {touchedFields.fullName && errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* University ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University ID
              </label>
              <input
                type="text"
                name="universityId"
                value={formData.universityId}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full px-3 py-2 border ${
                  touchedFields.universityId && errors.universityId
                    ? 'border-red-300'
                    : 'border-gray-300'
                } rounded-lg`}
                placeholder="ASTU/22/1234"
              />
              {touchedFields.universityId && errors.universityId && (
                <p className="mt-1 text-sm text-red-600">{errors.universityId}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    touchedFields.email && errors.email
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } rounded-lg`}
                  placeholder="you@astu.edu.et"
                />
              </div>
              {touchedFields.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    touchedFields.phone && errors.phone
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } rounded-lg`}
                  placeholder="0912345678"
                />
              </div>
              {touchedFields.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Academic Information */}
        {registrationStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
            
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full px-3 py-2 border ${
                  touchedFields.department && errors.department
                    ? 'border-red-300'
                    : 'border-gray-300'
                } rounded-lg`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {touchedFields.department && errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year of Study
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full px-3 py-2 border ${
                  touchedFields.yearOfStudy && errors.yearOfStudy
                    ? 'border-red-300'
                    : 'border-gray-300'
                } rounded-lg`}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
              {touchedFields.yearOfStudy && errors.yearOfStudy && (
                <p className="mt-1 text-sm text-red-600">{errors.yearOfStudy}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Security Information */}
        {registrationStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900">Security Information</h3>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    touchedFields.password && errors.password
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } rounded-lg`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength <= 25 && 'Weak'}
                      {passwordStrength > 25 && passwordStrength <= 50 && 'Fair'}
                      {passwordStrength > 50 && passwordStrength <= 75 && 'Good'}
                      {passwordStrength > 75 && 'Strong'}
                    </span>
                  </div>
                </div>
              )}
              
              {touchedFields.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    touchedFields.confirmPassword && errors.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } rounded-lg`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {touchedFields.agreeTerms && errors.agreeTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-3 pt-4">
          {registrationStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          
          {registrationStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                'Complete Registration'
              )}
            </button>
          )}
        </div>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default Register;