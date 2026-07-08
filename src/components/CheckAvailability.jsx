import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Building2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const bookedDates = [8, 15, 22, 25]; // mock booked dates

const CheckAvailability = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventType, setEventType] = useState('Wedding');
  const [guests, setGuests] = useState('300 - 500');
  const [submitted, setSubmitted] = useState(false);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const handleCheck = () => {
    if (selectedDate) setSubmitted(true);
  };

  return (
    <section className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-body tracking-[0.2em] uppercase text-sm font-semibold mb-4"
          >
            Plan Your Day
          </motion.h4>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl mb-4 text-text font-heading"
          >
            Check <span className="text-primary italic">Availability</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 font-body"
          >
            Select your preferred date to see if your dream venue is available.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-primary/10"
          >
            {/* Month Nav */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 rounded-full hover:bg-secondary/50 text-accent transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h3 className="font-heading text-xl text-text">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              <button onClick={nextMonth} className="p-2 rounded-full hover:bg-secondary/50 text-accent transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 font-body py-2">{d}</div>
              ))}
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const isBooked = bookedDates.includes(day);
                const isSelected = selectedDate === day;
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                return (
                  <button
                    key={day}
                    disabled={isBooked}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm font-body font-medium transition-all duration-200
                      ${isBooked ? 'bg-red-50 text-red-300 cursor-not-allowed line-through' : ''}
                      ${isSelected && !isBooked ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : ''}
                      ${!isSelected && !isBooked ? 'hover:bg-secondary text-text hover:text-accent' : ''}
                      ${isToday && !isSelected ? 'border-2 border-primary text-primary font-bold' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs font-body text-gray-500">
                <div className="w-3 h-3 rounded-full bg-primary"></div> Available
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-gray-500">
                <div className="w-3 h-3 rounded-full bg-red-200"></div> Booked
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-gray-500">
                <div className="w-3 h-3 rounded-full border-2 border-primary"></div> Today
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {!submitted ? (
              <>
                {/* Selected Date Display */}
                <div className={`bg-white rounded-2xl p-6 border-2 transition-colors duration-300 ${selectedDate ? 'border-primary' : 'border-gray-100'} shadow-md`}>
                  <div className="flex items-center gap-3 mb-1">
                    <Calendar className="text-primary" size={20} />
                    <span className="font-body text-sm font-semibold text-gray-500 uppercase tracking-wider">Selected Date</span>
                  </div>
                  <p className="font-heading text-3xl text-text pl-8">
                    {selectedDate
                      ? `${selectedDate} ${MONTHS[currentMonth]}, ${currentYear}`
                      : <span className="text-gray-300 text-2xl">Pick a date from calendar</span>
                    }
                  </p>
                </div>

                {/* Event Type */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="text-primary" size={20} />
                    <span className="font-body text-sm font-semibold text-gray-500 uppercase tracking-wider">Event Type</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Wedding','Reception','Engagement','Birthday','Conference','Anniversary'].map(type => (
                      <button
                        key={type}
                        onClick={() => setEventType(type)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-body font-medium border-2 transition-all duration-200
                          ${eventType === type ? 'bg-primary text-white border-primary shadow-md' : 'border-gray-100 text-gray-600 hover:border-primary/50 hover:text-primary'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Count */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="text-primary" size={20} />
                    <span className="font-body text-sm font-semibold text-gray-500 uppercase tracking-wider">Number of Guests</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['100 - 300','300 - 500','500 - 800','800 - 1000','1000 - 1500','1500+'].map(g => (
                      <button
                        key={g}
                        onClick={() => setGuests(g)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-body font-medium border-2 transition-all duration-200
                          ${guests === g ? 'bg-primary text-white border-primary shadow-md' : 'border-gray-100 text-gray-600 hover:border-primary/50 hover:text-primary'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCheck}
                  className={`w-full py-4 rounded-2xl font-body font-semibold text-lg transition-all duration-300 ${
                    selectedDate
                      ? 'bg-primary hover:bg-accent text-white shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:-translate-y-1'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Check Availability
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 shadow-xl border border-primary/20 text-center"
              >
                <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                <h3 className="font-heading text-2xl text-text mb-2">Great News! 🎉</h3>
                <p className="font-body text-gray-500 mb-2">
                  <span className="text-primary font-semibold">{selectedDate} {MONTHS[currentMonth]}, {currentYear}</span> is available for your <span className="text-primary font-semibold">{eventType}</span>!
                </p>
                <p className="font-body text-gray-400 text-sm mb-8">Estimated guests: {guests}</p>
                <button className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-full font-medium transition-colors w-full mb-3">
                  Confirm Booking
                </button>
                <button onClick={() => setSubmitted(false)} className="text-gray-400 hover:text-primary text-sm font-body transition-colors">
                  ← Choose another date
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CheckAvailability;
