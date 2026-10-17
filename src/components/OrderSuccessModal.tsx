import React from 'react';
import { CustomerOrder } from '../types';
import { formatINR } from '../utils/pricing';
import {
  CheckCircle2,
  Package,
  MessageCircle,
  Mail,
  Truck,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

interface OrderSuccessModalProps {
  orderData: {
    order: CustomerOrder;
    whatsappUrl: string;
    whatsappMessage: string;
    emailPayload: any;
  };
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
  lang: 'en' | 'ta';
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orderData,
  onClose,
  onTrackOrder,
  lang
}) => {
  const { order, whatsappUrl, emailPayload } = orderData;
  const mailto = `mailto:${emailPayload.to}?subject=${encodeURIComponent(
    emailPayload.subject
  )}&body=${encodeURIComponent(emailPayload.body)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {lang === 'ta' ? 'ஆர்டர் வெற்றிகரமாக உறுதியானது!' : 'Order Placed Successfully!'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {lang === 'ta'
              ? `ஆர்டர் எண்: #${order.orderNumber}`
              : `Order ID: #${order.orderNumber}`}
          </p>
        </div>

        {/* Notification Status Alert */}
        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ta' ? 'தானியங்கி தகவல் அனுப்பப்பட்டது (Dispatched Alerts)' : 'Automated Notifications Dispatched'}</span>
            </div>
            <div className="space-y-1.5 text-gray-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp: <strong>+91 6374823101</strong></span>
                </span>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  DISPATCHED ✓
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate max-w-[280px]">Email: <strong>kavaiyaraalsuesienmuga1234@gmail.com</strong></span>
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                  LOGGED ✓
                </span>
              </div>
            </div>
          </div>

          {/* Quick 1-Click WhatsApp & Email Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded shadow transition flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ta' ? 'வாட்ஸ்அப் திற (+91 6374823101)' : 'Send to WhatsApp'}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href={mailto}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-3 rounded border border-gray-300 transition flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Mail className="w-4 h-4 text-red-500" />
              <span>{lang === 'ta' ? 'ஜிமெயிலில் அனுப்பு' : 'Open in Gmail'}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* Order Summary & Delivery Date */}
          <div className="border border-gray-200 rounded-lg p-3.5 text-xs space-y-2 bg-gray-50/50">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Delivery By:</span>
              </span>
              <span className="font-bold text-gray-800 text-sm">
                {order.courier.estimatedDelivery}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Courier Partner:</span>
              <span className="font-semibold text-gray-800">{order.courier.partner}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Waybill / Tracking No:</span>
              <span className="font-mono font-bold text-blue-700">{order.courier.trackingNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total Paid:</span>
              <span className="font-black text-gray-900 text-sm">{formatINR(order.pricing.totalPayable)} ({order.paymentMethod})</span>
            </div>

            <div className="pt-2 border-t border-gray-200 text-gray-600">
              <span className="text-gray-400">Deliver To:</span> {order.customer.name}, {order.customer.addressLine}, {order.customer.city} - {order.customer.pincode}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order.orderNumber);
              }}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <Truck className="w-4 h-4" />
              <span>{lang === 'ta' ? 'ஆர்டர் ட்ராக் செய்' : 'Track Order'}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-4 rounded text-xs transition cursor-pointer"
            >
              {lang === 'ta' ? 'தொடர்ந்து ஷாப்பிங் செய்' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
