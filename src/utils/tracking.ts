/**
 * Flipkart-style Order Tracking System
 */

export type OrderStatus = 'ORDER_PLACED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  tamilLabel: string;
  description: string;
  completed: boolean;
  timestamp?: string;
  location?: string;
}

export const ORDER_STATUS_ORDER: OrderStatus[] = [
  'ORDER_PLACED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export function getTrackingSteps(currentStatus: OrderStatus, createdAt: string, updatedAt?: string): TrackingStep[] {
  const currentIndex = ORDER_STATUS_ORDER.indexOf(currentStatus);
  const createdDate = new Date(createdAt || Date.now());

  const addHours = (hours: number) => {
    const d = new Date(createdDate.getTime() + hours * 3600 * 1000);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const stepsConfig: {
    status: OrderStatus;
    label: string;
    tamilLabel: string;
    description: string;
    hours: number;
    location: string;
  }[] = [
    {
      status: 'ORDER_PLACED',
      label: 'Order Confirmed',
      tamilLabel: 'ஆர்டர் உறுதியானது',
      description: 'Your order has been placed and verified',
      hours: 0,
      location: 'Kanchipuram Central Warehouse'
    },
    {
      status: 'PACKED',
      label: 'Packed & Quality Checked',
      tamilLabel: 'பேக்கிங் & தரப் பரிசோதனை முடிந்தது',
      description: 'Item inspected for authentic zari & handloom quality',
      hours: 6,
      location: 'Aalayam Logistics Hub, Chennai'
    },
    {
      status: 'SHIPPED',
      label: 'Shipped (In Transit)',
      tamilLabel: 'பார்சல் அனுப்பப்பட்டது',
      description: 'Handed over to Ekart / BlueDart Logistics',
      hours: 24,
      location: 'South Regional Sorting Facility'
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      tamilLabel: 'டெலிவரிக்கு புறப்பட்டது',
      description: 'Courier executive is on the way to your delivery address',
      hours: 48,
      location: 'Your Local Delivery Hub'
    },
    {
      status: 'DELIVERED',
      label: 'Delivered',
      tamilLabel: 'பார்சல் வழங்கப்பட்டது',
      description: 'Package delivered safely to customer with OTP verification',
      hours: 54,
      location: 'Customer Address'
    }
  ];

  return stepsConfig.map((item, idx) => {
    const isCompleted = currentIndex >= idx;
    return {
      status: item.status,
      label: item.label,
      tamilLabel: item.tamilLabel,
      description: item.description,
      completed: isCompleted,
      timestamp: isCompleted ? addHours(item.hours) : undefined,
      location: item.location
    };
  });
}

export function getTrackingProgressPercent(status: OrderStatus): number {
  switch (status) {
    case 'ORDER_PLACED':
      return 15;
    case 'PACKED':
      return 40;
    case 'SHIPPED':
      return 65;
    case 'OUT_FOR_DELIVERY':
      return 88;
    case 'DELIVERED':
      return 100;
    case 'CANCELLED':
      return 0;
    default:
      return 0;
  }
}
