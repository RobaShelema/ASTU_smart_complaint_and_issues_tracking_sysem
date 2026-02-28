// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

// University ID validation (ASTU format: ASTU/XX/XXXX)
export const validateUniversityId = (id) => {
  const re = /^ASTU\/\d{2}\/\d{4}$/i;
  return re.test(id);
};

// Phone number validation (Ethiopian format)
export const validatePhone = (phone) => {
  const re = /^(\+251|0)[9|7]\d{8}$/;
  return re.test(phone);
};

// Form validation rules
export const loginValidation = (values) => {
  const errors = {};
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

export const registerValidation = (values) => {
  const errors = {};
  
  // Full name
  if (!values.fullName) {
    errors.fullName = 'Full name is required';
  } else if (values.fullName.length < 3) {
    errors.fullName = 'Name must be at least 3 characters';
  }
  
  // University ID
  if (!values.universityId) {
    errors.universityId = 'University ID is required';
  } else if (!validateUniversityId(values.universityId)) {
    errors.universityId = 'Invalid format (Use: ASTU/YY/XXXX)';
  }
  
  // Email
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Phone
  if (!values.phone) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(values.phone)) {
    errors.phone = 'Invalid phone format (Use: 09XXXXXXXX or +2519XXXXXXXX)';
  }
  
  // Password
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(values.password)) {
    errors.password = 'Password must be at least 8 chars with 1 uppercase, 1 lowercase, 1 number';
  }
  
  // Confirm Password
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  // Department
  if (!values.department) {
    errors.department = 'Department is required';
  }
  
  // Year of Study
  if (!values.yearOfStudy) {
    errors.yearOfStudy = 'Year of study is required';
  }
  
  // Terms agreement
  if (!values.agreeTerms) {
    errors.agreeTerms = 'You must agree to the terms';
  }
  
  return errors;
};

export const forgotPasswordValidation = (values) => {
  const errors = {};
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Invalid email format';
  }
  
  return errors;
};

export const resetPasswordValidation = (values) => {
  const errors = {};
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(values.password)) {
    errors.password = 'Password must be at least 8 chars with 1 uppercase, 1 lowercase, 1 number';
  }
  
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};