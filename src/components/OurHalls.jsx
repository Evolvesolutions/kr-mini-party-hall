import { motion } from 'framer-motion';
import { Users, Maximize, Star, Check } from 'lucide-react';

const halls = [
  {
    name: "The Royal Pavilion",
    capacity: "1000 - 1500 Guests",
    area: "15,000 sq ft",
    price: "From $5,000",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    features: ["Grand Chandelier", "Premium Stage", "VIP Seating Area", "Attached Dining Hall"]
  },
  {
    name: "Golden Elegance Hall",
    capacity: "500 - 800 Guests",
    area: "10,000 sq ft",
    price: "From $3,500",
    image: "https://images.unsplash.com/photo-1544865181-e2e4ff9b57a6?q=80&w=2070&auto=format&fit=crop",
    features: ["Modern Aesthetics", "Surround Sound", "Bridal Suite", "Outdoor Lawn Access"]
  },
  {
    name: "Intimate Harmony",
    capacity: "200 - 400 Guests",
    area: "5,000 sq ft",
    price: "From $2,000",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
    features: ["Cozy Atmosphere", "Custom Lighting", "Groom Suite", "Valet Parking"]
  }
];

const OurHalls = () => {
  return (
    <section id="halls" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4"
          >
            Majestic Venues
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl mb-6"
          >
            Our Luxury <span className="italic text-primary font-heading">Halls</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-body leading-relaxed"
          >
            Discover our meticulously designed spaces, each offering a unique blend of elegance and grandeur to perfectly match the scale of your celebration.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {halls.map((hall, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hall.image} 
                  alt={hall.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-body font-semibold text-primary shadow-lg">
                  {hall.price}
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="font-heading text-2xl mb-4 text-text">{hall.name}</h3>
                
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center text-gray-500 font-body text-sm">
                    <Users size={16} className="text-primary mr-2" />
                    {hall.capacity}
                  </div>
                  <div className="flex items-center text-gray-500 font-body text-sm">
                    <Maximize size={16} className="text-primary mr-2" />
                    {hall.area}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {hall.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 font-body text-sm">
                      <Check size={16} className="text-primary mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-secondary text-accent hover:bg-primary hover:text-white font-body font-medium py-3 rounded-xl transition-colors duration-300">
                  Explore Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurHalls;
