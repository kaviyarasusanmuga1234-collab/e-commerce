import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ADMIN_CONFIG,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  generateEmailPayload
} from './notification.ts';
import type { OrderNotificationPayload } from './notification.ts';

const mockOrder: OrderNotificationPayload = {
  orderId: 'ORD-9982',
  date: '17/10/2026',
  customer: {
    name: 'Kaviyarasu',
    phone: '9876543210',
    email: 'test@example.com',
    addressLine: '12 Temple Street, T Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017'
  },
  items: [
    {
      name: 'Kanchipuram Pure Silk Bridal Saree (Maroon)',
      quantity: 1,
      price: 4999,
      size: 'Free Size',
      color: 'Maroon Gold'
    }
  ],
  totalAmount: 5028,
  paymentMethod: 'UPI (Google Pay)',
  paymentStatus: 'PAID'
};

test('ADMIN_CONFIG has exact user requested phone and email', () => {
  assert.equal(ADMIN_CONFIG.WHATSAPP_NUMBER, '6374823101');
  assert.equal(ADMIN_CONFIG.WHATSAPP_INTERNATIONAL, '916374823101');
  assert.equal(ADMIN_CONFIG.ADMIN_EMAIL, 'kavaiyaraalsuesienmuga1234@gmail.com');
});

test('generateWhatsAppMessage includes customer and order details', () => {
  const msg = generateWhatsAppMessage(mockOrder);
  assert.ok(msg.includes('ORD-9982'));
  assert.ok(msg.includes('Kaviyarasu'));
  assert.ok(msg.includes('9876543210'));
  assert.ok(msg.includes('Kanchipuram Pure Silk Bridal Saree'));
  assert.ok(msg.includes('5,028'));
});

test('generateWhatsAppUrl encodes phone number and payload correctly', () => {
  const url = generateWhatsAppUrl(mockOrder);
  assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=916374823101'));
  assert.ok(url.includes('ORD-9982'));
});

test('generateEmailPayload prepares email to user recipient', () => {
  const email = generateEmailPayload(mockOrder);
  assert.equal(email.to, 'kavaiyaraalsuesienmuga1234@gmail.com');
  assert.ok(email.subject.includes('ORD-9982'));
  assert.ok(email.body.includes('Chennai'));
  assert.ok(email.html.includes('5,028'));
});
