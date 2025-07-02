import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import UserAccountWrapper from "@/components/UserAccountWrapper";
import Index from "./pages/Index";
import Tutors from "./pages/Tutors";
import TutorProfile from "./pages/TutorProfile";
import StudentDashboard from "./pages/StudentDashboard";
import Admin from "./pages/Admin";
import TutorAdmin from "./pages/TutorAdmin";
import NotFound from "./pages/NotFound";
import { isRetryableError } from "@/lib/errors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Only retry on retryable errors and limit to 3 attempts
        if (failureCount >= 3) return false;
        return isRetryableError(error);
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <UserAccountWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tutors" element={<Tutors />} />
                <Route path="/tutor/:id" element={<TutorProfile />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/tutor-admin" element={<TutorAdmin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserAccountWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
