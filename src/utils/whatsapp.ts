import { STORE_CONFIG } from '../config/store';
import type { CartItem, CheckoutErrors, CheckoutFormData } from '../types/shop';

export function formatCurrency(amount: number): string {
  return `${STORE_CONFIG.currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= STORE_CONFIG.freeShippingThreshold ? 0 : STORE_CONFIG.standardShippingFee;
}

export function generateOrderNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `AA-${randomDigits}`;
}

export function validateCheckoutForm(form: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!form.fullName.trim() || form.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const cleanPhone = form.phoneNumber.replace(/[^\d+]/g, '');
  if (!cleanPhone || cleanPhone.length < 7) {
    errors.phoneNumber = 'Please enter a valid phone number (at least 7 digits).';
  }

  const whatsappValue = form.sameAsPhone ? form.phoneNumber : form.whatsappNumber;
  const cleanWhatsapp = whatsappValue.replace(/[^\d+]/g, '');
  if (!cleanWhatsapp || cleanWhatsapp.length < 7) {
    errors.whatsappNumber = 'Please enter a valid WhatsApp number.';
  }

  if (!form.address.trim() || form.address.trim().length < 8) {
    errors.address = 'Please enter your complete street address and house/apartment number.';
  }

  if (!form.city.trim() || form.city.trim().length < 2) {
    errors.city = 'Please enter your delivery city.';
  }

  return errors;
}

export function buildWhatsAppOrderMessage(params: {
  orderNumber: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}): string {
  const { orderNumber, customer, items, subtotal, shippingFee, total } = params;
  const effectiveWhatsapp = customer.sameAsPhone ? customer.phoneNumber.trim() : customer.whatsappNumber.trim();

  const itemLines = items
    .map((item, idx) => {
      const lineTotal = item.unitPrice * item.quantity;
      return [
        `${idx + 1}. *${item.name}*`,
        `   Size: ${item.size} | Colour: ${item.color.name}`,
        `   Qty: ${item.quantity} × ${formatCurrency(item.unitPrice)} = ${formatCurrency(lineTotal)}`,
      ].join('\n');
    })
    .join('\n\n');

  const lines = [
    `*NEW ORDER — ${STORE_CONFIG.brandName.toUpperCase()}*`,
    `Order Ref: ${orderNumber}`,
    '',
    '*Customer Details*',
    `• Full Name: ${customer.fullName.trim()}`,
    `• Phone Number: ${customer.phoneNumber.trim()}`,
    `• WhatsApp Number: ${effectiveWhatsapp}`,
    `• Delivery Address: ${customer.address.trim()}`,
    `• City: ${customer.city.trim()}`,
    '',
    '*Selected Items*',
    itemLines,
    '',
    '*Order Summary*',
    `• Subtotal: ${formatCurrency(subtotal)}`,
    `• Delivery: ${shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}`,
    `• *Total Order Amount: ${formatCurrency(total)}*`,
  ];

  if (customer.instructions.trim()) {
    lines.push('', '*Additional Instructions*', customer.instructions.trim());
  }

  lines.push('', 'Please confirm availability and delivery schedule. Thank you!');

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  const cleanNumber = STORE_CONFIG.whatsappBusinessNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
