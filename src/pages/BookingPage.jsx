import CheckAvailability from '../components/CheckAvailability';
import { motion } from 'framer-motion';

const BookingPage = () => {
  return (
    <div className="pt-24 pb-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4"
          >
            Reservation
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-heading mb-6"
          >
            Book Your <span className="italic text-primary">Special Event</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-body leading-relaxed"
          >
            Check our availability calendar and request a booking for your upcoming event. We'll get back to you promptly with confirmation and further details.
          </motion.p>
        </div>
      </div>
      
      {/* Reusing the existing booking component */}
      <div className="-mt-12">
        <CheckAvailability />
      </div>
    </div>
  );
};

export default BookingPage;
