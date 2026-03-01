import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  placeholder,
  options = [], // for select
  rows = 4, // for textarea
  className = '',
  icon: Icon,
  hint,
  ...props
}) => {
  const hasError = touched && error && error.length > 0;
  const firstError = hasError ? error[0] : null;

  const baseInputClasses = `
    form-input w-full
    ${hasError ? 'form-input-error' : ''}
    ${Icon ? 'pl-10' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            className={baseInputClasses}
            {...props}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              className="form-checkbox"
              {...props}
            />
            <label htmlFor={name} className="ml-2 text-sm text-[rgb(var(--text-primary))]">
              {label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  className="form-radio"
                  {...props}
                />
                <label className="ml-2 text-sm text-[rgb(var(--text-primary))]">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-[rgb(var(--text-secondary))]" />
              </div>
            )}
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              placeholder={placeholder}
              className={baseInputClasses}
              {...props}
            />
          </div>
        );
    }
  };

  if (type === 'checkbox') {
    return renderInput();
  }

  return (
    <div className={`form-group ${className}`}>
      {label && type !== 'checkbox' && type !== 'radio' && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="ml-1 text-[rgb(var(--color-danger))]">*</span>}
        </label>
      )}

      {renderInput()}

      {hint && !hasError && (
        <p className="form-hint">{hint}</p>
      )}

      {hasError && (
        <div className="form-error flex items-start space-x-1">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{firstError}</span>
        </div>
      )}

      {!hasError && touched && value && (
        <p className="text-sm text-[rgb(var(--color-success))] flex items-center space-x-1 mt-1">
          <CheckCircle className="h-4 w-4" />
          <span>Looks good!</span>
        </p>
      )}
    </div>
  );
};

export default FormField;