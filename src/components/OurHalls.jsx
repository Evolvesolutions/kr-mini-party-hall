import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Maximize, Check, Clock, Package, UtensilsCrossed } from 'lucide-react';

const API_URL = 'https://kr-mini-party-hall-server.onrender.com';

const OurHalls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch(`${API_URL}/api/halls`);
        if (res.ok) setHalls(await res.json());
      } catch (error) {
        console.error("Failed to fetch halls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  if (loading) return null;

  return (
    <section id="halls" className="py-24 bg-white overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `.halls-scroll::-webkit-scrollbar { display: none; }`}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4"
          >
            Majestic Venues
          </motion.h4>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl mb-6"
          >
            Our Luxury <span className="italic text-primary font-heading">Halls</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-body leading-relaxed"
          >
            Discover our meticulously designed spaces, each offering a unique blend of elegance and grandeur.
          </motion.p>
        </div>

        {/* Horizontal Scroll */}
        <div
          className="halls-scroll flex overflow-x-auto gap-8 pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {halls.map((hall, index) => (
            <motion.div
              key={hall.id || index}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex-shrink-0 w-full min-w-full snap-center bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden group flex flex-col lg:flex-row"
            >
              {/* ── LEFT COLUMN: Image + basic info below ── */}
              <div className="flex flex-col lg:w-2/5 xl:w-1/3 flex-shrink-0">

                {/* Image */}
                <div className="relative h-64 sm:h-80 lg:h-72 xl:h-80 overflow-hidden">
                  <img
                    src={hall.image_url?.replace('http://localhost:8000', API_URL)}
                    alt={hall.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Price badge */}
                  <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full font-body font-bold text-primary shadow-lg text-base z-10">
                    ₹{hall.price}
                  </div>
                </div>

                {/* Info below image */}
                <div className="p-6 bg-gray-50 flex-grow border-t border-gray-100 lg:border-r">
                  <h3 className="font-heading text-2xl lg:text-3xl text-text mb-2">{hall.name}</h3>
                  <p className="text-gray-500 font-body text-sm leading-relaxed mb-5">{hall.description}</p>

                  {/* Stats */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-gray-600 font-body text-sm">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users size={15} className="text-primary" />
                      </span>
                      <div>
                        <span className="text-xs text-gray-400 block leading-tight">Guest Capacity</span>
                        <span className="font-semibold text-gray-700">{hall.capacity} Guests</span>
                      </div>
                    </div>

                    {hall.dining_capacity > 0 && (
                      <div className="flex items-center gap-3 text-gray-600 font-body text-sm">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <UtensilsCrossed size={15} className="text-primary" />
                        </span>
                        <div>
                          <span className="text-xs text-gray-400 block leading-tight">Dining Capacity</span>
                          <span className="font-semibold text-gray-700">{hall.dining_capacity} Guests</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-600 font-body text-sm">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Maximize size={15} className="text-primary" />
                      </span>
                      <div>
                        <span className="text-xs text-gray-400 block leading-tight">Area</span>
                        <span className="font-semibold text-gray-700">{hall.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN: Details + Book ── */}
              <div className="flex flex-col flex-grow p-8 lg:p-10">

                {/* Time Slots */}
                {hall.time_slots && hall.time_slots.length > 0 && (
                  <div className="mb-8">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock size={16} className="text-primary" /> Available Time Slots
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {hall.time_slots.map((slot, i) => (
                        <span key={i} className="text-sm bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 rounded-full font-medium">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Packages */}
                {hall.packages_included && hall.packages_included.trim() !== '' && (
                  <div className="mb-8">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Package size={16} className="text-primary" /> Packages Included
                    </h5>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      {hall.packages_included.split(/\n+/).filter(p => p.trim()).map((pkg, i) => (
                        <div key={i} className="flex items-start gap-2 text-gray-600 font-body text-sm mb-1.5 last:mb-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          {pkg.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {hall.features && (
                  <div className="mb-8 flex-grow">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Check size={16} className="text-primary" /> Key Features
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {hall.features.split(/[,\n]+/).filter(f => f.trim()).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600 font-body text-sm">
                          <span className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={11} className="text-green-600" />
                          </span>
                          <span className="leading-relaxed">{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Book Button */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <Link
                    to="/book"
                    className="inline-block bg-primary text-white hover:bg-primary/90 font-body font-bold py-4 px-12 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Book This Hall
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurHalls;
