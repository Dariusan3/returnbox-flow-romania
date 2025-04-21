
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CustomerReturnForm from "./pages/CustomerReturnForm";
import Dashboard from "./pages/Dashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Returns from "./pages/Returns";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StoreReturnPage from "./pages/StoreReturnPage";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import MerchantProfile from "./pages/MerchantProfile";
import CustomerProfile from "./pages/CustomerProfile";
import EditProfile from "./pages/profile/EditProfile";
import EmailConfirmation from "./pages/auth/EmailConfirmation";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Only check role if requiredRole is provided and user exists
  if (requiredRole && user && user.role !== requiredRole) {
    return <Navigate to={user?.role === 'merchant' ? '/dashboard' : '/customer-dashboard'} />;
  }
  
  return element;
};

// Role-specific dashboard redirect
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Navigate to={user?.role === 'merchant' ? '/dashboard' : '/customer-dashboard'} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />
            <Route path="/:storeName" element={<StoreReturnPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/email-confirmation" element={<EmailConfirmation />} />
            
            {/* Customer Routes */}
            <Route path="/customer-form" element={<CustomerReturnForm />} />
            <Route path="/customer-dashboard" element={<ProtectedRoute element={<CustomerDashboard />} requiredRole="customer" />} />
            
            {/* Protected Merchant Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRole="merchant" />} />
            <Route path="/returns" element={<ProtectedRoute element={<Returns />} requiredRole="merchant" />} />
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} requiredRole="merchant" />} />
            <Route path="/billing" element={<ProtectedRoute element={<Billing />} requiredRole="merchant" />} />
            <Route path="/merchant-profile" element={<ProtectedRoute element={<MerchantProfile />} requiredRole="merchant" />} />
            <Route path="/customer-profile" element={<ProtectedRoute element={<CustomerProfile />} requiredRole="customer" />} />
            <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} requiredRole={null} />} />
            
            {/* Dashboard Redirect */}
            <Route path="/dashboard-redirect" element={<DashboardRedirect />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
