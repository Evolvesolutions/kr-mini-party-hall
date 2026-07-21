import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const About = () => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Images Layout */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 w-4/5 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop" 
                alt="Luxury Hall Interior" 
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-1/3 right-0 w-3/5 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.2)] border-8 border-white z-20"
            >
              <img 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
                alt="Wedding Setup" 
                className="w-full h-[300px] object-cover"
              />
            </motion.div>

            {/* Decorative Element */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary rounded-full -z-10"></div>
            <div className="absolute top-12 -right-12 w-24 h-24 border border-primary/30 rounded-full -z-10"></div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 mt-16 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4">
                About KR Mini Party Hall
              </h4>
              <h2 className="text-4xl md:text-5xl mb-6">
                Where Dreams Meet <br/>
                <span className="italic text-primary font-heading">Elegance</span>
              </h2>
              <p className="text-gray-600 font-body leading-relaxed mb-8">
                Welcome to KR Mini Party Hall, the most exquisite venue for your majestic celebrations. For over a decade, we have been turning dream weddings into reality. Our premium halls feature state-of-the-art amenities, breathtaking interiors, and impeccable service, ensuring your special day is truly unforgettable.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-4xl font-heading text-primary mb-2">15+</h3>
                  <p className="text-text font-body text-sm font-medium uppercase tracking-wider">Years Experience</p>
                </div>
                <div>
                  <h3 className="text-4xl font-heading text-primary mb-2">2500+</h3>
                  <p className="text-text font-body text-sm font-medium uppercase tracking-wider">Weddings Hosted</p>
                </div>
                <div>
                  <h3 className="text-4xl font-heading text-primary mb-2">3</h3>
                  <p className="text-text font-body text-sm font-medium uppercase tracking-wider">Luxury Halls</p>
                </div>
                <div>
                  <h3 className="text-4xl font-heading text-primary mb-2">100 - 200</h3>
                  <p className="text-text font-body text-sm font-medium uppercase tracking-wider">Guest Capacity</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStoryOpen(open => !open)}
                aria-expanded={isStoryOpen}
                aria-controls="our-story"
                className="bg-text hover:bg-primary text-white font-body px-8 py-4 rounded-full transition-colors duration-300 shadow-lg font-medium"
              >
                {isStoryOpen ? 'Show Less' : 'Discover Our Story'}
              </button>
              <AnimatePresence initial={false}>
                {isStoryOpen && (
                  <motion.div
                    id="our-story"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-6 border-l-4 border-primary pl-4 font-body leading-relaxed text-gray-600">
                      Built around warm hospitality and thoughtful celebrations, KR Mini Party Hall brings families together in a comfortable, elegant setting. Our team works closely with every host to make each occasion feel personal, seamless, and memorable.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
