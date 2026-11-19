import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import type { CollectionHighlight } from '../types/shop';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectHighlight: (highlight: CollectionHighlight) => void;
}

export function Navbar({ cartCount, onOpenCart, onSelectHighlight }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const navigateToCatalog = (highlight?: CollectionHighlight) => {
    if (highlight) {
      onSelectHighlight(highlight);
    }
    setMobileMenuOpen(false);
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-14 md:h-16 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-[#E7DDD2]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-[#1F1A17] hover:text-[#9A7845] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7845]"
            >
              <Menu className="w-5 h-5" strokeWidth={1.6} />
            </button>
            <a
              href="#top"
              className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#1F1A17] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7845]"
            >
              {STORE_CONFIG.brandName}
            </a>
          </div>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#594E47]"
          >
            <button
              type="button"
              onClick={() => navigateToCatalog('All Pieces')}
              className="hover:text-[#1F1A17] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => navigateToCatalog('New Arrivals')}
              className="hover:text-[#1F1A17] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 py-2"
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => navigateToCatalog('Best Sellers')}
              className="hover:text-[#1F1A17] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Best Sellers
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('craftsmanship')}
              className="hover:text-[#1F1A17] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Craftsmanship
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('order-guide')}
              className="hover:text-[#1F1A17] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 py-2"
            >
              Order Guide
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping bag, ${cartCount} items`}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7845]"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
              <span>Bag</span>
              <span className="tabular-nums font-semibold text-[#EAD7D1]">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div
            className="fixed inset-0 bg-[#1F1A17]/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[82vw] max-w-xs bg-[#FCFBF9] border-r border-[#E7DDD2] shadow-2xl flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E7DDD2]">
                <span className="font-serif text-xl font-semibold text-[#1F1A17]">
                  {STORE_CONFIG.brandName}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#594E47] hover:text-[#1F1A17]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => navigateToCatalog('All Pieces')}
                  className="min-h-[44px] px-2 text-left text-base font-medium text-[#1F1A17] hover:bg-[#F5EFE8] rounded-lg transition-colors"
                >
                  All Collections
                </button>
                <button
                  type="button"
                  onClick={() => navigateToCatalog('New Arrivals')}
                  className="min-h-[44px] px-2 text-left text-base font-medium text-[#1F1A17] hover:bg-[#F5EFE8] rounded-lg transition-colors"
                >
                  New Arrivals
                </button>
                <button
                  type="button"
                  onClick={() => navigateToCatalog('Best Sellers')}
                  className="min-h-[44px] px-2 text-left text-base font-medium text-[#1F1A17] hover:bg-[#F5EFE8] rounded-lg transition-colors"
                >
                  Best Sellers
                </button>
                <button
                  type="button"
                  onClick={() => navigateToCatalog('Trending')}
                  className="min-h-[44px] px-2 text-left text-base font-medium text-[#1F1A17] hover:bg-[#F5EFE8] rounded-lg transition-colors"
                >
                  Trending Now
                </button>
                <button
                  type="button"
                  onClick={() => navigateToCatalog('Seasonal')}
                  className="min-h-[44px] px-2 text-left text-base font-medium text-[#1F1A17] hover:bg-[#F5EFE8] rounded-lg transition-colors"
                >
                  Seasonal Edit
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('craftsmanship')}
                  className="min-h-[44px] px-2 text-left text-base font-medium text-[#1F1A17] hover:bg-[#F5EFE8] rounded-lg transition-colors"
                >
                  Atelier Craftsmanship
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('order-guide')}
                  className="min-h-[44px] px-2 text-left text-base font-medium text-[#1F1A17] hover:bg-[#F5EFE8] rounded-lg transition-colors"
                >
                  WhatsApp Order Guide
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7DDD2]">
              <p className="text-xs text-[#61554D] leading-relaxed">
                Complimentary delivery on orders over ${STORE_CONFIG.freeShippingThreshold}. Personalized sizing support available via WhatsApp concierge.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
