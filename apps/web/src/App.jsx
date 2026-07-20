import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<PublicLayout />} />
      <Route path="/dashboard" element={<ProtectedRoute><AuthenticatedShell currentPage="dashboard" onNavigate={handleNavigate}><Dashboard /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><AuthenticatedShell currentPage="jobs" onNavigate={handleNavigate}><JobBoard onNavigate={handleNavigate} /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/jobs/:id" element={<ProtectedRoute><AuthenticatedShell currentPage="jobs" onNavigate={handleNavigate}><JobBoard onNavigate={handleNavigate} /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><AuthenticatedShell currentPage="applications" onNavigate={handleNavigate}><ApplicationsDashboard onNavigate={handleNavigate} /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><AuthenticatedShell currentPage="feed" onNavigate={handleNavigate}><FeedPage /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><AuthenticatedShell currentPage="resources" onNavigate={handleNavigate}><SkillsCenter /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><AuthenticatedShell currentPage="messages" onNavigate={handleNavigate}><MessagesPage onNavigate={handleNavigate} /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AuthenticatedShell currentPage="profile" onNavigate={handleNavigate}><ProfileEditor onNavigate={handleNavigate} /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="/video" element={<ProtectedRoute><AuthenticatedShell currentPage="video" onNavigate={handleNavigate}><VideoCallMock /></AuthenticatedShell></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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

