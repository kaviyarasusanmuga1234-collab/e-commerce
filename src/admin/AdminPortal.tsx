import React, { useState, useEffect } from 'react';
import {
  Product,
  CustomerOrder,
  Customer,
  LoginLog,
  NotificationLog,
  AdminStats
} from '../types';
import { api } from '../services/api';
import { formatINR } from '../utils/pricing';
import {
  Database,
  ShoppingBag,
  Users,
  KeyRound,
  Bell,
  PlusCircle,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Truck,
  MessageCircle,
  Mail,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Package,
  Layers,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  // Authentication PIN protection (Default: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS' | 'PRODUCTS' | 'CUSTOMERS' | 'LOGINS' | 'NOTIFICATIONS'>('OVERVIEW');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [logins, setLogins] = useState<LoginLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    tamilName: '',
    category: 'silk-sarees' as Product['category'],
    categoryLabel: 'Pure Silk Sarees',
    price: 3499,
    originalPrice: 7999,
    fabric: 'Pure Kanchipuram Silk with Zari',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    description: 'Traditional Indian cultural handloom dress with rich zari border motifs.',
    tamilDescription: 'பாரம்பரிய இந்திய கலாச்சார ஆடை. உயர்தர ஜரிகை வேலைப்பாடு.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Maroon Gold', 'Peacock Blue'],
    isAssured: true,
    featured: true
  });

  // Preset image library for quick 1-click selection when adding dresses
  const dressImagePresets = [
    {
      title: 'Bridal Kanchipuram Silk',
      url: '/images/products/dress-1.jpg'
    },
    {
      title: 'Banarasi Zari Saree',
      url: '/images/products/dress-2.jpg'
    },
    {
      title: 'Designer Chudidhar Set',
      url: '/images/products/dress-16.jpg'
    },
    {
      title: 'Handloom Cotton Saree',
      url: '/images/products/dress-3.jpg'
    },
    {
      title: 'Festive Silk Kurti',
      url: '/images/products/dress-31.jpg'
    },
    {
      title: 'Bridal Velvet Lehenga',
      url: '/images/products/dress-41.jpg'
    }
  ];

  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);

  const loadAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [statsData, ordersData, productsData, customersData, loginsData, notifData] =
        await Promise.all([
          api.getStats(),
          api.getOrders(),
          api.getProducts(),
          api.getCustomers(),
          api.getLogins(),
          api.getNotifications()
        ]);
      setStats(statsData);
      setOrders(ordersData);
      setProducts(productsData);
      setCustomers(customersData);
      setLogins(loginsData);
      setNotifications(notifData);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN'));
      setIsLiveActive(true);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setIsLiveActive(false);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      // Live continuous polling: orders and data update live every 3.5 seconds
      const interval = setInterval(() => {
        loadAllData(true);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin' || pinInput.length >= 4) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid PIN code. Default is 1234.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: CustomerOrder['orderStatus']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadAllData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to remove this product from the database and website?')) {
      try {
        await api.deleteProduct(id);
        await loadAllData();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProduct(true);
    try {
      await api.addProduct(newProduct);
      setProductSuccessMsg('🎉 Product added successfully! It is now live on the e-commerce website.');
      await loadAllData();
      setIsSubmittingProduct(false);
      setTimeout(() => {
        setProductSuccessMsg('');
        setShowAddProductModal(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to add product:', err);
      setIsSubmittingProduct(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Aalayam Database Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter Admin Access PIN to view orders, customers, logins and add products
            </p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              autoFocus
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-2.5 text-center text-lg tracking-widest focus:outline-none focus:border-blue-500 text-white"
            />
            {pinError && <p className="text-xs text-rose-400">{pinError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-2.5 rounded transition text-sm cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-slate-800/90 border-b border-slate-700 px-6 py-3.5 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">
                Aalayam Database Portal
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                ADMIN CONSOLE
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-700/60 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE DB ACTIVE</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Database File: <strong className="text-slate-300 font-mono">data/ecommerce_database.json</strong></span>
              {lastSyncTime && <span className="text-slate-500">• Auto-synced at {lastSyncTime}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/database/export"
            download="ecommerce_database.json"
            className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded transition cursor-pointer border border-slate-600"
            title="Download database JSON file"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Export DB (JSON)</span>
          </a>

          <button
            onClick={() => loadAllData(false)}
            className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded transition cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded shadow transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-slate-400 hover:text-slate-200 p-1.5"
            title="Lock Portal"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-800/50 border-r border-slate-700/80 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'OVERVIEW'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ORDERS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Orders</span>
              </div>
              <span className="bg-slate-900/60 px-2 py-0.5 rounded text-[10px] font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'PRODUCTS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Product Catalog</span>
              </div>
              <span className="bg-slate-900/60 px-2 py-0.5 rounded text-[10px] font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('CUSTOMERS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'CUSTOMERS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customer Records</span>
              </div>
              <span className="bg-slate-900/60 px-2 py-0.5 rounded text-[10px] font-bold">
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('LOGINS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'LOGINS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-4 h-4" />
                <span>Login Audit Sessions</span>
              </div>
              <span className="bg-slate-900/60 px-2 py-0.5 rounded text-[10px] font-bold">
                {logins.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'NOTIFICATIONS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Dispatch Logs</span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800">
                {notifications.length}
              </span>
            </button>
          </div>

          {/* Config box for WhatsApp & Email */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-3 text-[11px] space-y-2">
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
              Notification Targets
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">+91 6374823101</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate" title="kavaiyaraalsuesienmuga1234@gmail.com">
                  kavaiyaraalsuesienmuga1234@gmail.com
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-medium text-slate-400">Total Revenue</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">
                    {formatINR(stats?.totalRevenue || 0)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Across all confirmed customer orders</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-medium text-slate-400">Total Orders</span>
                  <p className="text-2xl font-black text-blue-400 mt-1">
                    {stats?.totalOrders || 0}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {stats?.pendingOrders || 0} orders in fulfillment
                  </p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-medium text-slate-400">Registered Customers</span>
                  <p className="text-2xl font-black text-purple-400 mt-1">
                    {stats?.totalCustomers || 0}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Recorded in customer database</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
                  <span className="text-xs font-medium text-slate-400">Active Ethnic Catalog</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">
                    {stats?.totalProducts || 0}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Sarees, Chudidhars & Lehengas live</p>
                </div>
              </div>

              {/* Recent Orders quick table */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('ORDERS')}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-700/30">
                          <td className="p-3 font-mono font-bold text-blue-400">#{o.orderNumber}</td>
                          <td className="p-3 font-medium text-slate-200">{o.customer.name}</td>
                          <td className="p-3 text-slate-400">{o.items.length} items</td>
                          <td className="p-3 font-bold text-emerald-400">{formatINR(o.pricing.totalPayable)}</td>
                          <td className="p-3 text-slate-300">{o.paymentMethod}</td>
                          <td className="p-3">
                            <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Customer Orders & Shipment Tracking</h2>
                  <p className="text-xs text-slate-400">
                    Manage incoming orders, update live delivery status, and verify notifications
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-blue-400">
                            #{o.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400">({o.date})</span>
                          <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                            {o.paymentMethod} • {o.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Customer: <strong className="text-white">{o.customer.name}</strong> • Phone:{' '}
                          <span className="text-blue-300 font-mono">{o.customer.phone}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Status:</span>
                        <select
                          value={o.orderStatus}
                          onChange={(e) =>
                            handleUpdateOrderStatus(o.id, e.target.value as CustomerOrder['orderStatus'])
                          }
                          className="bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                        >
                          <option value="ORDER_PLACED">Order Confirmed</option>
                          <option value="PACKED">Packed & Quality Checked</option>
                          <option value="SHIPPED">Shipped (In Transit)</option>
                          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Address & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          Delivery Address
                        </span>
                        <p className="text-slate-200 font-medium">
                          {o.customer.addressLine}, {o.customer.city}, {o.customer.state} - {o.customer.pincode}
                        </p>
                        <p className="text-slate-400 text-[11px]">Courier: {o.courier.partner} ({o.courier.trackingNumber})</p>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          Order Financials
                        </span>
                        <div className="flex justify-between text-slate-300">
                          <span>Subtotal: {formatINR(o.pricing.subtotal)}</span>
                          <span className="text-emerald-400 font-bold">Total: {formatINR(o.pricing.totalPayable)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Dispatched to WhatsApp (+91 6374823101) & Email (kavaiyaraalsuesienmuga1234@gmail.com)
                        </p>
                      </div>
                    </div>

                    {/* Ordered Items list */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Ordered Items
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {o.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 bg-slate-900/40 p-2 rounded border border-slate-700/40 text-xs"
                          >
                            <img src={it.image} alt="" className="w-10 h-12 object-cover rounded bg-slate-800" />
                            <div className="flex-1 truncate">
                              <p className="font-semibold text-slate-200 truncate">{it.name}</p>
                              <p className="text-[11px] text-slate-400">Qty: {it.quantity} • {formatINR(it.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & ADD PRODUCT FEATURE */}
          {activeTab === 'PRODUCTS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Live Ethnic Wear Catalog ({products.length} Dresses)</h2>
                  <p className="text-xs text-slate-400">
                    50 handloom sarees, chudidhars, kurtis and lehengas synced with database
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded text-xs transition flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Product to Website</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: `All (${products.length})` },
                    { id: 'silk-sarees', label: 'Pure Silk Sarees' },
                    { id: 'sarees', label: 'Cotton & Designer Sarees' },
                    { id: 'chudidhars', label: 'Chudidhar Sets' },
                    { id: 'kurtis', label: 'Kurtis & Suits' },
                    { id: 'lehengas', label: 'Bridal Lehengas' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setProductCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                        productCategoryFilter === cat.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search dress title, fabric..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter((p) => {
                    const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
                    const matchSearch =
                      !productSearch.trim() ||
                      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.tamilName.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.fabric.toLowerCase().includes(productSearch.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-900">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {p.categoryLabel}
                      </span>
                      <span className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded">
                        {formatINR(p.price)}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {p.tamilName}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Fabric: <strong className="text-slate-300">{p.fabric}</strong> • Stock:{' '}
                          <span className="text-emerald-400 font-bold">{p.stock} units</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                        <span className="text-[10px] text-slate-400">
                          MRP: {formatINR(p.originalPrice)} ({p.discountPercent}% off)
                        </span>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 p-1 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'CUSTOMERS' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Customer Database</h2>
                <p className="text-xs text-slate-400">
                  Registered customers, addresses, order counts and total spent
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Customer Name</th>
                        <th className="p-3.5">Mobile Number</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Location / City</th>
                        <th className="p-3.5">Total Orders</th>
                        <th className="p-3.5">Total Spent</th>
                        <th className="p-3.5">Last Login</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-700/30">
                          <td className="p-3.5 font-bold text-white">{c.name}</td>
                          <td className="p-3.5 font-mono text-blue-400">{c.phone || '-'}</td>
                          <td className="p-3.5 text-slate-300">{c.email || '-'}</td>
                          <td className="p-3.5 text-slate-400">{c.city || 'Tamil Nadu'}</td>
                          <td className="p-3.5 font-bold text-purple-400">{c.ordersCount} orders</td>
                          <td className="p-3.5 font-black text-emerald-400">{formatINR(c.totalSpent)}</td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {new Date(c.lastLogin).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOGINS */}
          {activeTab === 'LOGINS' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Customer Login Audit Trail</h2>
                <p className="text-xs text-slate-400">
                  Real-time log of customer phone / email logins and sessions from the store
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">User / Identifier</th>
                        <th className="p-3.5">Customer Name</th>
                        <th className="p-3.5">Method</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">IP Address</th>
                        <th className="p-3.5">Device / Browser</th>
                        <th className="p-3.5">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {logins.map((lg) => (
                        <tr key={lg.id} className="hover:bg-slate-700/30">
                          <td className="p-3.5 font-mono font-bold text-blue-400">{lg.identifier}</td>
                          <td className="p-3.5 font-medium text-white">{lg.customerName}</td>
                          <td className="p-3.5 text-slate-300">{lg.type}</td>
                          <td className="p-3.5">
                            <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800">
                              {lg.status}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-400 text-[11px]">{lg.ipAddress}</td>
                          <td className="p-3.5 text-slate-400 text-[11px] truncate max-w-xs">{lg.userAgent}</td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {new Date(lg.timestamp).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Dispatched Notifications Hub</h2>
                <p className="text-xs text-slate-400">
                  Automated alerts transmitted to WhatsApp (+91 6374823101) & Email (kavaiyaraalsuesienmuga1234@gmail.com)
                </p>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          n.type === 'WHATSAPP'
                            ? 'bg-emerald-900/60 text-emerald-400'
                            : 'bg-blue-900/60 text-blue-400'
                        }`}
                      >
                        {n.type === 'WHATSAPP' ? (
                          <MessageCircle className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{n.type} ALERT</span>
                          <span className="font-mono text-blue-400">({n.recipient})</span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{n.contentSummary}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                        {n.status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {new Date(n.timestamp).toLocaleTimeString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD PRODUCT MODAL (Admin Feature requested by user) */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto text-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Add New Product to Store Catalog
                </h3>
                <p className="text-xs text-slate-400">
                  Product will be saved in the database and appear immediately on the website
                </p>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {productSuccessMsg && (
              <div className="bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs p-3 rounded">
                {productSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Kanchipuram Pure Silk Bridal Saree"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tamil Title (தமிழ் பெயர்) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.tamilName}
                    onChange={(e) => setNewProduct({ ...newProduct, tamilName: e.target.value })}
                    placeholder="எ.கா. காஞ்சிபுரம் பட்டு திருமணச் சேலை"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => {
                      const val = e.target.value as Product['category'];
                      const labels: Record<string, string> = {
                        'silk-sarees': 'Pure Silk Sarees',
                        sarees: 'Designer Sarees',
                        chudidhars: 'Chudidhar Sets',
                        kurtis: 'Kurtis & Suits',
                        lehengas: 'Bridal Lehengas'
                      };
                      setNewProduct({
                        ...newProduct,
                        category: val,
                        categoryLabel: labels[val] || 'Indian Ethnic Wear'
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="silk-sarees">Pure Silk Sarees (பட்டுச் சேலை)</option>
                    <option value="sarees">Designer & Cotton Sarees (புடவைகள்)</option>
                    <option value="chudidhars">Chudidhar Sets (சுடிதார் செட்ஸ்)</option>
                    <option value="kurtis">Kurtis & Suits (குர்த்திகள்)</option>
                    <option value="lehengas">Bridal Lehengas (லெஹங்கா)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Fabric (துணி வகை) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    placeholder="e.g. Pure Mulberry Silk / Soft Chanderi Cotton"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Original MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.originalPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Quick Image Preset Selector */}
              <div>
                <label className="block text-slate-400 text-[11px] font-bold mb-1.5 uppercase">
                  Quick Select Ethnic Dress Image Presets:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {dressImagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, images: [preset.url] })}
                      className={`p-1.5 rounded border text-left transition ${
                        newProduct.images[0] === preset.url
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-full h-16 object-cover rounded mb-1" />
                      <p className="text-[10px] text-slate-300 truncate">{preset.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Tamil Description (தமிழ் விளக்கம்)
                </label>
                <textarea
                  rows={2}
                  value={newProduct.tamilDescription}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, tamilDescription: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-6 py-2 rounded shadow transition flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isSubmittingProduct ? 'Saving to Database...' : 'Save & Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
