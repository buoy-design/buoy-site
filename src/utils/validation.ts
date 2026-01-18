/**
 * Email validation regex - matches standard email format
 * Used by subscribe and support API endpoints
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
