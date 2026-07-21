import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-text text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="KR Mini Party Hall Logo" className="h-12 w-auto" />
              <span className="font-heading text-3xl font-bold text-primary block">
                KR Mini Party Hall
              </span>
            </div>
            <p className="text-gray-400 font-body text-sm leading-relaxed mb-6">
              A premium marriage hall designed for royal weddings and grand celebrations. Experience luxury and elegance on your special day.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Share2 size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xl text-white mb-6">Quick Links</h4>
            <ul className="space-y-4 font-body">
              <li><a href="#home" className="text-gray-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#halls" className="text-gray-400 hover:text-primary transition-colors">Our Halls</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-primary transition-colors">Services</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-primary transition-colors">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xl text-white mb-6">Our Services</h4>
            <ul className="space-y-4 font-body">
              <li className="text-gray-400">Wedding Ceremony</li>
              <li className="text-gray-400">Reception</li>
              <li className="text-gray-400">Engagement</li>
              <li className="text-gray-400">Corporate Events</li>
              <li className="text-gray-400">Birthday Parties</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xl text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 font-body">
              <li className="flex items-start">
                <MapPin className="text-primary mt-1 mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">123 Royal Palace Road,<br />Luxury District, City 40001</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-primary mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">7550120574</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-primary mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">krminipartyhall@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-500 font-body text-sm">
            &copy; {new Date().getFullYear()} KR Mini Party Hall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
