// Custom error types for better error handling
export class APIError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  public field?: string;
  public value?: any;

  constructor(message: string, field?: string, value?: any) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

// Error message mapping for user-friendly messages
const ERROR_MESSAGES = {
  // Network errors
  'ECONNREFUSED': 'Unable to connect to server. Please check your internet connection.',
  'ENOTFOUND': 'Server not found. Please check your internet connection.',
  'ETIMEDOUT': 'Request timed out. Please try again.',
  
  // HTTP status codes
  400: 'Invalid request. Please check your input and try again.',
  401: 'Authentication required. Please log in again.',
  403: 'Access denied. You don\'t have permission to perform this action.',
  404: 'Resource not found. The requested item may have been removed.',
  409: 'Conflict. This resource already exists or conflicts with existing data.',
  422: 'Validation failed. Please check your input and try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
  
  // Custom error codes
  'VALIDATION_ERROR': 'Please check your input and try again.',
  'DUPLICATE_EMAIL': 'An account with this email already exists.',
  'INVALID_CREDENTIALS': 'Invalid email or password.',
  'SLOT_UNAVAILABLE': 'This time slot is no longer available.',
  'TUTOR_NOT_FOUND': 'Tutor not found.',
  'STUDENT_NOT_FOUND': 'Student not found.',
  'BOOKING_NOT_FOUND': 'Booking not found.',
} as const;

// Function to get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    // Check for specific error codes first
    if (error.code && ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]) {
      return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES];
    }
    
    // Check for HTTP status codes
    if (ERROR_MESSAGES[error.status as keyof typeof ERROR_MESSAGES]) {
      return ERROR_MESSAGES[error.status as keyof typeof ERROR_MESSAGES];
    }
    
    // Return the error message if available
    if (error.message) {
      return error.message;
    }
  }
  
  if (error instanceof NetworkError) {
    return error.message;
  }
  
  if (error instanceof ValidationError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Check for network error codes
    if (error.message.includes('ECONNREFUSED')) {
      return ERROR_MESSAGES.ECONNREFUSED;
    }
    if (error.message.includes('ENOTFOUND')) {
      return ERROR_MESSAGES.ENOTFOUND;
    }
    if (error.message.includes('ETIMEDOUT')) {
      return ERROR_MESSAGES.ETIMEDOUT;
    }
    
    return error.message;
  }
  
  // Fallback for unknown errors
  return 'An unexpected error occurred. Please try again.';
}

// Function to check if error is retryable
export function isRetryableError(error: unknown): boolean {
  if (error instanceof APIError) {
    // Retry on server errors (5xx) and rate limiting (429)
    return error.status >= 500 || error.status === 429;
  }
  
  if (error instanceof NetworkError) {
    return true; // Network errors are usually retryable
  }
  
  return false;
}

// Function to get error severity for UI styling
export function getErrorSeverity(error: unknown): 'low' | 'medium' | 'high' {
  if (error instanceof APIError) {
    if (error.status >= 500) return 'high';
    if (error.status >= 400) return 'medium';
    return 'low';
  }
  
  if (error instanceof NetworkError) return 'high';
  if (error instanceof ValidationError) return 'low';
  
  return 'medium';
}

// Function to format error for logging
export function formatErrorForLogging(error: unknown, context?: string): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';
  
  if (error instanceof APIError) {
    return `${timestamp}${contextStr} APIError: ${error.status} - ${error.message}${error.code ? ` (${error.code})` : ''}`;
  }
  
  if (error instanceof Error) {
    return `${timestamp}${contextStr} ${error.name}: ${error.message}`;
  }
  
  return `${timestamp}${contextStr} Unknown error: ${String(error)}`;
} 