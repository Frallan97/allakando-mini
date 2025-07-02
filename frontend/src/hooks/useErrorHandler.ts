import { useCallback } from 'react';
import { toast } from 'sonner';
import { getErrorMessage, getErrorSeverity, formatErrorForLogging, isRetryableError } from '@/lib/errors';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  context?: string;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast = true,
    logError = true,
    context
  } = options;

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    // Log error if enabled
    if (logError) {
      console.error(formatErrorForLogging(error, context));
    }

    // Get user-friendly error message
    const errorMessage = customMessage || getErrorMessage(error);
    const severity = getErrorSeverity(error);

    // Show toast notification if enabled
    if (showToast) {
      switch (severity) {
        case 'high':
          toast.error(errorMessage, {
            duration: 5000,
            action: isRetryableError(error) ? {
              label: 'Retry',
              onClick: () => window.location.reload()
            } : undefined
          });
          break;
        case 'medium':
          toast.error(errorMessage, { duration: 4000 });
          break;
        case 'low':
          toast.warning(errorMessage, { duration: 3000 });
          break;
      }
    }

    return {
      message: errorMessage,
      severity,
      isRetryable: isRetryableError(error)
    };
  }, [showToast, logError, context]);

  return { handleError };
}

// Hook for handling async operations with error handling
export function useAsyncErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { handleError } = useErrorHandler(options);

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    customErrorMessage?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, customErrorMessage);
      return null;
    }
  }, [handleError]);

  return { executeWithErrorHandling };
} 