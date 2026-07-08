import { motion } from 'framer-motion';
import { 
  Wind, Utensils, Sparkles, Gem, UserCheck, 
  BatteryCharging, ArrowUpToLine, Video, Accessibility, 
  Droplet, Wifi, Car, ShieldAlert, BadgeCheck 
} from 'lucide-react';

const features = [
  { icon: <Wind size={32} />, title: "Fully Air Conditioned" },
  { icon: <Utensils size={32} />, title: "Spacious Dining Hall" },
  { icon: <Sparkles size={32} />, title: "Premium Stage Decoration" },
  { icon: <Gem size={32} />, title: "Luxury Bridal Room" },
  { icon: <UserCheck size={32} />, title: "Groom Suite" },
  { icon: <BatteryCharging size={32} />, title: "100% Power Backup" },
  { icon: <ArrowUpToLine size={32} />, title: "Lift Facility" },
  { icon: <Video size={32} />, title: "CCTV Security" },
  { icon: <Accessibility size={32} />, title: "Wheelchair Access" },
  { icon: <Droplet size={32} />, title: "RO Drinking Water" },
  { icon: <Wifi size={32} />, title: "High-Speed WiFi" },
  { icon: <Car size={32} />, title: "Large Car Parking" },
  { icon: <ShieldAlert size={32} />, title: "Fire Safety" },
  { icon: <BadgeCheck size={32} />, title: "Professional Management" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4"
          >
            Our Premium Amenities
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl mb-6"
          >
            Why Choose <span className="italic text-primary font-heading">Us</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-body leading-relaxed"
          >
            We provide everything you need for a seamless and magnificent celebration. Our top-tier facilities ensure maximum comfort for you and your guests.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-primary/30 group"
            >
              <div className="text-primary mb-4 p-4 rounded-full bg-secondary/50 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h5 className="font-body font-medium text-text text-sm leading-snug">
                {feature.title}
              </h5>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
