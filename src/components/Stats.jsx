import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 15, suffix: '+', label: 'Years of Excellence' },
  { value: 2500, suffix: '+', label: 'Events Hosted' },
  { value: 200, suffix: '', label: 'Guest Capacity' },
  { value: 98, suffix: '%', label: 'Happy Clients' },
];

const AnimatedCounter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Stats = () => {
  return (
    <section className="py-20 bg-text relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <div className="font-heading text-5xl md:text-6xl text-primary mb-3 font-bold">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-body text-gray-400 text-sm uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
