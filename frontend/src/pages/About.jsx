import { Leaf, Users, ShieldCheck, Globe } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-var(--app-header-height))] bg-[#fafcf8] py-16">
      <PageContainer>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Our Purpose</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#001e2b] font-display mt-3">About AgriBazaar</h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
            India&apos;s digital agricultural commerce platform connecting Farmers and FPOs directly to Individual and Commercial Buyers with complete transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl border border-[#e8eddb] p-8 lg:p-10 shadow-sm">
            <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display">Core Pillar</span>
            <h2 className="text-2xl font-black text-[#001e2b] font-display mt-1 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed font-sans text-sm sm:text-base">
              AgriBazaar eliminates middleman markups in agricultural trade, ensuring farmers receive fair value for their hard work while buyers obtain verified, farm-fresh produce at competitive rates.
            </p>
          </div>

          <div className="bg-[#001e2b] text-white rounded-3xl border border-emerald-900/40 p-8 lg:p-10 shadow-xl">
            <span className="text-[#00ed64] font-extrabold text-xs tracking-widest uppercase font-display">Future-Ready</span>
            <h2 className="text-2xl font-black text-white font-display mt-1 mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed font-sans text-sm sm:text-base">
              Building a technology-driven agricultural ecosystem prepared for direct settlement, digital quality verification, and transparent logistics across all agricultural zones of India.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Leaf, title: 'Farm Fresh', desc: 'Direct from verified farmers' },
            { icon: Users, title: 'Community', desc: '500+ farmers and FPOs' },
            { icon: ShieldCheck, title: 'Trust', desc: 'KYC verified marketplace' },
            { icon: Globe, title: 'Pan-India', desc: 'Connecting farms nationwide' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-3xl border border-[#e8eddb] shadow-sm">
              <div className="w-12 h-12 mx-auto bg-[#f0fdf4] text-[#00684a] rounded-2xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#001e2b] text-base font-display">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1 font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
