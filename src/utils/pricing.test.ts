import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderPrice, formatINR, calculateDiscountPercent, estimateDelivery } from './pricing.ts';

test('formatINR formats currency in Indian locale standard', () => {
  assert.equal(formatINR(12500), '₹12,500');
  assert.equal(formatINR(999), '₹999');
  assert.equal(formatINR(0), '₹0');
});

test('calculateDiscountPercent returns correct rounded percentage', () => {
  assert.equal(calculateDiscountPercent(2000, 1000), 50);
  assert.equal(calculateDiscountPercent(3999, 1999), 50);
  assert.equal(calculateDiscountPercent(1000, 1000), 0);
  assert.equal(calculateDiscountPercent(1000, 1200), 0);
});

test('calculateOrderPrice handles empty cart', () => {
  const result = calculateOrderPrice([]);
  assert.equal(result.totalPayable, 0);
  assert.equal(result.deliveryFee, 0);
  assert.equal(result.packagingFee, 0);
});

test('calculateOrderPrice calculates total MRP, discount and free delivery correctly', () => {
  const items = [
    {
      id: 'p1',
      name: 'Kanchipuram Silk Saree',
      price: 2499,
      originalPrice: 4999,
      quantity: 1,
      image: 'test.jpg'
    },
    {
      id: 'p2',
      name: 'Cotton Chudidhar Set',
      price: 899,
      originalPrice: 1499,
      quantity: 2,
      image: 'test2.jpg'
    }
  ];

  // totalMRP = 4999*1 + 1499*2 = 4999 + 2998 = 7997
  // subtotal = 2499*1 + 899*2 = 2499 + 1798 = 4297
  // discount = 7997 - 4297 = 3700
  // subtotal >= 499 -> deliveryFee = 0
  // packagingFee = 29
  // totalPayable = 4297 + 0 + 29 = 4326
  const res = calculateOrderPrice(items);
  assert.equal(res.totalMRP, 7997);
  assert.equal(res.subtotal, 4297);
  assert.equal(res.discount, 3700);
  assert.equal(res.deliveryFee, 0);
  assert.equal(res.packagingFee, 29);
  assert.equal(res.totalPayable, 4326);
  assert.equal(res.isFreeDelivery, true);
});

test('estimateDelivery validates Indian pincodes accurately', () => {
  const tn = estimateDelivery('600001');
  assert.equal(tn.isValid, true);
  assert.equal(tn.days, 2);

  const invalid = estimateDelivery('abc12');
  assert.equal(invalid.isValid, false);
});
