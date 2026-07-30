import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import WhyChooseSection from './components/LandingPage/WhyChooseSection';
import HowItWorksSection from './components/LandingPage/HowItWorksSection';
import AboutUs from './components/LandingPage/AboutUs';
import Footer from './components/LandingPage/Footer';
import Login from './User pages/Login';
import Signup from './User pages/SignUp';
import DashboardPage from './User pages/Dashboard';
import MySkillProfile from './User pages/MySkillProfile';
import Settings from './User pages/Settings';
import Profile from './User pages/ProfileSettings';
import CvScanner from './User pages/CvScanner';
import CvUpload from './User pages/CvUpload';
import Notifications from './User pages/Notifications';
import JobRoles from './User pages/JobRoles';
import AlignmentResults from './User pages/AlignmentResults';
import LearningRoadmap from './User pages/LearningRoadmap';
import PrivacySettings from './User pages/Privacy Settings';
import UserManagement from './Admin pages/UserMangement';
import SkillLibrary from './Admin pages/SkillLibrary';
import AdminProfile from './Admin pages/AdminProfile';
import AdminDashboard from './Admin pages/AdminDashboard';
import Reports from './Admin pages/Reports';
import AdminJobRoles from './Admin pages/AdminJobRoles';
import ResetPassword from './User pages/ResetPassword';
import ForgotPassword from './User pages/ForgotPassword';
import AdminSettings from './Admin pages/AdminSettings';
import AdminNotifications from './Admin pages/AdminNotifications';
import AdminNotificationSettings from './Admin pages/AdminNotificatonSetting';
import AdminPrivacySecurity from './components/AdminSettings/AdminPrivacySecurity';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Hero />
                  <div id="why-choose">
                    <WhyChooseSection />
                  </div>
                  <div id="how-it-works">
                    <HowItWorksSection />
                  </div>
                  <div id="about-us">
                    <AboutUs />
                  </div>
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/cv-scanner" element={
              <ProtectedRoute requiredRole="student">
                <CvScanner />
              </ProtectedRoute>
            } />
            <Route path="/cv-upload" element={
              <ProtectedRoute requiredRole="student">
                <CvUpload />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="student">
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/my-skill-profile" element={
              <ProtectedRoute requiredRole="student">
                <MySkillProfile />
              </ProtectedRoute>
            } />
            <Route path="/job-roles" element={
              <ProtectedRoute requiredRole="student">
                <JobRoles />
              </ProtectedRoute>
            } />
            <Route path="/alignment-results" element={
              <ProtectedRoute requiredRole="student">
                <AlignmentResults />
              </ProtectedRoute>
            } />
            <Route path="/learning-roadmap" element={
              <ProtectedRoute requiredRole="student">
                <LearningRoadmap />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredRole="student">
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requiredRole="student">
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute requiredRole="student">
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/privacy-settings" element={
              <ProtectedRoute requiredRole="student">
                <PrivacySettings />
              </ProtectedRoute>
            } />

            <Route path="/admin-dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/skill-library" element={
              <ProtectedRoute requiredRole="admin">
                <SkillLibrary />
              </ProtectedRoute>
            } />
            <Route path="/admin-profile" element={
              <ProtectedRoute requiredRole="admin">
                <AdminProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute requiredRole="admin">
                <AdminProfile />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute requiredRole="admin">
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/admin/job-roles" element={
              <ProtectedRoute requiredRole="admin">
                <AdminJobRoles />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredRole="admin">
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedRoute requiredRole="admin">
                <AdminNotifications />
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications/settings" element={
              <ProtectedRoute requiredRole="admin">
                <AdminNotificationSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/privacy-security" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPrivacySecurity />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
