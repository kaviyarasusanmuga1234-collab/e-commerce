export interface Product {
  id: string;
  name: string;
  tamilName: string;
  category: 'sarees' | 'silk-sarees' | 'chudidhars' | 'kurtis' | 'lehengas';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  images: string[];
  fabric: string;
  description: string;
  tamilDescription: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isAssured: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  tamilName?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
  stock: number;
}

export type OrderStatus = 'ORDER_PLACED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    name: string;
    tamilName?: string;
    image: string;
    price: number;
    originalPrice: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  pricing: {
    totalMRP: number;
    discount: number;
    subtotal: number;
    deliveryFee: number;
    packagingFee: number;
    totalPayable: number;
  };
  paymentMethod: 'UPI' | 'COD' | 'CARD' | 'NET_BANKING';
  paymentDetails?: {
    upiApp?: string;
    upiId?: string;
    transactionRef?: string;
  };
  paymentStatus: 'PAID' | 'PENDING' | 'COD_VERIFIED';
  orderStatus: OrderStatus;
  courier: {
    partner: string;
    trackingNumber: string;
    estimatedDelivery: string;
  };
  notifications: {
    whatsappSent: boolean;
    whatsappTo: string;
    emailSent: boolean;
    emailTo: string;
    sentAt: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ordersCount: number;
  totalSpent: number;
  lastLogin: string;
  createdAt: string;
}

export interface LoginLog {
  id: string;
  identifier: string;
  customerName?: string;
  type: 'PHONE_OTP' | 'EMAIL_OTP' | 'PASSWORD';
  status: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface NotificationLog {
  id: string;
  orderId: string;
  type: 'WHATSAPP' | 'EMAIL';
  recipient: string;
  contentSummary: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  timestamp: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  notificationsSent: number;
  settings: {
    whatsappNumber: string;
    adminEmail: string;
    storeName: string;
    storeUpiId: string;
  };
  dbFile?: string;
  lastUpdated?: string;
}
