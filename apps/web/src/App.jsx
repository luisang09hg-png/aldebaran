import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ProfileEditor from './pages/ProfileEditor';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

export default App;
