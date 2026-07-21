import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/917550120574?text=Hello%20KR%20Mini%20Party%20Hall%2C%20I%20would%20like%20to%20know%20more%20about%20your%20availability%20and%20packages.';

const WhatsAppButton = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat with KR Mini Party Hall on WhatsApp"
    className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
  >
    <MessageCircle size={22} aria-hidden="true" />
    <span>WhatsApp Us</span>
  </a>
);

export default WhatsAppButton;
