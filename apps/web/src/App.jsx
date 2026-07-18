import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ProfileEditor from './pages/ProfileEditor';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
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
      {currentPage === 'home' ? (
        <LandingPage onNavigate={setCurrentPage} />
      ) : (
        <ProfileEditor onNavigate={setCurrentPage} />
      )}
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
