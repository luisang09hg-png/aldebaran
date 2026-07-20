import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthenticatedShell from './components/layout/AuthenticatedShell';
import LandingPage from './pages/LandingPage';
import ProfileEditor from './pages/ProfileEditor';
import JobBoard from './pages/JobBoard';
import ApplicationsDashboard from './pages/ApplicationsDashboard';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import FeedPage from './pages/FeedPage';
import SkillsCenter from './components/SkillsCenter';
import MessagesPage from './pages/MessagesPage';
import VideoCallMock from './pages/VideoCallMock';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

const pageToPath = (page) => {
  switch (page) {
    case 'dashboard':
    case 'home':
      return '/dashboard';
    case 'jobs':
      return '/jobs';
    case 'applications':
      return '/applications';
    case 'feed':
      return '/feed';
    case 'resources':
      return '/resources';
    case 'messages':
      return '/messages';
    case 'profile':
      return '/profile';
    case 'auth':
      return '/login';
    case 'video':
      return '/video';
    default:
      return '/';
  }
};

function PublicLayout() {
  const navigate = useNavigate();
  const handleNavigate = (page) => navigate(pageToPath(page));

  return (
    <>
      <Navbar onNavigate={handleNavigate} />
      <Routes>
        <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/profile" element={<ProfileEditor onNavigate={handleNavigate} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (event) => {
      if (event.detail) {
        navigate(pageToPath(event.detail));
      }
    };

    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, [navigate]);

  const handleNavigate = (page) => navigate(pageToPath(page));

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <AuthPage />
          </motion.div>
        } />
        <Route path="/" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <PublicLayout />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="dashboard" onNavigate={handleNavigate}>
                <Dashboard />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="jobs" onNavigate={handleNavigate}>
                <JobBoard onNavigate={handleNavigate} />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/jobs/:id" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="jobs" onNavigate={handleNavigate}>
                <JobBoard onNavigate={handleNavigate} />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="applications" onNavigate={handleNavigate}>
                <ApplicationsDashboard onNavigate={handleNavigate} />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/feed" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="feed" onNavigate={handleNavigate}>
                <FeedPage />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="resources" onNavigate={handleNavigate}>
                <SkillsCenter />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="messages" onNavigate={handleNavigate}>
                <MessagesPage onNavigate={handleNavigate} />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="profile" onNavigate={handleNavigate}>
                <ProfileEditor onNavigate={handleNavigate} />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/video" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthenticatedShell currentPage="video" onNavigate={handleNavigate}>
                <VideoCallMock />
              </AuthenticatedShell>
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

