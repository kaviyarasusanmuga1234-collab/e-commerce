import React, { useState } from 'react';
import { CartItem } from '../types';
import { calculateOrderPrice, formatINR } from '../utils/pricing';
import {
  X,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  Check,
  ShieldCheck,
  ArrowRight,
  Copy,
  Smartphone,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  lang: 'en' | 'ta';
  onOrderSuccess: (orderData: any) => void;
  initialPhone?: string;
  initialName?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  lang,
  onOrderSuccess,
  initialPhone,
  initialName
}) => {
  const pricing = calculateOrderPrice(cartItems);

  // Form states
  const [step, setStep] = useState<'ADDRESS' | 'PAYMENT'>('ADDRESS');
  const [formData, setFormData] = useState({
    name: initialName || 'Kaviyarasu',
    phone: initialPhone || '6374823101',
    email: 'kavaiyaraalsuesienmuga1234@gmail.com',
    pincode: '641001',
    addressLine: '15 Gandhi Road, Near Temple',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    addressType: 'HOME'
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD' | 'CARD' | 'NET_BANKING'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'QR'>('GPay');
  const [userUpiId, setUserUpiId] = useState('kaviyarasu@okhdfcbank');
  const [codCaptcha, setCodCaptcha] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState(() => Math.floor(100 + Math.random() * 900).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const STORE_UPI_ID = 'aalayamsilks@okicici';

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(STORE_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.addressLine.trim() || !formData.pincode.trim()) {
      setErrorMsg('Please fill all mandatory address fields');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setErrorMsg('Please provide a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setStep('PAYMENT');
  };

  const handlePlaceOrder = async () => {
    setErrorMsg('');

    if (paymentMethod === 'COD') {
      if (codCaptcha.trim() !== generatedCaptcha) {
        setErrorMsg('Incorrect captcha code. Please enter the 3 numbers shown.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          tamilName: item.tamilName,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          selectedSize: item.selectedSize || 'Free Size',
          selectedColor: item.selectedColor || 'Default'
        })),
        pricing: {
          totalMRP: pricing.totalMRP,
          discount: pricing.discount,
          subtotal: pricing.subtotal,
          deliveryFee: pricing.deliveryFee,
          packagingFee: pricing.packagingFee,
          totalPayable: pricing.totalPayable
        },
        paymentMethod,
        paymentDetails:
          paymentMethod === 'UPI'
            ? {
                upiApp: selectedUpiApp,
                upiId: userUpiId || STORE_UPI_ID,
                transactionRef: `UPI-${Date.now().toString().slice(-8)}`
              }
            : undefined,
        paymentStatus: paymentMethod === 'UPI' ? 'PAID' : 'COD_VERIFIED'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error('Order creation failed');
      }

      const data = await res.json();
      setIsSubmitting(false);
      onOrderSuccess(data);
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setIsSubmitting(false);
      setErrorMsg('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              {step === 'ADDRESS' ? '1' : '2'}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {step === 'ADDRESS'
                  ? lang === 'ta'
                    ? '1. டெலிவரி முகவரி (Delivery Address)'
                    : '1. Delivery Address'
                  : lang === 'ta'
                  ? '2. பணம் செலுத்தும் முறை (Payment Options)'
                  : '2. Payment Options'}
              </h3>
              <p className="text-xs text-blue-100">
                {lang === 'ta'
                  ? 'ஆலயம் சில்க்ஸ் பாதுகாப்பான செக் அவுட்'
                  : 'Aalayam Silks 100% Secured Checkout'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded-full transition" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 mx-6 mt-4 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: ADDRESS */}
        {step === 'ADDRESS' && (
          <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kaviyarasu Sanmuga"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  10-digit Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-xs font-semibold rounded-l">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="6374823101"
                    className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email ID (For Order & Receipt Confirmation)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="kavaiyaraalsuesienmuga1234@gmail.com"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="641001"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address (House No, Building, Street, Area) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  placeholder="15 Gandhi Road, Near Mariamman Temple"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Coimbatore / Chennai"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Tamil Nadu"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">{lang === 'ta' ? 'செலுத்த வேண்டிய தொகை:' : 'Order Total:'}</span>
                <p className="text-lg font-black text-gray-900">{formatINR(pricing.totalPayable)}</p>
              </div>
              <button
                type="submit"
                className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded shadow transition flex items-center gap-2 cursor-pointer text-sm"
              >
                <span>{lang === 'ta' ? 'பணம் செலுத்துவதற்கு தொடரவும்' : 'Continue to Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 'PAYMENT' && (
          <div className="p-6 space-y-5">
            {/* Address Summary chip with Change button */}
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-800">{formData.name}</span> •{' '}
                <span className="text-gray-600">{formData.phone}</span>
                <p className="text-gray-500 truncate max-w-sm">
                  {formData.addressLine}, {formData.city}, {formData.state} - {formData.pincode}
                </p>
              </div>
              <button
                onClick={() => setStep('ADDRESS')}
                className="text-[#2874f0] font-bold hover:underline"
              >
                Change
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                {lang === 'ta' ? 'பணம் செலுத்தும் முறையை தேர்ந்தெடுக்கவும்:' : 'Choose Payment Option:'}
              </label>

              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === 'UPI'
                    ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                      <Smartphone className="w-4 h-4 text-[#2874f0]" />
                      <span>UPI (Google Pay, PhonePe, Paytm, QR Code)</span>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Instant & Zero Fee
                  </span>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-4 pt-3 border-t border-blue-200/60 space-y-3 text-xs">
                    {/* App selector */}
                    <div className="grid grid-cols-4 gap-2">
                      {(['GPay', 'PhonePe', 'Paytm', 'QR'] as const).map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`py-2 px-1 text-center font-bold rounded border transition ${
                            selectedUpiApp === app
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {app === 'QR' ? 'Scan QR' : app}
                        </button>
                      ))}
                    </div>

                    {/* QR Code view */}
                    {selectedUpiApp === 'QR' ? (
                      <div className="bg-white p-4 rounded border border-gray-200 text-center space-y-2">
                        <p className="text-xs font-semibold text-gray-700">
                          Scan this QR with any UPI app to pay {formatINR(pricing.totalPayable)}
                        </p>
                        {/* Dynamic SVG QR representation */}
                        <div className="w-36 h-36 mx-auto bg-gray-50 border-2 border-dashed border-gray-300 p-2 rounded flex flex-col items-center justify-center">
                          <QrCode className="w-28 h-28 text-gray-800" />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                          <span>UPI ID: <strong>{STORE_UPI_ID}</strong></span>
                          <button
                            type="button"
                            onClick={handleCopyUPI}
                            className="text-[#2874f0] font-bold hover:underline flex items-center gap-0.5"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-gray-600 font-medium">
                          Enter your UPI ID / VPA:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userUpiId}
                            onChange={(e) => setUserUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                          />
                          <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-200">
                            Verified ✓
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cash On Delivery (COD) Option */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-[#2874f0] focus:ring-[#2874f0]"
                    />
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'ta' ? 'கேஷ் ஆன் டெலிவரி (Cash on Delivery)' : 'Cash on Delivery (COD)'}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Pay cash upon delivery</span>
                </div>

                {paymentMethod === 'COD' && (
                  <div className="mt-4 pt-3 border-t border-blue-200/60 space-y-2 text-xs">
                    <p className="text-gray-600">
                      Please enter the verification digits below to confirm your Cash on Delivery order:
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 border border-amber-300 px-4 py-1.5 rounded font-black text-base text-amber-950 tracking-widest select-none">
                        {generatedCaptcha}
                      </div>
                      <input
                        type="text"
                        maxLength={3}
                        value={codCaptcha}
                        onChange={(e) => setCodCaptcha(e.target.value)}
                        placeholder="Enter 3 digits"
                        className="w-32 bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                      />
                      <button
                        type="button"
                        onClick={() => setGeneratedCaptcha(Math.floor(100 + Math.random() * 900).toString())}
                        className="text-[#2874f0] hover:underline text-[11px]"
                      >
                        Change code
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Net Banking / Card */}
              <div
                onClick={() => setPaymentMethod('NET_BANKING')}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                    className="text-[#2874f0] focus:ring-[#2874f0]"
                  />
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span>Credit / Debit Card & Net Banking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown Footer */}
            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-gray-700">
                <span>Items ({cartItems.length}):</span>
                <span>{formatINR(pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Delivery:</span>
                <span>{pricing.isFreeDelivery ? 'FREE' : formatINR(pricing.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Packaging:</span>
                <span>{formatINR(pricing.packagingFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-black text-gray-900">
                <span>Total Amount to Pay:</span>
                <span>{formatINR(pricing.totalPayable)}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('ADDRESS')}
                className="text-xs text-gray-500 hover:text-gray-800 font-medium"
              >
                ← Back to Address
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="bg-[#fb641b] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 px-8 rounded shadow transition flex items-center gap-2 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'COD'
                        ? lang === 'ta'
                          ? 'ஆர்டரை உறுதிசெய் (Confirm COD)'
                          : 'Confirm Order (COD)'
                        : lang === 'ta'
                        ? 'பணம் செலுத்தி ஆர்டர் செய்'
                        : `Pay ${formatINR(pricing.totalPayable)} & Confirm`}
                    </span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
