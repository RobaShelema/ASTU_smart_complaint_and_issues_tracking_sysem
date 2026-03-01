/**
 * Validation Rules
 */

// Email validation
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
export const isStrongPassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Phone number validation (Ethiopian format)
export const isValidPhone = (phone) => {
  const re = /^(\+251|0)[9|7]\d{8}$/;
  return re.test(phone);
};

// University ID validation (ASTU format: ASTU/YY/XXXX)
export const isValidUniversityId = (id) => {
  const re = /^ASTU\/\d{2}\/\d{4}$/i;
  return re.test(id);
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Future date validation
export const isFutureDate = (date) => {
  return isValidDate(date) && new Date(date) > new Date();
};

// Past date validation
export const isPastDate = (date) => {
  return isValidDate(date) && new Date(date) < new Date();
};

// Number range validation
export const isInRange = (num, min, max) => {
  return num >= min && num <= max;
};

// String length validation
export const hasMinLength = (str, min) => {
  return str.length >= min;
};

export const hasMaxLength = (str, max) => {
  return str.length <= max;
};

// File validation
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Ethiopian Tax ID validation (simplified)
export const isValidTin = (tin) => {
  const re = /^\d{10}$/;
  return re.test(tin);
};