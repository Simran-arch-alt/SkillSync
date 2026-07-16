import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
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
import NotificationPanel from './User pages/NotificationPanel';
import AdminPrivacySecurity from './components/AdminSettings/AdminPrivacySecurity';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path ="/my-skill-profile" element ={<MySkillProfile/>}/>
          <Route path ="/settings" element ={<Settings/>}/>
          <Route path ="/profile" element ={<Profile/>}/>
          <Route path ="/cv-scanner" element={<CvScanner/>}/>
          <Route path ="/cv-upload" element={<CvUpload/>}/>
          <Route path ="/notifications" element={<Notifications/>}/>
          <Route path ="/job-roles" element={<JobRoles/>}/>
          <Route path ="/alignment-results" element={<AlignmentResults/>}/>
          <Route path ="/learning-roadmap" element={<LearningRoadmap/>}/>
          <Route path ="/privacy-settings" element={<PrivacySettings/>}/>
          <Route path ="/user-management" element={<UserManagement/>}/>
          <Route path ="/skill-library" element={<SkillLibrary/>}/>
          <Route path ="/admin-profile" element={<AdminProfile/>}/>
          <Route path ="/admin-dashboard" element={<AdminDashboard/>}/>
          <Route path ="/reports" element={<Reports/>}/>
          <Route path ="/admin/job-roles" element={<AdminJobRoles/>}/>

         
          <Route path ="/reset-password" element={<ResetPassword/>}/>
          <Route path ="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/profile" element={<Profile />} />
          <Route path ="/admin/settings" element={<AdminSettings/>}/>
          <Route path ="/admin/profile" element={<AdminProfile/>}/>
          <Route path ="/admin/notifications" element={<AdminNotifications/>}/>
          <Route path ="/admin/notifications/settings" element={<AdminNotificationSettings/>}/>
          <Route path ="/admin/privacy-security" element={<AdminPrivacySecurity/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;