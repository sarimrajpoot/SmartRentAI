import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/landing/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Contact from "../pages/contact/Contact";
import About from "../pages/about/About";
import Privacy from "../pages/privacy/Privacy";
import Terms from "../pages/terms/Terms";
import Help from "../pages/help/Help";
import NotFound from "../pages/not-found/NotFound";

import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "../pages/dashboard/CustomerDashboard";
import CustomerBrowseCars from "../pages/dashboard/CustomerBrowseCars";
import CustomerBookings from "../pages/dashboard/CustomerBookings";
import BookingDetails from "../pages/dashboard/BookingDetails";
import DamageDetection from "../pages/dashboard/DamageDetection";
import CustomerWishlist from "../pages/dashboard/CustomerWishlist";
import CustomerLiveTrips from "../pages/dashboard/CustomerLiveTrips";
import CustomerSettings from "../pages/dashboard/CustomerSettings";
import CustomerRecommendations from "../pages/dashboard/CustomerRecommendations";
import ShowroomDashboard from "../pages/dashboard/ShowroomDashboard";
import ShowroomFleet from "../pages/dashboard/ShowroomFleet";
import ShowroomBookings from "../pages/dashboard/ShowroomBookings";
import ShowroomCustomers from "../pages/dashboard/ShowroomCustomers";
import ShowroomCustomerDetails from "../pages/dashboard/ShowroomCustomerDetails";
import ShowroomTracking from "../pages/dashboard/ShowroomTracking";
import ShowroomSettings from "../pages/dashboard/ShowroomSettings";
import ShowroomAnalytics from "../pages/dashboard/ShowroomAnalytics";
import DriverMonitor from "../pages/dashboard/DriverMonitor";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import CarDetails from "../pages/cars/CarDetails";
import VehicleDetails from "../pages/dashboard/VehicleDetails";
import VehicleTracking from "../pages/dashboard/VehicleTracking";
import { Navigate } from "react-router-dom";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/customer" replace />} />
        
        {/* Customer Routes (Dark Theme Layout) */}
        <Route 
          path="/dashboard/customer" 
          element={
            <RoleProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="browse" element={<CustomerBrowseCars />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="live" element={<CustomerLiveTrips />} />
          <Route path="ai" element={<CustomerRecommendations />} />
          <Route path="settings" element={<CustomerSettings />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
          <Route path="bookings/:id/inspection" element={<DamageDetection />} />
        </Route>

        {/* Showroom Routes (Light Theme Layout) */}
        <Route 
          path="/dashboard/showroom" 
          element={
            <RoleProtectedRoute allowedRoles={["SHOWROOM"]}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<ShowroomDashboard />} />
          <Route path="fleet" element={<ShowroomFleet />} />
          <Route path="bookings" element={<ShowroomBookings />} />
          <Route path="customers" element={<ShowroomCustomers />} />
          <Route path="customers/:customerId" element={<ShowroomCustomerDetails />} />
          <Route path="tracking" element={<ShowroomTracking />} />
          <Route path="settings" element={<ShowroomSettings />} />
          <Route path="analytics" element={<ShowroomAnalytics />} />
          <Route path="monitoring" element={<DriverMonitor />} />
        </Route>

        {/* Fleet Vehicle Details Route */}
        <Route 
          path="/dashboard/vehicles/:id" 
          element={
            <RoleProtectedRoute allowedRoles={["SHOWROOM"]}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<VehicleDetails />} />
          <Route path="tracking" element={<VehicleTracking />} />
        </Route>

        <Route 
          path="/dashboard/admin" 
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Car Details Route - Public */}
        <Route path="/cars/:id" element={<CarDetails />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}