import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ProfileEditor from './pages/ProfileEditor';
import JobBoard from './pages/JobBoard';
import ApplicationsDashboard from './pages/ApplicationsDashboard';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import './index.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-base-dark)', color: 'var(--color-white)' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Navbar onNavigate={setCurrentPage} />
      {currentPage === 'home' && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === 'profile' && <ProfileEditor onNavigate={setCurrentPage} />}
      {currentPage === 'jobs' && <JobBoard onNavigate={setCurrentPage} />}
      {currentPage === 'applications' && <ApplicationsDashboard onNavigate={setCurrentPage} />}
      <Footer />
    </>
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

