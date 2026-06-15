const productModel = require('../models/productModel');
const { HttpError } = require('./authService');

const PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1; // 10% discount for cash payments

function checkout({ items, paymentMethod }) {
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw new HttpError(400, `paymentMethod must be one of: ${PAYMENT_METHODS.join(', ')}`);
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, 'items must be a non-empty array of { productId, quantity }');
  }

  const lineItems = items.map(({ productId, quantity }) => {
    const product = productModel.findById(productId);
    if (!product) {
      throw new HttpError(404, `Product ${productId} not found`);
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new HttpError(400, `quantity for product ${productId} must be a positive integer`);
    }
    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: qty,
      lineTotal: round(product.price * qty),
    };
  });

  const subtotal = round(lineItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const discount = paymentMethod === 'cash' ? round(subtotal * CASH_DISCOUNT_RATE) : 0;
  const total = round(subtotal - discount);

  return { paymentMethod, items: lineItems, subtotal, discount, total };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

module.exports = { checkout };
