import { STORE_CONFIG } from '../config/store';
import type { ClothingCategory } from '../types/shop';

interface FooterProps {
  onSelectCategory: (category: ClothingCategory) => void;
}

const FEATURED_LINKS: ClothingCategory[] = [
  'Luxury Evening Dresses',
  'Maxi Dresses',
  'Eastern Wear',
  'Three-Piece Suits',
  'Abayas',
  'Stylish Kurtis',
  'Co-Ord Sets',
  'Bridal & Wedding Guest',
];

export function Footer({ onSelectCategory }: FooterProps) {
  return (
    <footer className="bg-[#1F1A17] text-[#EAE0D5] border-t border-[#342B26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-5">
            <p className="font-serif text-2xl font-semibold text-[#FCFBF9]">
              {STORE_CONFIG.brandName}
            </p>
            <p className="mt-3 text-sm text-[#CBBFB4] leading-relaxed max-w-sm">
              A contemporary women’s fashion house dedicated to timeless silhouettes, natural luxury fabrics, and attentive WhatsApp concierge service.
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#D8C19D] font-semibold">
              Popular Categories
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {FEATURED_LINKS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className="text-left text-xs sm:text-sm text-[#CBBFB4] hover:text-[#FCFBF9] py-1 transition-colors truncate"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[#D8C19D] font-semibold">
              Boutique Concierge
            </p>
            <div className="mt-3 space-y-2 text-xs sm:text-sm text-[#CBBFB4]">
              <p>WhatsApp: {STORE_CONFIG.whatsappDisplayNumber}</p>
              <p>Email: {STORE_CONFIG.supportEmail}</p>
              <p>{STORE_CONFIG.showroomHours}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#342B26] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A89A8E]">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.brandName}. All rights reserved.</p>
          <p>Complimentary delivery over ${STORE_CONFIG.freeShippingThreshold} · Sizes XS to XXL</p>
        </div>
      </div>
    </footer>
  );
}
