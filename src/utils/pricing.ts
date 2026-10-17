/**
 * Pure pricing and cart calculation utilities
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
}

export interface PriceBreakdown {
  totalMRP: number;
  discount: number;
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  totalPayable: number;
  totalSavings: number;
  freeDeliveryThreshold: number;
  isFreeDelivery: boolean;
}

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function calculateOrderPrice(items: CartItem[]): PriceBreakdown {
  const totalMRP = items.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Math.max(0, totalMRP - subtotal);
  
  const freeDeliveryThreshold = 499;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || items.length === 0;
  const deliveryFee = items.length === 0 ? 0 : (isFreeDelivery ? 0 : 40);
  const packagingFee = items.length === 0 ? 0 : 29;
  
  const totalPayable = subtotal + deliveryFee + packagingFee;
  const totalSavings = discount + (isFreeDelivery && items.length > 0 ? 40 : 0);

  return {
    totalMRP,
    discount,
    subtotal,
    deliveryFee,
    packagingFee,
    totalPayable,
    totalSavings,
    freeDeliveryThreshold,
    isFreeDelivery
  };
}

export function calculateDiscountPercent(originalPrice: number, discountedPrice: number): number {
  if (!originalPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function estimateDelivery(pincode: string): { isValid: boolean; message: string; days: number } {
  const cleanPin = pincode.trim();
  if (!/^\d{6}$/.test(cleanPin)) {
    return { isValid: false, message: 'Invalid 6-digit Pincode', days: 0 };
  }
  
  // Tamil Nadu pincodes start with 600xxx to 643xxx
  const pinNum = parseInt(cleanPin, 10);
  if (pinNum >= 600000 && pinNum <= 643999) {
    return { isValid: true, message: 'Fast Delivery in 1-2 days (Tamil Nadu Express)', days: 2 };
  } else if (pinNum >= 500000 && pinNum <= 599999) {
    return { isValid: true, message: 'Delivery in 2-3 days (South India Hub)', days: 3 };
  }
  return { isValid: true, message: 'Standard Delivery in 3-5 days across India', days: 4 };
}
