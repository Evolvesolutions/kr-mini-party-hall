import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya & Arjun',
    event: 'Wedding — March 2024',
    rating: 5,
    text: 'KR Mini Party Hall made our wedding an absolute dream. The floral decorations were breathtaking and the staff was incredibly professional. Every guest complimented the royal ambiance!',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=100&auto=format&fit=crop',
  },
  {
    name: 'Meena & Rahul',
    event: 'Reception — January 2024',
    rating: 5,
    text: 'From booking to execution, everything was flawless. The hall was stunning, catering was excellent, and the team took care of every detail. Highly recommended for royal celebrations!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
  },
  {
    name: 'Sunita & Vikram',
    event: 'Engagement — December 2023',
    rating: 5,
    text: 'The stage decoration was truly magnificent. We chose KR Mini Party Hall for our engagement and it exceeded all our expectations. The ambiance was magical and our family loved it.',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=100&auto=format&fit=crop',
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4"
          >
            Love Stories
          </motion.h4>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl text-text mb-4 font-heading"
          >
            What Our <span className="text-primary italic">Couples Say</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="bg-secondary/20 rounded-3xl p-8 border border-primary/10 hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative"
            >
              <Quote className="text-primary/20 absolute top-6 right-6" size={40} />
              <div className="flex items-center gap-1 mb-4">
                {Array(t.rating).fill(null).map((_, i) => (
                  <Star key={i} size={16} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="font-body text-gray-600 leading-relaxed mb-6 text-sm italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/30" />
                <div>
                  <p className="font-heading text-text font-semibold">{t.name}</p>
                  <p className="font-body text-xs text-gray-400">{t.event}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
