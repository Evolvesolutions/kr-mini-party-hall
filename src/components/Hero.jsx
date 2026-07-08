import { motion } from 'framer-motion';
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
          <button className="bg-primary hover:bg-accent text-white font-body px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] font-medium text-lg w-full sm:w-auto">
            Book Now
          </button>
          <button className="bg-transparent border border-white hover:bg-white hover:text-text text-white font-body px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 font-medium text-lg w-full sm:w-auto">
            View Gallery
          </button>
        </motion.div>
      </div>

      {/* Floating Booking Widget */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-24 lg:bottom-12 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl z-20 hidden md:block"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
          <form className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="flex items-center text-primary text-sm font-medium mb-2 uppercase tracking-wider">
                <Calendar size={16} className="mr-2" /> Date
              </label>
              <input type="date" className="w-full bg-transparent border-b border-white/30 text-white pb-2 focus:outline-none focus:border-primary placeholder-gray-400" />
            </div>
            <div className="flex-1">
              <label className="flex items-center text-primary text-sm font-medium mb-2 uppercase tracking-wider">
                <Building size={16} className="mr-2" /> Event Type
              </label>
              <select className="w-full bg-transparent border-b border-white/30 text-white pb-2 focus:outline-none focus:border-primary appearance-none">
                <option className="text-text">Wedding</option>
                <option className="text-text">Reception</option>
                <option className="text-text">Engagement</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="flex items-center text-primary text-sm font-medium mb-2 uppercase tracking-wider">
                <Users size={16} className="mr-2" /> Guests
              </label>
              <select className="w-full bg-transparent border-b border-white/30 text-white pb-2 focus:outline-none focus:border-primary appearance-none">
                <option className="text-text">100 - 300</option>
                <option className="text-text">300 - 500</option>
                <option className="text-text">500 - 1000</option>
                <option className="text-text">1000+</option>
              </select>
            </div>
            <div>
              <button type="button" className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-xl transition-colors font-medium mt-6 h-full">
                Check Availability
              </button>
            </div>
          </form>
        </div>
      </motion.div>

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
