import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Calendar, Users, Building } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop)' }}
      >
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/70 via-transparent to-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary font-body tracking-[0.2em] uppercase text-sm md:text-base font-medium mb-4"
        >
          Welcome to Luxury
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white font-heading text-5xl md:text-7xl lg:text-8xl mb-6 drop-shadow-lg"
        >
          KR Mini Party Hall <br/>
          <span className="text-primary italic">Mandapam</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-200 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          The perfect royal destination for your majestic weddings and grand celebrations.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/book" className="bg-primary hover:bg-accent text-white font-body px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] font-medium text-lg w-full sm:w-auto text-center block">
            Book Now
          </Link>
          <button onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })} className="bg-transparent border border-white hover:bg-white hover:text-text text-white font-body px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 font-medium text-lg w-full sm:w-auto">
            View Gallery
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white hidden md:block"
      >
        <ChevronDown size={32} className="opacity-70" />
      </motion.div>
    </section>
  );
};

export default Hero;
