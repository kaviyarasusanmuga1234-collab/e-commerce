import React, { useState, useEffect } from 'react';
import { CustomerOrder } from '../types';
import { getTrackingSteps, getTrackingProgressPercent } from '../utils/tracking';
import { formatINR } from '../utils/pricing';
import {
  X,
  Search,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ta';
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialOrderNumber
}) => {
  const [searchOrderId, setSearchOrderId] = useState(initialOrderNumber || 'FK-AAL-8921');
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrderDetails = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      if (!res.ok) {
        throw new Error('Order not found. Please verify the Order ID.');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchOrderId(initialOrderNumber);
      fetchOrderDetails(initialOrderNumber);
    } else {
      fetchOrderDetails('FK-AAL-8921');
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderDetails(searchOrderId);
  };

  const steps = order ? getTrackingSteps(order.orderStatus, order.createdAt) : [];
  const progressPercent = order ? getTrackingProgressPercent(order.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-base">
              {lang === 'ta' ? 'ஆர்டர் கண்காணிப்பு (Live Order Tracking)' : 'Flipkart Live Order Tracking'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded-full transition" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. FK-AAL-8921)"
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#2874f0] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'தேடு' : 'Track'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-3 text-center text-xs text-rose-600 font-medium flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            Fetching live shipment tracking from logistics hubs...
          </div>
        ) : order ? (
          <div className="p-6 space-y-6">
            {/* Top Order Overview Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-900">
                  {lang === 'ta' ? 'ஆர்டர் எண்:' : 'Order ID:'} #{order.orderNumber}
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Placed on {order.date} • {order.items.length} items • Total: {formatINR(order.pricing.totalPayable)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block">
                  Expected Delivery
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {order.courier.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="flex items-center justify-between mb-2 text-xs font-semibold text-gray-600">
                <span>Shipment Status</span>
                <span className="font-bold text-[#2874f0]">{order.orderStatus.replace(/_/g, ' ')}</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Step Milestones */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {lang === 'ta' ? 'டெலிவரி மைல்கற்கள்' : 'Tracking Milestones'}
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {steps.map((st, idx) => {
                  return (
                    <div key={st.status} className="relative flex items-start gap-3 text-xs">
                      <div
                        className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                          st.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {st.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold ${
                              st.completed ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {lang === 'ta' ? st.tamilLabel : st.label}
                          </span>
                          {st.timestamp && (
                            <span className="text-[11px] text-gray-500 font-medium">
                              {st.timestamp}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-[11px] mt-0.5">{st.description}</p>
                        {st.location && (
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{st.location}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logistics & Delivery Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 text-xs">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#2874f0]" />
                  <span>Courier & Waybill</span>
                </span>
                <p className="text-gray-600">Partner: <strong>{order.courier.partner}</strong></p>
                <p className="text-gray-600">Tracking No: <span className="font-mono font-bold text-blue-700">{order.courier.trackingNumber}</span></p>
                <p className="text-gray-600">Payment: <strong>{order.paymentMethod} ({order.paymentStatus})</strong></p>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivery Address</span>
                </span>
                <p className="font-semibold text-gray-800">{order.customer.name} ({order.customer.phone})</p>
                <p className="text-gray-600">{order.customer.addressLine}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              </div>
            </div>

            {/* Items in this Order */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h5 className="text-xs font-bold text-gray-700 uppercase">Items in this shipment</h5>
              <div className="space-y-2">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded">
                    <img src={it.image} alt={it.name} className="w-12 h-14 object-cover rounded bg-gray-100" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-gray-900 line-clamp-1">{it.name}</p>
                      <p className="text-gray-500 text-[11px]">Qty: {it.quantity} • Size: {it.selectedSize || 'Free Size'}</p>
                    </div>
                    <span className="text-xs font-black text-gray-900">{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
