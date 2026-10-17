import {
  Product,
  CustomerOrder,
  Customer,
  LoginLog,
  NotificationLog,
  AdminStats
} from '../types';

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const url = `/api/products${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async addProduct(productData: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Orders
  async getOrders(): Promise<CustomerOrder[]> {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrder(idOrNumber: string): Promise<CustomerOrder> {
    const res = await fetch(`/api/orders/${idOrNumber}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async createOrder(orderPayload: any): Promise<{
    success: boolean;
    order: CustomerOrder;
    whatsappUrl: string;
    whatsappMessage: string;
    emailPayload: any;
  }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error('Failed to submit order');
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<CustomerOrder> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  // Customers & Logins
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch('/api/customers');
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  async login(payload: {
    identifier: string;
    customerName?: string;
    type?: string;
  }): Promise<{ success: boolean; user: { identifier: string; name: string }; log: LoginLog }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async getLogins(): Promise<LoginLog[]> {
    const res = await fetch('/api/auth/logins');
    if (!res.ok) throw new Error('Failed to fetch login logs');
    return res.json();
  },

  async getNotifications(): Promise<NotificationLog[]> {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async getStats(): Promise<AdminStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
