import React from 'react';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getErrorMessage, getErrorSeverity, isRetryableError } from '@/lib/errors';

interface LoadingErrorStateProps {
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  loadingMessage?: string;
  errorTitle?: string;
  errorDescription?: string;
  className?: string;
}

export const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({
  isLoading = false,
  error,
  onRetry,
  loadingMessage = 'Loading...',
  errorTitle = 'Something went wrong',
  errorDescription,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{loadingMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    const errorMessage = getErrorMessage(error);
    const severity = getErrorSeverity(error);
    const canRetry = isRetryableError(error) && onRetry;

    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              severity === 'high' ? 'bg-red-100' : 
              severity === 'medium' ? 'bg-orange-100' : 'bg-yellow-100'
            }`}>
              <AlertTriangle className={`h-6 w-6 ${
                severity === 'high' ? 'text-red-600' : 
                severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
              }`} />
            </div>
            <CardTitle className="text-xl text-gray-900">
              {errorTitle}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {errorDescription || errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {canRetry && (
              <Button 
                onClick={onRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

// Specialized loading state component
export const LoadingState: React.FC<{ message?: string; className?: string }> = ({ 
  message = 'Loading...', 
  className = '' 
}) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

// Specialized error state component
export const ErrorState: React.FC<{
  error: unknown;
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}> = ({ 
  error, 
  onRetry, 
  title = 'Something went wrong', 
  description,
  className = '' 
}) => (
  <LoadingErrorState
    error={error}
    onRetry={onRetry}
    errorTitle={title}
    errorDescription={description}
    className={className}
  />
); 