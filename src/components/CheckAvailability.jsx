import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Building2, CheckCircle, ChevronLeft, ChevronRight,
  Loader2, User, Phone, Mail, MapPin, Clock, Star, CreditCard,
  Tag, FileText, ArrowRight, ArrowLeft, Sparkles, IndianRupee
} from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const EVENT_TYPES = ['Wedding','Reception','Engagement','Birthday','Corporate','Anniversary','Naming Ceremony','Haldi'];
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', timing: '8:00 AM – 3:00 PM', price: 22000, icon: '🌅' },
  { id: 'evening', label: 'Evening', timing: '5:00 PM – 11:00 PM', price: 20000, icon: '🌆' },
];
const GUEST_RANGES = [
  { label: 'Up to 100', value: '100' },
  { label: '100 – 200', value: '200' },
];

const STEPS = ['Date & Hall', 'Event Details', 'Your Info', 'Review & Pay'];

const API_URL = 'https://kr-mini-party-hall-server.onrender.com';

// Reusable input field component
const Field = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mb-1.5">
      {Icon && <Icon size={14} className="text-primary" />}
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm bg-white placeholder-gray-400";

const CheckAvailability = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [step, setStep] = useState(0);           // 0=calendar, 1=event, 2=personal, 3=review
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState({});

  // Event Details
  const [eventType, setEventType] = useState('Wedding');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]); // default: morning
  const [guests, setGuests] = useState('100');

  // Personal Details
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    special_requirements: '',
  });

  const selectedHall = halls.find(h => h.id === selectedHallId);
  const totalPrice = timeSlot.price;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hallsRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/api/halls`),
          fetch(`${API_URL}/api/bookings`),
        ]);
        const hallsData = await hallsRes.json();
        const bookingsData = await bookingsRes.json();
        setHalls(hallsData);
        if (hallsData.length > 0) setSelectedHallId(hallsData[0].id);
        const booked = bookingsData
          .map(b => {
            const d = new Date(b.event_date);
            if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) return d.getDate();
            return null;
          })
          .filter(Boolean);
        setBookedDates(booked);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, [currentMonth, currentYear]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!selectedDate) errs.date = 'Please select a date.';
      if (!selectedHallId) errs.hall = 'Please select a hall.';
    }
    if (s === 2) {
      if (!form.customer_name.trim()) errs.customer_name = 'Name is required.';
      if (!form.customer_phone.trim() || !/^\d{10}$/.test(form.customer_phone.replace(/\s/g,'')))
        errs.customer_phone = 'Enter a valid 10-digit phone number.';
      if (!form.customer_email.trim() || !/\S+@\S+\.\S+/.test(form.customer_email))
        errs.customer_email = 'Enter a valid email address.';
      if (!form.customer_address.trim()) errs.customer_address = 'Address is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };
  const goBack = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      const orderRes = await fetch(`${API_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hall_id: selectedHallId, amount: totalPrice * 100 }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.detail || 'Failed to create order');

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Grand Kalyana',
        description: `${eventType} – ${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            const eventDate = new Date(currentYear, currentMonth, selectedDate)
              .toISOString().split('T')[0];

            const bookingData = {
              ...form,
              event_type: eventType,
              guest_count: parseInt(guests),
              event_date: eventDate,
              time_slot: `${timeSlot.label} (${timeSlot.timing})`,
              hall_id: selectedHallId,
              package_id: null,
              amount_paid: totalPrice,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            const bookRes = await fetch(`${API_URL}/api/book`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bookingData),
            });
            const data = await bookRes.json();
            if (bookRes.ok) {
              setBookingRef(data.data?.id?.slice(-8).toUpperCase() || 'GK-SUCCESS');
              setBookingSubmitted(true);
            } else {
              setErrors({ submit: data.detail || 'Booking failed.' });
            }
          } catch {
            setErrors({ submit: 'Error saving booking. Please contact support.' });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: form.customer_name,
          email: form.customer_email,
          contact: form.customer_phone,
        },
        theme: { color: '#D4AF37' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setErrors({ submit: 'Payment failed. Please try again.' });
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong.' });
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(0); setSelectedDate(null); setBookingSubmitted(false);
    setForm({ customer_name:'', customer_phone:'', customer_email:'', customer_address:'', special_requirements:'' });
    setEventType('Wedding'); setTimeSlot(TIME_SLOTS[2]); setGuests('200');
    setErrors({});
  };

  useEffect(() => {
    if (bookingSubmitted) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingSubmitted, navigate]);

  // ── Booking Confirmed Screen ───────────────────────────────────────────────
  if (bookingSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-br from-amber-50 via-white to-yellow-50 min-h-screen flex items-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white rounded-3xl shadow-2xl border border-primary/20 p-10 text-center"
          >
            <div className="relative inline-flex mb-6">
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle size={52} className="text-green-500" />
              </div>
              <span className="absolute -top-1 -right-1 text-3xl">🎉</span>
            </div>
            <h2 className="font-heading text-3xl text-text mb-2">Successfully booked the hall!</h2>
            <p className="text-gray-500 font-body mb-4">
              Redirecting you to the home page in a few seconds...
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking Ref</span>
                <span className="font-bold text-primary">#{bookingRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-text">{selectedDate} {MONTHS[currentMonth]}, {currentYear}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hall</span>
                <span className="font-semibold text-text">{selectedHall?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-bold text-green-600">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-secondary/30 via-white to-amber-50/40 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 text-primary font-body tracking-[0.2em] uppercase text-xs font-semibold mb-3">
            <Sparkles size={14} /> Reserve Your Day
          </motion.span>
          <motion.h2 initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
            className="text-4xl md:text-5xl font-heading text-text mb-3">
            Book Your <span className="text-primary italic">Special Event</span>
          </motion.h2>
          <motion.p initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
            className="text-gray-500 font-body max-w-xl mx-auto">
            Complete the form below in 4 easy steps and pay securely via Razorpay.
          </motion.p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex flex-col items-center gap-1 ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                  ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'bg-white border-primary text-primary shadow-md shadow-primary/20' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-xs font-body whitespace-nowrap ${i === step ? 'text-primary font-semibold' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 md:w-20 h-0.5 mx-1 mt-[-14px] transition-all duration-500 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity:0, x: 40 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x: -40 }}
            transition={{ duration: 0.3, ease:'easeInOut' }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >

            {/* ── STEP 0: Date & Hall ─────────────────────────────────────── */}
            {step === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
                {/* Calendar */}
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                  <h3 className="font-heading text-xl text-text mb-5 flex items-center gap-2">
                    <Calendar size={20} className="text-primary" /> Select Date
                  </h3>
                  {/* Month Nav */}
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-secondary/50 text-accent transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-heading text-base text-text">{MONTHS[currentMonth]} {currentYear}</span>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-secondary/50 text-accent transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 mb-1">
                    {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
                  </div>
                  {/* Date Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array(firstDay).fill(null).map((_,i) => <div key={`e${i}`} />)}
                    {Array(daysInMonth).fill(null).map((_,i) => {
                      const day = i + 1;
                      const isBooked = bookedDates.includes(day);
                      const isSelected = selectedDate === day;
                      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                      const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      return (
                        <button key={day} disabled={isBooked || isPast}
                          onClick={() => setSelectedDate(day)}
                          className={`aspect-square flex items-center justify-center rounded-full text-xs font-medium transition-all duration-200
                            ${isBooked ? 'bg-red-50 text-red-300 cursor-not-allowed line-through' : ''}
                            ${isPast && !isBooked ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${isSelected && !isBooked ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : ''}
                            ${!isSelected && !isBooked && !isPast ? 'hover:bg-secondary text-text hover:text-accent' : ''}
                            ${isToday && !isSelected ? 'border-2 border-primary text-primary font-bold' : ''}
                          `}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
                    {[['bg-primary','Available'],['bg-red-200','Booked'],['border-2 border-primary bg-transparent','Today']].map(([cls,lbl]) => (
                      <div key={lbl} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <div className={`w-3 h-3 rounded-full ${cls}`} />{lbl}
                      </div>
                    ))}
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-2">{errors.date}</p>}
                </div>

                {/* Hall Selection */}
                <div className="p-8 flex flex-col">
                  <h3 className="font-heading text-xl text-text mb-5 flex items-center gap-2">
                    <Building2 size={20} className="text-primary" /> Choose Hall
                  </h3>
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-80 pr-1">
                    {halls.length === 0 && <p className="text-gray-400 text-sm">Loading halls…</p>}
                    {halls.map(hall => (
                      <button key={hall.id} onClick={() => setSelectedHallId(hall.id)}
                        className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200
                          ${selectedHallId === hall.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-primary/40'}`}>
                        <div className="flex gap-3">
                          <img src={hall.image_url} alt={hall.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`font-semibold text-sm truncate ${selectedHallId===hall.id ? 'text-primary' : 'text-text'}`}>{hall.name}</p>
                              <span className="text-primary font-bold text-sm whitespace-nowrap">₹{hall.price.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{hall.area} • Up to {hall.capacity} guests</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{hall.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.hall && <p className="text-red-500 text-xs mt-2">{errors.hall}</p>}

                  {/* Selected Summary */}
                  {selectedDate && (
                    <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm">
                      <span className="text-gray-500">Selected: </span>
                      <span className="text-primary font-semibold">{selectedDate} {MONTHS[currentMonth]}, {currentYear}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 1: Event Details ───────────────────────────────────── */}
            {step === 1 && (
              <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Event Type */}
                <div>
                  <Field label="Event Type" icon={Star}>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {EVENT_TYPES.map(type => (
                        <button key={type} onClick={() => setEventType(type)}
                          className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all duration-200
                            ${eventType===type ? 'bg-primary text-white border-primary shadow-md' : 'border-gray-100 text-gray-600 hover:border-primary/50 hover:text-primary'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="space-y-6">
                  {/* Time Slot */}
                  <Field label="Time Slot" icon={Clock}>
                    <div className="space-y-3 mt-1">
                      {TIME_SLOTS.map(slot => (
                        <button key={slot.id} onClick={() => setTimeSlot(slot)}
                          className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200
                            ${timeSlot.id === slot.id ? 'bg-primary/5 border-primary shadow-md' : 'border-gray-100 hover:border-primary/40'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{slot.icon}</span>
                              <div>
                                <p className={`font-bold text-sm ${timeSlot.id === slot.id ? 'text-primary' : 'text-text'}`}>{slot.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{slot.timing}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-base ${timeSlot.id === slot.id ? 'text-primary' : 'text-text'}`}>
                                ₹{slot.price.toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs text-gray-400">per event</p>
                            </div>
                          </div>
                          {timeSlot.id === slot.id && (
                            <div className="mt-2 pt-2 border-t border-primary/20 flex items-center gap-1 text-xs text-primary">
                              <CheckCircle size={11} /> Selected
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Guest Count */}
                  <Field label="Expected Guests" icon={Users}>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {GUEST_RANGES.map(g => (
                        <button key={g.value} onClick={() => setGuests(g.value)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium border-2 transition-all duration-200
                            ${guests===g.value ? 'bg-primary text-white border-primary shadow-md' : 'border-gray-100 text-gray-600 hover:border-primary/40 hover:text-primary'}`}>
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 2: Personal Details ────────────────────────────────── */}
            {step === 2 && (
              <div className="p-8 md:p-10">
                <h3 className="font-heading text-xl text-text mb-6 flex items-center gap-2">
                  <User size={20} className="text-primary" /> Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full Name *" icon={User} error={errors.customer_name}>
                    <input type="text" value={form.customer_name}
                      onChange={e => setForm({...form, customer_name: e.target.value})}
                      className={inputClass + (errors.customer_name ? ' border-red-300 ring-red-200' : '')}
                      placeholder="e.g. Ravi Kumar" />
                  </Field>

                  <Field label="Phone Number *" icon={Phone} error={errors.customer_phone}>
                    <input type="tel" value={form.customer_phone}
                      onChange={e => setForm({...form, customer_phone: e.target.value})}
                      className={inputClass + (errors.customer_phone ? ' border-red-300 ring-red-200' : '')}
                      placeholder="10-digit mobile number" maxLength={10} />
                  </Field>

                  <Field label="Email Address *" icon={Mail} error={errors.customer_email}>
                    <input type="email" value={form.customer_email}
                      onChange={e => setForm({...form, customer_email: e.target.value})}
                      className={inputClass + (errors.customer_email ? ' border-red-300 ring-red-200' : '')}
                      placeholder="your@email.com" />
                  </Field>

                  <Field label="City / Area" icon={MapPin} error={errors.customer_address}>
                    <input type="text" value={form.customer_address}
                      onChange={e => setForm({...form, customer_address: e.target.value})}
                      className={inputClass + (errors.customer_address ? ' border-red-300 ring-red-200' : '')}
                      placeholder="e.g. Coimbatore, Tamil Nadu" />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Special Requirements" icon={FileText}>
                      <textarea value={form.special_requirements}
                        onChange={e => setForm({...form, special_requirements: e.target.value})}
                        className={inputClass + ' resize-none'}
                        rows={3}
                        placeholder="Decorator preferences, catering notes, disability access, etc." />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review & Pay ────────────────────────────────────── */}
            {step === 3 && (
              <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Summary Left */}
                <div className="md:col-span-3 space-y-5">
                  <h3 className="font-heading text-xl text-text flex items-center gap-2">
                    <Tag size={20} className="text-primary" /> Booking Summary
                  </h3>

                  {/* Hall card */}
                  {selectedHall && (
                    <div className="flex gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-4">
                      <img src={selectedHall.image_url} alt={selectedHall.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
                      <div>
                        <p className="font-bold text-text">{selectedHall.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedHall.area} • Capacity: {selectedHall.capacity}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{selectedHall.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label:'Date', val:`${selectedDate} ${MONTHS[currentMonth]}, ${currentYear}`, icon: Calendar },
                      { label:'Time Slot', val: `${timeSlot.label} (${timeSlot.timing})`, icon: Clock },
                      { label:'Event', val: eventType, icon: Star },
                      { label:'Guests', val: `~${guests}`, icon: Users },
                      { label:'Name', val: form.customer_name, icon: User },
                      { label:'Phone', val: form.customer_phone, icon: Phone },
                      { label:'Email', val: form.customer_email, icon: Mail },
                      { label:'Address', val: form.customer_address, icon: MapPin },
                    ].map(({ label, val, icon: Icon }) => (
                      <div key={label} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                        <Icon size={13} className="text-primary mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-medium text-text truncate">{val || '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {form.special_requirements && (
                    <div className="bg-gray-50 rounded-xl p-3 flex gap-2">
                      <FileText size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Special Requirements</p>
                        <p className="text-sm text-text">{form.special_requirements}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakup Right */}
                <div className="md:col-span-2">
                  <div className="bg-gradient-to-br from-primary/5 to-amber-50 border border-primary/20 rounded-2xl p-6 sticky top-4">
                    <h4 className="font-heading text-lg text-text mb-4 flex items-center gap-2">
                      <IndianRupee size={18} className="text-primary" /> Price Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600 font-medium">{timeSlot.label} Slot</p>
                          <p className="text-xs text-gray-400">{timeSlot.timing}</p>
                        </div>
                        <span className="font-bold text-lg text-text">₹{timeSlot.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 border-t border-dashed border-gray-200 pt-2">
                        <span>GST & Taxes</span>
                        <span>Included</span>
                      </div>
                      <div className="bg-primary/10 rounded-xl px-4 py-3 flex justify-between font-bold text-base mt-1">
                        <span className="text-text">Total Payable</span>
                        <span className="text-primary text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 bg-white/70 rounded-xl px-3 py-2.5">
                      <CreditCard size={14} className="text-primary flex-shrink-0" />
                      Secure payment via Razorpay. UPI, Cards, Net Banking accepted.
                    </div>

                    {errors.submit && (
                      <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">
                        {errors.submit}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation Footer ──────────────────────────────────────── */}
            <div className="flex items-center justify-between px-8 md:px-10 py-5 border-t border-gray-100 bg-gray-50/50">
              {step > 0 ? (
                <button onClick={goBack}
                  className="flex items-center gap-2 text-gray-500 hover:text-primary font-medium text-sm transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button onClick={goNext}
                  className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-7 py-3 rounded-full font-semibold text-sm transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5">
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing…</>
                  ) : (
                    <><CreditCard size={16} /> Pay ₹{totalPrice.toLocaleString('en-IN')}</>
                  )}
                </button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CheckAvailability;
