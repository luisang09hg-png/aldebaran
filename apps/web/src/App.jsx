import { useEffect, useState } from 'react';
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
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import './index.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  useEffect(() => {
    const handler = (event) => setCurrentPage(event.detail);
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  const handleNavigate = (nextPage) => {
    if (!user && nextPage !== 'home' && nextPage !== 'auth') {
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(nextPage);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-base-dark)', color: 'var(--color-white)' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'auth') {
      return <AuthPage />;
    }

    return (
      <>
        <Navbar onNavigate={handleNavigate} />
        {currentPage === 'home' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'profile' && <ProfileEditor onNavigate={handleNavigate} />}
        <Footer />
      </>
    );
  }

  const pageContent = {
    dashboard: <Dashboard />,
    home: <Dashboard />,
    profile: <ProfileEditor onNavigate={handleNavigate} />,
    jobs: <JobBoard onNavigate={handleNavigate} />,
    applications: <ApplicationsDashboard onNavigate={handleNavigate} />,
    feed: <FeedPage />,
    resources: <SkillsCenter />,
    messages: <MessagesPage onNavigate={handleNavigate} />,
    video: <VideoCallMock />,
  }[currentPage] || <Dashboard />;

  return (
    <AuthenticatedShell currentPage={currentPage} onNavigate={handleNavigate}>
      {pageContent}
    </AuthenticatedShell>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

