import { useEffect, useState } from 'react';
import { Check, Minus, Plus, Ruler, ShoppingBag, X } from 'lucide-react';
import type { Product, ProductColor, ProductSize } from '../types/shop';
import { formatCurrency } from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: ProductSize, color: ProductColor, quantity: number) => void;
  onBuyNow: (product: Product, size: ProductSize, color: ProductColor, quantity: number) => void;
}

const SIZE_CHART = [
  { size: 'XS', bust: '32"', waist: '25"', hip: '35"' },
  { size: 'S', bust: '34"', waist: '27"', hip: '37"' },
  { size: 'M', bust: '36"', waist: '29"', hip: '39"' },
  { size: 'L', bust: '38.5"', waist: '31.5"', hip: '41.5"' },
  { size: 'XL', bust: '41"', waist: '34"', hip: '44"' },
  { size: 'XXL', bust: '44"', waist: '37"', hip: '47"' },
];

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes.includes('M') ? 'M' : product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      setShowSizeGuide(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeColor = selectedColor || product.colors[0];
  const hasDiscount = typeof product.salePrice === 'number' && product.salePrice < product.price;
  const activePrice = hasDiscount ? product.salePrice! : product.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/55 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-4xl max-h-[94dvh] sm:max-h-[90dvh] bg-[#FCFBF9] rounded-t-3xl sm:rounded-2xl border border-[#E7DDD2] shadow-2xl flex flex-col overflow-hidden">
        {/* Mobile grab handle & top close bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#E7DDD2] bg-[#FCFBF9] shrink-0">
          <div className="min-w-0">
            <p className="text-xs text-[#61554D] truncate">
              {product.category}
              <span className="mx-1.5" aria-hidden="true">
                ·
              </span>
              SKU {product.sku}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-lg text-[#594E47] hover:text-[#1F1A17] hover:bg-[#F5EFE8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 pb-28 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Image Gallery */}
            <div className="md:col-span-5">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F5EFE8] border border-[#E7DDD2] md:sticky md:top-0">
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  fallbackTitle={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right Contiguous Purchase Module */}
            <div className="md:col-span-7 flex flex-col gap-5">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F1A17] leading-tight">
                  {product.name}
                </h2>
                <div className="mt-2.5 flex items-baseline gap-3 tabular-nums">
                  <span className="text-xl sm:text-2xl font-semibold text-[#1F1A17]">
                    {formatCurrency(activePrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-[#61554D] line-through">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-xs font-medium text-[#7A5C30]">
                        Save {formatCurrency(product.price - activePrice)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-[#594E47] leading-relaxed">{product.description}</p>

              {/* Colour Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[#1F1A17]">
                    Colour: <span className="font-normal text-[#594E47]">{activeColor.name}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = activeColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select colour ${color.name}`}
                        aria-pressed={isSelected}
                        className={`min-h-[44px] px-3 py-1.5 rounded-lg border inline-flex items-center gap-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'border-[#1F1A17] bg-[#F5EFE8] text-[#1F1A17]'
                            : 'border-[#E7DDD2] bg-[#FCFBF9] text-[#594E47] hover:border-[#CBB9A4]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-[#CBB9A4] shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-[#1F1A17]" />}
                        </span>
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1A17]">
                    Size: <span className="font-normal text-[#594E47]">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide((prev) => !prev)}
                    className="min-h-[36px] inline-flex items-center gap-1.5 text-xs font-medium text-[#7A5C30] hover:text-[#1F1A17] underline underline-offset-4"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Size Guide' : 'Size Guide'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={isSelected}
                        className={`min-h-[44px] rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                          isSelected
                            ? 'border-[#1F1A17] bg-[#1F1A17] text-[#FCFBF9]'
                            : 'border-[#E7DDD2] bg-[#FCFBF9] text-[#1F1A17] hover:border-[#9A7845]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {showSizeGuide && (
                  <div className="mt-3 rounded-xl border border-[#E7DDD2] bg-[#F5EFE8] p-3.5 overflow-x-auto">
                    <table className="w-full text-xs text-left tabular-nums">
                      <thead>
                        <tr className="border-b border-[#DFD3C5] text-[#61554D]">
                          <th className="py-1.5 pr-3 font-semibold">Size</th>
                          <th className="py-1.5 pr-3 font-semibold">Bust</th>
                          <th className="py-1.5 pr-3 font-semibold">Waist</th>
                          <th className="py-1.5 font-semibold">Hip</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE0D4] text-[#1F1A17]">
                        {SIZE_CHART.map((row) => (
                          <tr key={row.size}>
                            <td className="py-1.5 pr-3 font-semibold">{row.size}</td>
                            <td className="py-1.5 pr-3">{row.bust}</td>
                            <td className="py-1.5 pr-3">{row.waist}</td>
                            <td className="py-1.5">{row.hip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#1F1A17] mb-2">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-lg border border-[#E7DDD2] bg-[#FCFBF9]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1F1A17] hover:bg-[#F5EFE8] rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold tabular-nums text-[#1F1A17]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1F1A17] hover:bg-[#F5EFE8] rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onAddToCart(product, selectedSize, activeColor, quantity)}
                  className="min-h-[48px] px-5 py-3 rounded-lg border border-[#1F1A17] text-[#1F1A17] hover:bg-[#F5EFE8] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedSize, activeColor, quantity)}
                  className="min-h-[48px] px-5 py-3 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Fabric & Fit Details */}
              <div className="pt-4 border-t border-[#E7DDD2] space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="font-semibold text-[#1F1A17]">Fabric &amp; Care</p>
                  <p className="mt-0.5 text-[#594E47] leading-relaxed">{product.fabricDetails}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1F1A17]">Fit &amp; Tailoring</p>
                  <p className="mt-0.5 text-[#594E47] leading-relaxed">{product.fitNotes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA Bar on Mobile */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 p-3 bg-[#FCFBF9]/95 backdrop-blur-md border-t border-[#E7DDD2] grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onAddToCart(product, selectedSize, activeColor, quantity)}
            className="min-h-[48px] px-4 py-3 rounded-lg border border-[#1F1A17] text-[#1F1A17] bg-[#FCFBF9] text-sm font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(product, selectedSize, activeColor, quantity)}
            className="min-h-[48px] px-4 py-3 rounded-lg bg-[#1F1A17] text-[#FCFBF9] text-sm font-semibold inline-flex items-center justify-center"
          >
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
