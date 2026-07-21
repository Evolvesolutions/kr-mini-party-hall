import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WhatsAppButton from './components/WhatsAppButton';
import About from './components/About';
import OurHalls from './components/OurHalls';
import Services from './components/Services';
import Admin from './pages/Admin';
import Login from './pages/Login';
import BookingPage from './pages/BookingPage';
import LegalPage from './pages/LegalPage';

import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sectionId = location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
      {!isAdminRoute && <WhatsAppButton />}
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/halls" element={<OurHalls />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
