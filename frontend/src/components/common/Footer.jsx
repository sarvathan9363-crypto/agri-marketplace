import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import PageContainer from '../ui/PageContainer';

export default function Footer() {
  return (
    <footer className="bg-[#002B36] text-gray-300 border-t border-emerald-950 py-16">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center font-bold">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white font-display">Agri<span className="text-[#00E676]">Bazaar</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed font-sans max-w-sm mb-6">
              Connecting farmers to better markets. Buy fresh agricultural produce directly from trusted farmers and FPOs with full transparency.
            </p>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-[#00E676]" /> support@agribazaar.com</div>
              <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-[#00E676]" /> +91 98765 43210</div>
              <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-[#00E676]" /> Nashik & Mumbai, India</div>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 font-display">Marketplace</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/marketplace" className="hover:text-[#00E676] transition-colors">Browse All Crops</Link></li>
              <li><Link to="/marketplace?category=FRUITS" className="hover:text-[#00E676] transition-colors">Fresh Fruits</Link></li>
              <li><Link to="/marketplace?category=VEGETABLES" className="hover:text-[#00E676] transition-colors">Organic Vegetables</Link></li>
              <li><Link to="/marketplace?category=GRAINS" className="hover:text-[#00E676] transition-colors">Grains & Rice</Link></li>
              <li><Link to="/marketplace?category=SPICES" className="hover:text-[#00E676] transition-colors">Pure Spices</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 font-display">Portals</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/register" className="hover:text-[#00E676] transition-colors">Farmer / FPO Portal</Link></li>
              <li><Link to="/register" className="hover:text-[#00E676] transition-colors">Buyer Portal</Link></li>
              <li><Link to="/login" className="hover:text-[#00E676] transition-colors">Platform Sign In</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">About AgriBazaar</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 font-display">Support</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">Help Center</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">Verification Process</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">Terms of Trade</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">Contact Administration</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 AgriBazaar. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E676]" />
            <span className="text-xs text-gray-300 font-bold font-display">Direct Farm Commerce Engine</span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}

