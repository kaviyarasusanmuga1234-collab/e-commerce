import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; identifier: string }) => void;
  lang: 'en' | 'ta';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang
}) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [identifier, setIdentifier] = useState('6374823101');
  const [name, setName] = useState('Kaviyarasu Sanmuga');
  const [otp, setOtp] = useState('5821');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter a valid phone number or email');
      return;
    }
    setErrorMsg('');
    setStep('OTP');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.login({
        identifier: identifier.trim(),
        customerName: name.trim() || 'Valued Shopper',
        type: identifier.includes('@') ? 'EMAIL_OTP' : 'PHONE_OTP'
      });

      setLoading(false);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Login failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
        {/* Flipkart split header */}
        <div className="bg-[#2874f0] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-blue-700 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs uppercase tracking-wider font-extrabold text-yellow-300">
            Aalayam Silks • Explore Plus
          </span>
          <h2 className="text-xl font-bold mt-1">
            {step === 'PHONE'
              ? lang === 'ta'
                ? 'உள்நுழைவு / பதிவு (Login / Signup)'
                : 'Login / Register'
              : lang === 'ta'
              ? 'OTP சரிபார்ப்பு (Verify OTP)'
              : 'Verify Mobile OTP'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Get access to your Orders, Wishlist and Personalized Ethnic Recommendations
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 mx-6 mt-4 rounded border border-rose-200">
            {errorMsg}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleRequestOtp} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Your Full Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kaviyarasu Sanmuga"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number or Email:
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-xs font-bold rounded-l">
                  +91
                </span>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="6374823101"
                  className="w-full border border-gray-300 rounded-r px-3 py-2 text-xs focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              By continuing, you agree to Aalayam Silks' Terms of Use and Privacy Policy. All customer logins are recorded in our secure database.
            </p>

            <button
              type="submit"
              className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-bold py-2.5 rounded text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <span>{lang === 'ta' ? 'தொடரவும் (Request OTP)' : 'Request OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-600">
                Please enter the 4-digit code sent to
              </p>
              <p className="text-sm font-bold text-gray-900">+91 {identifier}</p>
            </div>

            <div>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-40 mx-auto block tracking-widest text-center text-xl font-bold border-2 border-blue-400 rounded py-2 focus:ring-2 focus:ring-[#2874f0] focus:outline-none"
              />
              <span className="block text-[11px] text-center text-gray-500 mt-1">
                (Demo Auto-filled: 5821)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : lang === 'ta' ? 'உள்நுழைக' : 'Verify & Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('PHONE')}
              className="w-full text-center text-xs text-[#2874f0] hover:underline"
            >
              Change Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
