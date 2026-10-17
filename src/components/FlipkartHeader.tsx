import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Package,
  Globe,
  Heart,
  ChevronDown,
  LogOut,
  MapPin
} from 'lucide-react';

interface FlipkartHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenLogin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lang: 'en' | 'ta';
  onToggleLang: () => void;
  currentUser: { name: string; identifier: string } | null;
  onLogout: () => void;
}

export const FlipkartHeader: React.FC<FlipkartHeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenLogin,
  searchQuery,
  onSearchChange,
  lang,
  onToggleLang,
  currentUser,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#2874f0] text-white shadow-md">
      {/* Top micro announcement bar */}
      <div className="bg-[#1e5bc6] px-4 py-1 text-xs text-blue-100 flex items-center justify-between border-b border-blue-400/30">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-yellow-300">★ {lang === 'ta' ? 'பாரம்பரிய கைத்தறி பட்டு & சுடிதார்' : 'Authentic Handloom Silks & Chudidhars'}</span>
            <span className="hidden sm:inline">| {lang === 'ta' ? 'அனைத்து ஆர்டர்களுக்கும் இலவச டெலிவரி' : 'Free Express Delivery across India'}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenTracking}
              className="hover:underline flex items-center gap-1 cursor-pointer font-medium text-yellow-200"
            >
              <Package className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'ஆர்டர் ட்ராக்கிங் (Track Order)' : 'Track Order'}</span>
            </button>
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 hover:text-white bg-blue-700/50 hover:bg-blue-700 px-2 py-0.5 rounded text-xs transition"
            >
              <Globe className="w-3 h-3 text-yellow-300" />
              <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Flipkart-style bar */}
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex flex-col group leading-none">
              <span className="text-2xl font-black italic tracking-wide text-white drop-shadow-sm flex items-center gap-1">
                Aalayam
                <span className="text-yellow-400 not-italic font-bold text-xl">Silks</span>
              </span>
              <span className="text-[11px] italic text-blue-100 flex items-center gap-1 group-hover:text-yellow-200 transition">
                <span>{lang === 'ta' ? 'ஆலயம் சில்க்ஸ்' : 'Explore'}</span>
                <span className="font-semibold text-yellow-300">Plus ✦</span>
              </span>
            </a>
          </div>

          {/* Search Bar (Flipkart style white with blue icon) */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  lang === 'ta'
                    ? 'பட்டுச் சேலை, அனார்கலி, சுடிதார் செட் தேடவும்...'
                    : 'Search for Silk Sarees, Chudidhar Sets, Kurtis, Lehengas...'
                }
                className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-sm py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
              />
              <button
                type="button"
                className="absolute right-2 text-[#2874f0] p-1.5 hover:text-blue-700"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4 sm:gap-6 font-medium text-sm">
            {/* Login / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 hover:text-yellow-200 transition py-1"
                >
                  <div className="w-7 h-7 rounded-full bg-yellow-400 text-blue-900 font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-xl py-2 border border-gray-100 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">{lang === 'ta' ? 'உள்நுழைந்துள்ளீர்கள்' : 'Signed in as'}</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.identifier}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenTracking();
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>{lang === 'ta' ? 'என் ஆர்டர்கள்' : 'My Orders'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-white text-[#2874f0] px-6 py-1 rounded-sm font-semibold hover:bg-yellow-50 transition shadow-sm text-sm"
              >
                {lang === 'ta' ? 'உள்நுழை (Login)' : 'Login'}
              </button>
            )}

            {/* Quick Track Order Link */}
            <button
              onClick={onOpenTracking}
              className="hidden md:flex items-center gap-1.5 hover:text-yellow-200 transition"
              title="Track your order status"
            >
              <Package className="w-4 h-4" />
              <span>{lang === 'ta' ? 'ஆர்டர் நிலை' : 'Orders'}</span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 hover:text-yellow-200 transition relative"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-yellow-400 text-blue-900 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#2874f0] shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">{lang === 'ta' ? 'கூடை' : 'Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
