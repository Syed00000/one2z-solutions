import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { initializeApp } from "@/utils/clearCache";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import BookMeeting from "./pages/BookMeeting";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMeetings from "./pages/AdminMeetings";
import AdminMeetingsList from "./pages/AdminMeetingsList";
import AdminMessages from "./pages/AdminMessages";
import AdminMessageDetail from "./pages/AdminMessageDetail";
import AdminMeetingDetail from "./pages/AdminMeetingDetail";
import AdminProjects from "./pages/AdminProjects";
import AdminProjectDetail from "./pages/AdminProjectDetail";
import AdminProjectEdit from "./pages/AdminProjectEdit";
import AdminReviews from "./pages/AdminReviews";
import AdminPasswordReset from "./pages/AdminPasswordReset";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize app and clear localStorage cache
initializeApp();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-meeting" element={<BookMeeting />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/meetings" element={<ProtectedRoute><AdminMeetingsList /></ProtectedRoute>} />
            <Route path="/admin/meetings/:id" element={<ProtectedRoute><AdminMeetingDetail /></ProtectedRoute>} />
            <Route path="/admin/meetings-list" element={<ProtectedRoute><AdminMeetingsList /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/messages/:id" element={<ProtectedRoute><AdminMessageDetail /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
            <Route path="/admin/projects/:id" element={<ProtectedRoute><AdminProjectDetail /></ProtectedRoute>} />
            <Route path="/admin/projects/:id/edit" element={<ProtectedRoute><AdminProjectEdit /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
            <Route path="/admin/password-reset" element={<AdminPasswordReset />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            
            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
