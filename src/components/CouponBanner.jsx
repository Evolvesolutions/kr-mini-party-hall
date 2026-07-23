import { useState, useEffect } from 'react';
import { Ticket, X } from 'lucide-react';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'
  : 'https://kr-mini-party-hall-server.onrender.com';

const CouponBanner = () => {
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchActiveCoupon();
  }, []);

  const fetchActiveCoupon = async () => {
    try {
      const res = await fetch(`${API_URL}/api/coupons/active`);
      if (res.ok) {
        const data = await res.json();
        setActiveCoupon(data.coupon);
      }
    } catch (err) {
      console.error('Error fetching active coupon:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !activeCoupon || dismissed) {
    return null;
  }

  const validTill = new Date(activeCoupon.valid_till);
  const isExpired = validTill < new Date();

  if (isExpired) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden mx-auto max-w-full">
      <div className="relative mx-auto max-w-full">
        <div className="mx-auto max-w-full px-2">
        {/* Scrolling content */}
        <div className="animate-marquee whitespace-nowrap py-2">
          <div className="inline-flex items-center gap-4 px-2">
            <Ticket size={20} className="text-yellow-300" />
            <span className="font-semibold text-lg">
              Special Offer: Use code <span className="bg-white/20 px-3 py-1 rounded font-mono font-bold">{activeCoupon.coupon_code}</span> for ₹{activeCoupon.discount_amount} discount!
            </span>
            <span className="text-sm opacity-90">Valid until {validTill.toLocaleDateString()} {validTill.toLocaleTimeString()}</span>
            <Ticket size={20} className="text-yellow-300" />
            <span className="font-semibold text-lg">
              Special Offer: Use code <span className="bg-white/20 px-3 py-1 rounded font-mono font-bold">{activeCoupon.coupon_code}</span> for ₹{activeCoupon.discount_amount} discount!
            </span>
            <span className="text-sm opacity-90">Valid until {validTill.toLocaleDateString()} {validTill.toLocaleTimeString()}</span>
            <Ticket size={20} className="text-yellow-300" />
            <span className="font-semibold text-lg">
              Special Offer: Use code <span className="bg-white/20 px-3 py-1 rounded font-mono font-bold">{activeCoupon.coupon_code}</span> for ₹{activeCoupon.discount_amount} discount!
            </span>
            <span className="text-sm opacity-90">Valid until {validTill.toLocaleDateString()} {validTill.toLocaleTimeString()}</span>
          </div>
        </div>
        
        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"
          aria-label="Dismiss coupon banner"
        >
          <X size={16} />
        </button>
        </div>
      </div>
    </div>
  );
};

export default CouponBanner;
