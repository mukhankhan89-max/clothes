import { Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../types/shop';
import { formatCurrency } from '../utils/whatsapp';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({ product, onSelectProduct, onQuickAdd }: ProductCardProps) {
  const hasDiscount = typeof product.salePrice === 'number' && product.salePrice < product.price;
  const activePrice = hasDiscount ? product.salePrice! : product.price;

  return (
    <article className="group flex flex-col bg-[#FCFBF9] rounded-xl border border-[#E7DDD2] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Uniform 3:4 Portrait Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#F5EFE8] overflow-hidden">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          aria-label={`View details for ${product.name}`}
          className="w-full h-full block text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9A7845]"
        >
          <ResilientImage
            src={product.image}
            alt={`${product.name} — ${product.category}`}
            fallbackTitle={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </button>

        {/* Single quiet editorial text tag when applicable (no pill clutter) */}
        {(hasDiscount || product.editorialLabel) && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 px-2 py-1 rounded bg-[#FCFBF9]/92 text-[11px] font-medium tracking-wide text-[#1F1A17]">
            {hasDiscount ? 'Special Offer' : product.editorialLabel}
          </span>
        )}
      </div>

      {/* Consistent Card Metadata & Actions */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#61554D] truncate">
            {product.category}
          </p>
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="mt-1 text-left w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7845]"
          >
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1F1A17] leading-snug line-clamp-2 group-hover:text-[#7A5C30] transition-colors">
              {product.name}
            </h3>
          </button>

          {/* Colour Swatches */}
          <div className="mt-2 flex items-center gap-1.5" aria-label={`Available in ${product.colors.length} colours`}>
            {product.colors.map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="w-3.5 h-3.5 rounded-full border border-[#D4C5B4] inline-block shrink-0"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            <span className="text-[11px] text-[#61554D] truncate ml-1">
              {product.colors[0]?.name}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#EFE7DE] flex flex-col gap-2.5">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-sm sm:text-base font-semibold text-[#1F1A17]">
              {formatCurrency(activePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#61554D] line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="min-h-[44px] px-3 py-2 rounded-lg border border-[#D8CBB9] text-[#1F1A17] hover:bg-[#F5EFE8] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
              <span>Details</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickAdd(product)}
              className="min-h-[44px] px-3 py-2 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
