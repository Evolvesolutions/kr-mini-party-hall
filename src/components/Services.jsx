import { motion } from 'framer-motion';

const services = [
  "Wedding Ceremony", "Reception", "Engagement", "Birthday Celebration",
  "Baby Shower", "Corporate Meeting", "Conference", "Anniversary",
  "Naming Ceremony", "Cultural Events", "Photography Space", 
  "Decoration Services"
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-text text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center mb-16">
          <div className="md:w-1/3">
            <motion.h4 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4"
            >
              Beyond the Venue
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl mb-6 font-heading"
            >
              Our Complete <br/>
              <span className="italic text-primary">Services</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 font-body leading-relaxed mb-8"
            >
              From exquisite culinary experiences to breathtaking floral arrangements, our comprehensive services ensure every detail of your event is executed flawlessly.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-body px-8 py-3 rounded-full transition-colors duration-300 font-medium"
            >
              View Packages
            </motion.button>
          </div>

          <div className="md:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 8) * 0.1, duration: 0.4 }}
                  className="bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 p-4 rounded-xl backdrop-blur-sm transition-all duration-300 text-center group cursor-pointer"
                >
                  <span className="font-body text-sm font-medium text-gray-300 group-hover:text-primary transition-colors">
                    {service}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
