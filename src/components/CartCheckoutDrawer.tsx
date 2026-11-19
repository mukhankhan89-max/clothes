import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import type { CartItem, CheckoutErrors, CheckoutFormData, OrderReceipt } from '../types/shop';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateShipping,
  formatCurrency,
  generateOrderNumber,
  validateCheckoutForm,
} from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

export type DrawerStep = 'cart' | 'checkout' | 'awaiting-whatsapp' | 'confirmed';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  step: DrawerStep;
  items: CartItem[];
  onClose: () => void;
  onStepChange: (step: DrawerStep) => void;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

const INITIAL_FORM: CheckoutFormData = {
  fullName: '',
  phoneNumber: '',
  whatsappNumber: '',
  sameAsPhone: true,
  address: '',
  city: '',
  instructions: '',
};

export function CartCheckoutDrawer({
  isOpen,
  step,
  items,
  onClose,
  onStepChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartCheckoutDrawerProps) {
  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [pendingReceipt, setPendingReceipt] = useState<OrderReceipt | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = calculateShipping(subtotal);
  const total = subtotal + shippingFee;
  const remainingForFreeShipping = Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal);

  const handleFieldChange = <K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePrepareWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorFieldId: Record<string, string> = {
        fullName: 'checkout-name',
        phoneNumber: 'checkout-phone',
        whatsappNumber: 'checkout-whatsapp',
        address: 'checkout-address',
        city: 'checkout-city',
      };
      const firstKey = Object.keys(validationErrors)[0];
      const targetId = firstKey ? firstErrorFieldId[firstKey] : undefined;
      if (targetId) {
        const el = document.getElementById(targetId);
        el?.focus();
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const orderNumber = generateOrderNumber();
    const messageText = buildWhatsAppOrderMessage({
      orderNumber,
      customer: form,
      items,
      subtotal,
      shippingFee,
      total,
    });
    const whatsappUrl = buildWhatsAppUrl(messageText);

    const receipt: OrderReceipt = {
      orderNumber,
      createdAt: new Date().toLocaleString(),
      customer: { ...form },
      items: [...items],
      subtotal,
      shippingFee,
      total,
      whatsappUrl,
      messageText,
    };

    setPendingReceipt(receipt);
    setCopiedMessage(false);
    onStepChange('awaiting-whatsapp');

    // Trigger anchor click to open WhatsApp Click-to-Chat cleanly without window.open
    const anchor = document.createElement('a');
    anchor.href = whatsappUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleMarkSentOnWhatsApp = () => {
    onClearCart();
    onStepChange('confirmed');
  };

  const handleCopyMessage = async () => {
    if (!pendingReceipt) return;
    try {
      await navigator.clipboard.writeText(pendingReceipt.messageText);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Clipboard API unavailable in restricted context
    }
  };

  const handleStartNewShopping = () => {
    setPendingReceipt(null);
    setForm(INITIAL_FORM);
    setErrors({});
    onStepChange('cart');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <aside className="relative z-10 w-full max-w-lg bg-[#FCFBF9] h-full border-l border-[#E7DDD2] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 h-16 border-b border-[#E7DDD2] flex items-center justify-between gap-3 shrink-0 bg-[#FCFBF9]">
          <div className="flex items-center gap-2 min-w-0">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => onStepChange('cart')}
                aria-label="Back to shopping bag"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-lg text-[#594E47] hover:text-[#1F1A17] hover:bg-[#F5EFE8]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {step === 'awaiting-whatsapp' && (
              <button
                type="button"
                onClick={() => onStepChange('checkout')}
                aria-label="Edit checkout details"
                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-lg text-[#594E47] hover:text-[#1F1A17] hover:bg-[#F5EFE8]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-serif text-2xl font-semibold text-[#1F1A17] truncate">
              {step === 'cart' && `Shopping Bag (${items.reduce((s, i) => s + i.quantity, 0)})`}
              {step === 'checkout' && 'Checkout Details'}
              {step === 'awaiting-whatsapp' && 'Send via WhatsApp'}
              {step === 'confirmed' && 'Order Submitted'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-lg text-[#594E47] hover:text-[#1F1A17] hover:bg-[#F5EFE8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SHOPPING BAG */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[#F5EFE8] border border-[#E7DDD2] flex items-center justify-center text-[#9A7845] mb-4">
                    <ShoppingBag className="w-6 h-6" strokeWidth={1.6} />
                  </div>
                  <p className="font-serif text-2xl font-medium text-[#1F1A17]">
                    Your shopping bag is empty
                  </p>
                  <p className="mt-2 text-sm text-[#594E47] max-w-xs">
                    Explore our silk evening gowns, eastern embroidered suits, abayas, and tailored sets to begin your order.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 min-h-[44px] px-6 py-2.5 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-sm font-medium transition-colors"
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Delivery threshold banner */}
                  <div className="rounded-xl bg-[#F5EFE8] border border-[#E7DDD2] p-3.5 text-xs text-[#594E47]">
                    {remainingForFreeShipping === 0 ? (
                      <p className="font-medium text-[#1F1A17]">
                        Your order qualifies for complimentary Atelier delivery.
                      </p>
                    ) : (
                      <p>
                        Add{' '}
                        <span className="font-semibold text-[#1F1A17] tabular-nums">
                          {formatCurrency(remainingForFreeShipping)}
                        </span>{' '}
                        more for complimentary delivery.
                      </p>
                    )}
                  </div>

                  {/* Cart Item List */}
                  <ul className="divide-y divide-[#EFE7DE]">
                    {items.map((item) => (
                      <li key={item.key} className="py-4 flex gap-3.5">
                        <div className="w-20 h-28 rounded-lg overflow-hidden bg-[#F5EFE8] border border-[#E7DDD2] shrink-0">
                          <ResilientImage
                            src={item.image}
                            alt={item.name}
                            fallbackTitle={item.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-serif text-base font-semibold text-[#1F1A17] leading-snug">
                                {item.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.key)}
                                aria-label={`Remove ${item.name}`}
                                className="min-h-[36px] min-w-[36px] -mt-1 -mr-1.5 flex items-center justify-center text-[#61554D] hover:text-[#9E3F35] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="mt-0.5 text-xs text-[#61554D]">
                              Size: <span className="font-medium text-[#1F1A17]">{item.size}</span>
                              <span className="mx-1.5" aria-hidden="true">
                                ·
                              </span>
                              Colour:{' '}
                              <span className="font-medium text-[#1F1A17]">{item.color.name}</span>
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="inline-flex items-center rounded-lg border border-[#E7DDD2] bg-[#FCFBF9]">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                                aria-label={`Decrease quantity for ${item.name}`}
                                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#1F1A17] hover:bg-[#F5EFE8] rounded-l-lg"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                                aria-label={`Increase quantity for ${item.name}`}
                                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#1F1A17] hover:bg-[#F5EFE8] rounded-r-lg"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right tabular-nums">
                              <p className="text-sm font-semibold text-[#1F1A17]">
                                {formatCurrency(item.unitPrice * item.quantity)}
                              </p>
                              {item.originalPrice > item.unitPrice && (
                                <p className="text-[11px] text-[#61554D] line-through">
                                  {formatCurrency(item.originalPrice * item.quantity)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#E7DDD2] bg-[#F5EFE8] px-4 sm:px-6 py-4 space-y-3 shrink-0">
                <div className="space-y-1.5 text-sm tabular-nums">
                  <div className="flex justify-between text-[#594E47]">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#1F1A17]">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#594E47]">
                    <span>Delivery</span>
                    <span className="font-medium text-[#1F1A17]">
                      {shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#DFD3C5] flex justify-between text-base font-semibold text-[#1F1A17]">
                    <span>Estimated Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStepChange('checkout')}
                  className="w-full min-h-[48px] px-5 py-3 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-sm font-semibold transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM & ORDER SUMMARY */}
        {step === 'checkout' && (
          <form onSubmit={handlePrepareWhatsAppOrder} noValidate className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
              {/* Order Summary Box */}
              <div className="rounded-xl bg-[#F5EFE8] border border-[#E7DDD2] p-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#DFD3C5]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1F1A17]">
                    Order Summary
                  </p>
                  <button
                    type="button"
                    onClick={() => onStepChange('cart')}
                    className="text-xs font-medium text-[#7A5C30] hover:text-[#1F1A17] underline underline-offset-2"
                  >
                    Edit Bag
                  </button>
                </div>

                <ul className="mt-2.5 space-y-2 text-xs">
                  {items.map((item) => (
                    <li key={item.key} className="flex justify-between gap-2 text-[#1F1A17]">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-[#61554D]">
                          {item.size} · {item.color.name} · Qty {item.quantity} ×{' '}
                          {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <span className="font-semibold tabular-nums shrink-0">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 pt-2.5 border-t border-[#DFD3C5] space-y-1 text-xs tabular-nums">
                  <div className="flex justify-between text-[#594E47]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#594E47]">
                    <span>Delivery</span>
                    <span>{shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#1F1A17] pt-1">
                    <span>Total Order Amount</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Delivery Information */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-semibold text-[#1F1A17] mb-1.5">
                    Full Name <span className="text-[#9E3F35]">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="e.g., Ayesha Siddiqui"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-[#FCFBF9] text-sm text-[#1F1A17] focus:outline-none ${
                      errors.fullName ? 'border-[#9E3F35]' : 'border-[#D8CBB9] focus:border-[#9A7845]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-[#9E3F35]">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-semibold text-[#1F1A17] mb-1.5">
                    Phone Number <span className="text-[#9E3F35]">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={form.phoneNumber}
                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                    placeholder="e.g., +1 555 234 5678"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-[#FCFBF9] text-sm text-[#1F1A17] focus:outline-none ${
                      errors.phoneNumber ? 'border-[#9E3F35]' : 'border-[#D8CBB9] focus:border-[#9A7845]'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-[#9E3F35]">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="checkout-whatsapp" className="text-xs font-semibold text-[#1F1A17]">
                      WhatsApp Number <span className="text-[#9E3F35]">*</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs text-[#594E47] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.sameAsPhone}
                        onChange={(e) => handleFieldChange('sameAsPhone', e.target.checked)}
                        className="w-4 h-4 accent-[#1F1A17] rounded"
                      />
                      <span>Same as phone</span>
                    </label>
                  </div>
                  <input
                    id="checkout-whatsapp"
                    type="tel"
                    required
                    disabled={form.sameAsPhone}
                    value={form.sameAsPhone ? form.phoneNumber : form.whatsappNumber}
                    onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                    placeholder="Enter your WhatsApp number"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-[#1F1A17] focus:outline-none ${
                      form.sameAsPhone ? 'bg-[#F5EFE8] text-[#61554D]' : 'bg-[#FCFBF9]'
                    } ${
                      errors.whatsappNumber
                        ? 'border-[#9E3F35]'
                        : 'border-[#D8CBB9] focus:border-[#9A7845]'
                    }`}
                  />
                  {errors.whatsappNumber && (
                    <p className="mt-1 text-xs text-[#9E3F35]">{errors.whatsappNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-address" className="block text-xs font-semibold text-[#1F1A17] mb-1.5">
                    Complete Delivery Address <span className="text-[#9E3F35]">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="House / Apt #, Street, Neighbourhood"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-[#FCFBF9] text-sm text-[#1F1A17] focus:outline-none ${
                      errors.address ? 'border-[#9E3F35]' : 'border-[#D8CBB9] focus:border-[#9A7845]'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-[#9E3F35]">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-city" className="block text-xs font-semibold text-[#1F1A17] mb-1.5">
                    City <span className="text-[#9E3F35]">*</span>
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="e.g., London, Dubai, Lahore, New York"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-[#FCFBF9] text-sm text-[#1F1A17] focus:outline-none ${
                      errors.city ? 'border-[#9E3F35]' : 'border-[#D8CBB9] focus:border-[#9A7845]'
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-xs text-[#9E3F35]">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="checkout-notes" className="block text-xs font-semibold text-[#1F1A17] mb-1.5">
                    Additional Instructions <span className="font-normal text-[#61554D]">(Optional)</span>
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={2}
                    value={form.instructions}
                    onChange={(e) => handleFieldChange('instructions', e.target.value)}
                    placeholder="Custom sleeve length, gift wrapping, or preferred delivery hours..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CBB9] bg-[#FCFBF9] text-sm text-[#1F1A17] focus:outline-none focus:border-[#9A7845]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#E7DDD2] bg-[#F5EFE8] px-4 sm:px-6 py-4 shrink-0">
              <button
                type="submit"
                className="w-full min-h-[48px] px-5 py-3 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#EAD7D1]" />
                <span>Place Order via WhatsApp</span>
              </button>
              <p className="mt-2 text-[11px] text-center text-[#61554D]">
                Opens WhatsApp with your complete itemized order ready to send.
              </p>
            </div>
          </form>
        )}

        {/* STEP 3: AWAITING USER TO ACTUALLY SEND IN WHATSAPP (NOT CONFIRMED YET) */}
        {step === 'awaiting-whatsapp' && pendingReceipt && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="rounded-xl bg-[#F5EFE8] border border-[#E7DDD2] p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#7A5C30] font-semibold">
                  Action Required · Order Not Yet Confirmed
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-semibold text-[#1F1A17]">
                  Send your pre-filled message in WhatsApp
                </h3>
                <p className="mt-2 text-sm text-[#594E47] leading-relaxed">
                  We have prepared your order{' '}
                  <span className="font-semibold text-[#1F1A17] tabular-nums">
                    {pendingReceipt.orderNumber}
                  </span>{' '}
                  for{' '}
                  <span className="font-semibold text-[#1F1A17] tabular-nums">
                    {formatCurrency(pendingReceipt.total)}
                  </span>
                  . Your order is only confirmed once you send the message to our WhatsApp concierge ({STORE_CONFIG.whatsappDisplayNumber}).
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={pendingReceipt.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="min-h-[44px] px-4 py-2.5 rounded-lg border border-[#D8CBB9] bg-[#FCFBF9] text-[#1F1A17] hover:bg-[#EDE3D8] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-4 h-4 text-[#7A5C30]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#61554D] mb-2">
                  Prepared WhatsApp Order Message
                </p>
                <pre className="rounded-xl border border-[#E7DDD2] bg-[#FCFBF9] p-4 text-xs text-[#1F1A17] whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">
                  {pendingReceipt.messageText}
                </pre>
              </div>
            </div>

            <div className="border-t border-[#E7DDD2] pt-4 space-y-2.5">
              <button
                type="button"
                onClick={handleMarkSentOnWhatsApp}
                className="w-full min-h-[48px] px-5 py-3 rounded-lg bg-[#7A5C30] text-[#FCFBF9] hover:bg-[#614824] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Have Sent the WhatsApp Message</span>
              </button>
              <button
                type="button"
                onClick={() => onStepChange('checkout')}
                className="w-full min-h-[44px] px-4 py-2 text-xs font-medium text-[#594E47] hover:text-[#1F1A17]"
              >
                Back to Edit Details
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMED RECEIPT (ONLY AFTER USER CONFIRMS SENDING) */}
        {step === 'confirmed' && pendingReceipt && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 flex flex-col justify-between gap-6">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#F5EFE8] border border-[#E7DDD2] flex items-center justify-center text-[#7A5C30] mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#7A5C30] font-semibold">
                Order {pendingReceipt.orderNumber} · WhatsApp Sent
              </p>
              <h3 className="mt-1.5 font-serif text-3xl font-semibold text-[#1F1A17]">
                Thank you, {pendingReceipt.customer.fullName.split(' ')[0]}
              </h3>
              <p className="mt-2 text-sm text-[#594E47] leading-relaxed">
                Our concierge team has received your WhatsApp order request and will confirm dispatch details shortly on{' '}
                <span className="font-medium text-[#1F1A17]">
                  {pendingReceipt.customer.sameAsPhone
                    ? pendingReceipt.customer.phoneNumber
                    : pendingReceipt.customer.whatsappNumber}
                </span>
                .
              </p>

              <div className="mt-6 rounded-xl bg-[#F5EFE8] border border-[#E7DDD2] p-4 space-y-3 text-xs">
                <div className="flex justify-between text-[#594E47]">
                  <span>Delivery Address</span>
                  <span className="text-right font-medium text-[#1F1A17] max-w-[60%]">
                    {pendingReceipt.customer.address}, {pendingReceipt.customer.city}
                  </span>
                </div>
                <div className="pt-2.5 border-t border-[#DFD3C5] space-y-1.5">
                  {pendingReceipt.items.map((item) => (
                    <div key={item.key} className="flex justify-between text-[#1F1A17]">
                      <span>
                        {item.quantity}× {item.name} ({item.size}, {item.color.name})
                      </span>
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2.5 border-t border-[#DFD3C5] flex justify-between text-sm font-semibold text-[#1F1A17] tabular-nums">
                  <span>Total Order Amount</span>
                  <span>{formatCurrency(pendingReceipt.total)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartNewShopping}
              className="w-full min-h-[48px] px-5 py-3 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-sm font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
