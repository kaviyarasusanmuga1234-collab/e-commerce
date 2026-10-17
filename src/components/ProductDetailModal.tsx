import React, { useState } from 'react';
import { Product } from '../types';
import { formatINR, estimateDelivery } from '../utils/pricing';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  MapPin,
  CheckCircle2,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Share2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  lang: 'en' | 'ta';
  onAddToCart: (product: Product, size: string, color: string) => void;
  onBuyNow: (product: Product, size: string, color: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  lang,
  onAddToCart,
  onBuyNow
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(() => product.sizes[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState(() => product.colors[0] || 'Default');
  const [pincode, setPincode] = useState('600001');
  const [deliveryResult, setDeliveryResult] = useState<{ isValid: boolean; message: string; days: number } | null>(
    () => estimateDelivery('600001')
  );

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryResult(estimateDelivery(pincode));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left: Images & Gallery */}
          <div className="space-y-4">
            <div className="aspect-3/4 rounded-md overflow-hidden bg-gray-100 border border-gray-200 relative">
              <img
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-emerald-700 text-white font-extrabold text-xs px-2.5 py-1 rounded">
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-20 rounded border-2 overflow-hidden transition shrink-0 ${
                      activeImage === idx ? 'border-[#2874f0]' : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-md p-3.5 space-y-2 text-xs text-amber-950">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ta' ? 'ஆலயம் கைத்தறி உத்தரவாதம்' : 'Aalayam Heritage Assurance'}</span>
              </div>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ta' ? 'அசல் தூய ஜரிகை மற்றும் தரமான துணி' : '100% Genuine Handloom Zari & Fabric'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ta' ? 'கேஷ் ஆன் டெலிவரி & உடனடி UPI கிடைக்கும்' : 'Cash On Delivery & Fast UPI Verified'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ta' ? '7 நாட்கள் எளிதான எக்சேஞ்ச் வசதி' : '7 Days Easy Size / Color Exchange'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Product Details, Sizes, Pincode & Actions */}
          <div className="space-y-4">
            {/* Breadcrumb / Category */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{product.categoryLabel}</span>
              {product.isAssured && (
                <span className="text-xs font-black italic text-[#2874f0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Aalayam Assured ✦
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {lang === 'ta' ? product.tamilName || product.name : product.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'ta' ? product.name : product.tamilName}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                {product.rating}
                <Star className="w-3.5 h-3.5 fill-white" />
              </span>
              <span className="text-xs font-medium text-gray-500">
                {product.ratingCount.toLocaleString('en-IN')} ratings & 412 reviews
              </span>
            </div>

            {/* Pricing Section */}
            <div className="border-t border-b border-gray-100 py-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-gray-900">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      {product.discountPercent}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Inclusive of all taxes. Free shipping on this ethnic apparel.
              </p>
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  {lang === 'ta' ? 'அளவு தேர்வு (Select Size):' : 'Select Size:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded border transition ${
                        selectedSize === sz
                          ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] ring-1 ring-[#2874f0]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  {lang === 'ta' ? 'வண்ணம் (Color):' : 'Available Colors:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 text-xs font-medium rounded border transition ${
                        selectedColor === c
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Pincode Checker */}
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-2">
                <MapPin className="w-4 h-4 text-[#2874f0]" />
                <span>{lang === 'ta' ? 'டெலிவரி விபரம் (Check Delivery Date):' : 'Delivery & Pincode Checker:'}</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  maxLength={6}
                  className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 w-36 focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                />
                <button
                  type="submit"
                  className="bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer"
                >
                  Check
                </button>
              </form>
              {deliveryResult && (
                <div
                  className={`mt-2 text-xs flex items-center gap-1.5 ${
                    deliveryResult.isValid ? 'text-emerald-700 font-medium' : 'text-rose-600'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{deliveryResult.message}</span>
                </div>
              )}
            </div>

            {/* Specifications / Highlights */}
            <div className="text-xs space-y-2 border-t border-gray-100 pt-3">
              <h4 className="font-bold text-gray-900">{lang === 'ta' ? 'விளக்கம் & விவரங்கள்' : 'Product Specifications'}</h4>
              <p className="text-gray-600 leading-relaxed">
                {lang === 'ta' ? product.tamilDescription || product.description : product.description}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-gray-700">
                <div>
                  <span className="text-gray-400">Fabric:</span> <span className="font-medium">{product.fabric}</span>
                </div>
                <div>
                  <span className="text-gray-400">Occasion:</span> <span className="font-medium">Festive / Traditional</span>
                </div>
                <div>
                  <span className="text-gray-400">Stock Available:</span> <span className="font-medium text-emerald-700">{product.stock} units</span>
                </div>
                <div>
                  <span className="text-gray-400">Pattern:</span> <span className="font-medium">Traditional Handloom Motif</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => {
                  onAddToCart(product, selectedSize, selectedColor);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded shadow transition cursor-pointer text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{lang === 'ta' ? 'கூடையில் சேர்' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={() => {
                  onBuyNow(product, selectedSize, selectedColor);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded shadow transition cursor-pointer text-sm"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{lang === 'ta' ? 'உடனே வாங்கு' : 'Buy Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
