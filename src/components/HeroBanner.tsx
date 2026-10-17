import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, RefreshCw, Smartphone } from 'lucide-react';

interface HeroBannerProps {
  lang: 'en' | 'ta';
  onExploreCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ lang, onExploreCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: lang === 'ta' ? 'தீபாவளி & திருமண பட்டுச் சேலை திருவிழா' : 'Grand Wedding & Festive Silk Utsav',
      subtitle: lang === 'ta' ? 'அசல் காஞ்சிபுரம் & மென் பட்டு புடவைகள் 50% வரை தள்ளுபடி!' : 'Pure Handloom Kanchipuram & Soft Silks up to 55% Off',
      badge: lang === 'ta' ? 'நேரடி நெசவாளர் விலை' : 'Direct from Weavers',
      category: 'silk-sarees',
      buttonText: lang === 'ta' ? 'இப்போதே வாங்குங்கள்' : 'Shop Silk Sarees',
      bgGradient: 'from-amber-900 via-rose-900 to-indigo-950',
      tagline: 'Pure Zari • Handloom Weave • Silk Mark Certified'
    },
    {
      title: lang === 'ta' ? 'அழகிய அனார்கலி & சுடிதார் கலெக்ஷன்' : 'Designer Chudidhar & Salwar Sets',
      subtitle: lang === 'ta' ? 'ரெடிமேட் மற்றும் அன்ஸ்டிச்டு சுடிதார் மாடல்கள் ₹799 முதல்!' : 'Readymade & Semi-Stitched Chudidhars starting from ₹799',
      badge: lang === 'ta' ? 'ட்ரெண்டிங் மாடல்கள்' : 'Trending Festive Fits',
      category: 'chudidhars',
      buttonText: lang === 'ta' ? 'சுடிதார் பார்க்க' : 'Explore Chudidhars',
      bgGradient: 'from-rose-950 via-purple-900 to-slate-950',
      tagline: 'Comfortable Fabrics • Floral Dupattas • Fast Dispatch'
    },
    {
      title: lang === 'ta' ? 'மணப்பெண் லெஹங்கா & பார்ட்டி வேர்' : 'Royal Bridal Lehengas & Gowns',
      subtitle: lang === 'ta' ? 'வெல்வெட் & சீக்வன்ஸ் ஜர்தோசி வேலைப்பாடு' : 'Heavy Zari Embroidery & Velvet Lehengas',
      badge: lang === 'ta' ? 'ஸ்பெஷல் கலெக்ஷன்' : 'Exclusive Collection',
      category: 'lehengas',
      buttonText: lang === 'ta' ? 'லெஹங்கா பார்க்க' : 'Shop Lehengas',
      bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
      tagline: 'Premium Velvet • Hand Embroidery • Express Delivery'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="container mx-auto px-4 mt-3">
      {/* Main Banner Slide */}
      <div
        className={`relative overflow-hidden rounded-lg shadow-md bg-gradient-to-r ${slide.bgGradient} text-white min-h-[220px] md:min-h-[280px] flex items-center p-6 md:p-10 transition-all duration-700`}
      >
        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-20 -bottom-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-xs font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
            ★ {slide.badge}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow">
            {slide.title}
          </h1>
          <p className="text-sm md:text-base text-gray-200 font-medium">
            {slide.subtitle}
          </p>
          <p className="text-xs text-yellow-300 font-medium flex items-center gap-2">
            <span>✦</span>
            <span>{slide.tagline}</span>
          </p>
          <div className="pt-2">
            <button
              onClick={() => onExploreCategory(slide.category)}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded shadow-lg transition flex items-center gap-2 text-sm cursor-pointer"
            >
              <span>{slide.buttonText}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-xs transition"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-xs transition"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Flipkart Trust Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 text-xs text-gray-700 bg-white border border-gray-200 rounded mt-2 px-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{lang === 'ta' ? '100% அசல் பட்டு உறுதி' : '100% Authentic Handloom'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">{lang === 'ta' ? 'இலவச வேகமான டெலிவரி' : 'Free Express Delivery'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="font-semibold">{lang === 'ta' ? 'UPI & கேஷ் ஆன் டெலிவரி' : 'UPI & Cash On Delivery'}</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">{lang === 'ta' ? '7 நாட்கள் எளிய ரிட்டர்ன்' : '7 Days Easy Exchange'}</span>
        </div>
      </div>
    </div>
  );
};
