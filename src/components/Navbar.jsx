import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Only show transparent navbar on the Home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Immediately check scroll on route change
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Navbar is solid when: scrolled OR not on home page
  const isSolid = isScrolled || !isHomePage;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Halls', path: '/halls' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-white shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className={`font-heading text-2xl font-bold transition-colors duration-300 ${isSolid ? 'text-primary' : 'text-white'}`}>
              KR Mini Party Hall
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `font-body font-medium transition-colors duration-200 hover:text-primary relative pb-1
                  ${isActive
                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
                    : isSolid ? 'text-text' : 'text-white/90'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/halls"
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-full transition-colors font-medium shadow-lg hover:shadow-primary/50"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isSolid ? 'text-text' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `block px-3 py-3 font-body rounded-md transition-colors
                    ${isActive
                      ? 'text-primary bg-secondary/50 font-semibold'
                      : 'text-text hover:text-primary hover:bg-secondary/30'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4">
                <Link
                  to="/halls"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-primary hover:bg-accent text-white px-6 py-3 rounded-md transition-colors font-medium"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
