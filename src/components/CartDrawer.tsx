import React from 'react';
import { CartItem } from '../types';
import { calculateOrderPrice, formatINR } from '../utils/pricing';
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  lang: 'en' | 'ta';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  lang
}) => {
  const pricing = calculateOrderPrice(cartItems);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-gray-50 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-yellow-300" />
            <h2 className="font-bold text-base">
              {lang === 'ta' ? `ஷாப்பிங் கூடை (${cartItems.length} ஆடைகள்)` : `My Cart (${cartItems.length} items)`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded-full transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-[#2874f0] mb-4">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {lang === 'ta' ? 'உங்கள் கூடை காலியாக உள்ளது' : 'Your Cart is empty!'}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              {lang === 'ta'
                ? 'காஞ்சிபுரம் பட்டுச் சேலைகள் மற்றும் அனார்கலி சுடிதார்களை தேர்ந்தெடுத்து கூடையில் சேர்க்கவும்.'
                : 'Explore our pure handloom silk sarees and chudidhars to add your favorite ethnic outfits.'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-[#2874f0] text-white font-bold px-6 py-2.5 rounded text-sm hover:bg-blue-700 transition"
            >
              {lang === 'ta' ? 'ஆடைகளை பார்க்க (Shop Now)' : 'Shop Now'}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Free Delivery Banner */}
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2 rounded flex items-center justify-between">
              <span className="font-semibold">
                {pricing.isFreeDelivery
                  ? '🎉 Yay! Free Express Delivery applied to your order'
                  : `Add items worth ${formatINR(pricing.freeDeliveryThreshold - pricing.subtotal)} more for FREE Delivery`}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-2xs flex gap-3.5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2">
                        {lang === 'ta' ? item.tamilName || item.name : item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                        {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                        {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                      </div>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-sm font-black text-gray-900">
                          {formatINR(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatINR(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Flipkart Price Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2.5 shadow-2xs">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">
                {lang === 'ta' ? 'விலை விபரம் (Price Details)' : 'Price Details'}
              </h4>
              <div className="flex justify-between text-xs text-gray-700">
                <span>Price ({cartItems.length} items)</span>
                <span>{formatINR(pricing.totalMRP)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-medium">
                <span>Discount on MRP</span>
                <span>- {formatINR(pricing.discount)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-700">
                <span>Delivery Charges</span>
                <span className={pricing.isFreeDelivery ? 'text-emerald-700 font-bold' : ''}>
                  {pricing.isFreeDelivery ? 'FREE' : formatINR(pricing.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-700">
                <span>Secured Packaging Fee</span>
                <span>{formatINR(pricing.packagingFee)}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-sm font-extrabold text-gray-900">
                <span>{lang === 'ta' ? 'மொத்த தொகை (Total Amount)' : 'Total Amount'}</span>
                <span>{formatINR(pricing.totalPayable)}</span>
              </div>
              {pricing.totalSavings > 0 && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-2 rounded text-center">
                  You will save {formatINR(pricing.totalSavings)} on this order
                </div>
              )}
            </div>

            {/* Safe & Secure note */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe and Secure Payments with 100% Authentic Handloom Guarantee</span>
            </div>
          </div>
        )}

        {/* Footer Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-4 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 uppercase font-bold">
                {lang === 'ta' ? 'செலுத்த வேண்டிய தொகை' : 'Total Payable'}
              </p>
              <p className="text-xl font-black text-gray-900">
                {formatINR(pricing.totalPayable)}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded shadow transition flex items-center gap-2 cursor-pointer text-sm"
            >
              <span>{lang === 'ta' ? 'ஆர்டர் செய் (Place Order)' : 'Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
