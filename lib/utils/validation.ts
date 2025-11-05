/**
 * Validation Utilities
 * Helper functions for form validation
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password.length > 50) {
    errors.push("Password must not exceed 50 characters");
  }

  // Optional: Add more password requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push("Password must contain at least one uppercase letter");
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.push("Password must contain at least one lowercase letter");
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push("Password must contain at least one number");
  // }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): string | null {
  if (isEmpty(value)) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate min length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
}

/**
 * Validate max length
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
}

/**
 * Validate form fields with custom rules
 */
export function validateForm<T extends Record<string, string>>(
  values: T,
  rules: Partial<Record<keyof T, Array<(value: string) => string | null>>>
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, validators]) => {
    const value = values[field as keyof T];
    if (validators && Array.isArray(validators)) {
      for (const validator of validators) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for this field
        }
      }
    }
  });

  return errors;
}
