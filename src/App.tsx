/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, CustomerOrder } from './types';
import { api } from './services/api';
import { FlipkartHeader } from './components/FlipkartHeader';
import { CategoryNav } from './components/CategoryNav';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { LoginModal } from './components/LoginModal';
import { AdminPortal } from './admin/AdminPortal';
import {
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones
} from 'lucide-react';

function CustomerStore() {
  // --- E-Commerce Website State ---
  const [lang, setLang] = useState<'en' | 'ta'>('ta');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  // Customer Authentication state
  const [currentUser, setCurrentUser] = useState<{ name: string; identifier: string } | null>(() => {
    const saved = localStorage.getItem('aalayam_customer');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aalayam_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string | undefined>(undefined);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('aalayam_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products from server database
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory,
        search: searchQuery
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    const chosenSize = size || product.sizes[0] || 'Free Size';
    const chosenColor = color || product.colors[0] || 'Default';

    setCartItems((prev) => {
      const existing = prev.find(
        (it) => it.id === product.id && it.selectedSize === chosenSize && it.selectedColor === chosenColor
      );
      if (existing) {
        return prev.map((it) =>
          it.id === product.id && it.selectedSize === chosenSize && it.selectedColor === chosenColor
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          tamilName: product.tamilName,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          image: product.images[0],
          stock: product.stock
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, size?: string, color?: string) => {
    handleAddToCart(product, size, color);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleLoginSuccess = (user: { name: string; identifier: string }) => {
    setCurrentUser(user);
    localStorage.setItem('aalayam_customer', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aalayam_customer');
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.ratingCount - a.ratingCount;
  });

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-gray-900 flex flex-col font-sans">
      {/* Flipkart Header */}
      <FlipkartHeader
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setTrackingOrderNumber(undefined);
          setIsTrackingOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ta' ? 'en' : 'ta'))}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Flipkart Category Strip */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        lang={lang}
      />

      {/* Hero Carousel */}
      <HeroBanner
        lang={lang}
        onExploreCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Store Content */}
      <main className="container mx-auto px-4 py-4 flex-1">
        {/* Section Title & Sort bar */}
        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-2xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>
                {selectedCategory === 'all'
                  ? lang === 'ta'
                    ? 'அனைத்து பாரம்பரிய ஆடைகள் (All Cultural Dresses)'
                    : 'All Ethnic Wear & Cultural Attire'
                  : selectedCategory === 'silk-sarees'
                  ? lang === 'ta'
                    ? 'காஞ்சிபுரம் & தூய பட்டுச் சேலைகள்'
                    : 'Pure Silk & Kanchipuram Sarees'
                  : selectedCategory === 'chudidhars'
                  ? lang === 'ta'
                    ? 'சுடிதார் & சல்வார் செட்ஸ்'
                    : 'Chudidhar & Salwar Suit Sets'
                  : selectedCategory === 'sarees'
                  ? lang === 'ta'
                    ? 'டிசைனர் & காட்டன் புடவைகள்'
                    : 'Designer & Cotton Sarees'
                  : selectedCategory === 'lehengas'
                  ? lang === 'ta'
                    ? 'மணப்பெண் லெஹங்கா & பார்ட்டி வேர்'
                    : 'Bridal Lehengas & Party Wear'
                  : lang === 'ta'
                  ? 'குர்த்திகள் & சுடிதார்'
                  : 'Kurtis & Suit Sets'}
              </span>
              <span className="text-xs font-normal text-gray-500">
                ({sortedProducts.length} {lang === 'ta' ? 'ஆடைகள் உள்ளன' : 'products'})
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {lang === 'ta'
                ? 'நேரடி நெசவாளர் கைத்தறி • தூய ஜரிகை • UPI & கேஷ் ஆன் டெலிவரி வசதி'
                : 'Direct handloom weave • Authentic zari work • Free Express Shipping'}
            </p>
          </div>

          {/* Sort tabs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>
            <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
              <button
                onClick={() => setSortBy('popular')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  sortBy === 'popular'
                    ? 'bg-white text-[#2874f0] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Popularity
              </button>
              <button
                onClick={() => setSortBy('price-low')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  sortBy === 'price-low'
                    ? 'bg-white text-[#2874f0] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => setSortBy('price-high')}
                className={`px-2.5 py-1 rounded transition font-medium ${
                  sortBy === 'price-high'
                    ? 'bg-white text-[#2874f0] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Price: High to Low
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-md p-4 space-y-3 animate-pulse border border-gray-200">
                <div className="aspect-3/4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200 space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">
              {lang === 'ta' ? 'தேடலுக்குரிய ஆடைகள் கிடைக்கவில்லை' : 'No ethnic apparel matches your search'}
            </h3>
            <p className="text-xs text-gray-500">
              Try searching for "Kanchipuram", "Silk", "Chudidhar", or reset the category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-[#2874f0] text-white text-xs font-bold px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {sortedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                lang={lang}
                onSelect={(p) => setSelectedProduct(p)}
                onAddToCart={(p, e) => {
                  e.stopPropagation();
                  handleAddToCart(p);
                }}
                onBuyNow={(p, e) => {
                  e.stopPropagation();
                  handleBuyNow(p);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          lang={lang}
          onAddToCart={(p, size, color) => handleAddToCart(p, size, color)}
          onBuyNow={(p, size, color) => handleBuyNow(p, size, color)}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onProceedToCheckout={() => setIsCheckoutOpen(true)}
          lang={lang}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          lang={lang}
          initialName={currentUser?.name}
          initialPhone={currentUser?.identifier}
          onOrderSuccess={(data) => {
            setIsCheckoutOpen(false);
            setCartItems([]);
            setOrderSuccessData(data);
          }}
        />
      )}

      {orderSuccessData && (
        <OrderSuccessModal
          orderData={orderSuccessData}
          onClose={() => setOrderSuccessData(null)}
          onTrackOrder={(orderNum) => {
            setTrackingOrderNumber(orderNum);
            setIsTrackingOpen(true);
          }}
          lang={lang}
        />
      )}

      {isTrackingOpen && (
        <OrderTrackingModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          lang={lang}
          initialOrderNumber={trackingOrderNumber}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          lang={lang}
        />
      )}

      {/* Flipkart-style Footer */}
      <footer className="bg-[#172337] text-white text-xs mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700/80 pb-8">
            <div>
              <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
                ABOUT AALAYAM
              </h4>
              <ul className="space-y-1.5 text-gray-300">
                <li><a href="#" className="hover:underline">Contact Us</a></li>
                <li><a href="#" className="hover:underline">About Our Weavers</a></li>
                <li><a href="#" className="hover:underline">Silk Mark Certification</a></li>
                <li><a href="#" className="hover:underline">Handloom Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
                CUSTOMER CARE
              </h4>
              <ul className="space-y-1.5 text-gray-300">
                <li>
                  <button onClick={() => setIsTrackingOpen(true)} className="hover:underline text-left">
                    Order Tracking
                  </button>
                </li>
                <li><a href="#" className="hover:underline">Shipping & Pincode Policy</a></li>
                <li><a href="#" className="hover:underline">7-Day Easy Returns</a></li>
                <li><a href="#" className="hover:underline">UPI & COD FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
                COLLECTIONS
              </h4>
              <ul className="space-y-1.5 text-gray-300">
                <li><a href="#" onClick={() => setSelectedCategory('silk-sarees')} className="hover:underline">Kanchipuram Pure Silk</a></li>
                <li><a href="#" onClick={() => setSelectedCategory('sarees')} className="hover:underline">Banarasi & Cotton Sarees</a></li>
                <li><a href="#" onClick={() => setSelectedCategory('chudidhars')} className="hover:underline">Anarkali & Salwar Suits</a></li>
                <li><a href="#" onClick={() => setSelectedCategory('lehengas')} className="hover:underline">Bridal Lehengas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
                REGISTERED OFFICE
              </h4>
              <p className="text-gray-300 leading-relaxed">
                Aalayam Handloom Silks & Sarees Pvt Ltd.<br />
                Kanchipuram & Coimbatore Hub<br />
                Tamil Nadu, India.<br />
                WhatsApp: +91 6374823101<br />
                Email: kavaiyaraalsuesienmuga1234@gmail.com
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-400 gap-4 text-[11px]">
            <div className="flex items-center gap-4">
              <span>© 2026 Aalayam Silks. All Rights Reserved.</span>
              <span>100% Authentic Indian Ethnic Wear</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-900/60 px-2.5 py-1 rounded border border-blue-700/50 text-blue-200">
                UPI Supported (GPay • PhonePe • Paytm)
              </span>
              <span className="bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700/50 text-emerald-300">
                Cash On Delivery Verified
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      return (
        path.startsWith('/admin') ||
        path.startsWith('/dashboard') ||
        search.get('view') === 'admin' ||
        search.get('admin') === 'true'
      );
    }
    return false;
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      setIsAdminRoute(
        path.startsWith('/admin') ||
        path.startsWith('/dashboard') ||
        search.get('view') === 'admin' ||
        search.get('admin') === 'true'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return isAdminRoute ? <AdminPortal /> : <CustomerStore />;
}
