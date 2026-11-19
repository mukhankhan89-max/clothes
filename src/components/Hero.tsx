import { ArrowRight } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../data/products';
import { STORE_CONFIG } from '../config/store';
import type { ClothingCategory, CollectionHighlight } from '../types/shop';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onExploreCollection: (highlight?: CollectionHighlight, category?: ClothingCategory) => void;
}

export function Hero({ onExploreCollection }: HeroProps) {
  return (
    <section id="top" className="bg-[#FCFBF9]">
      {/* Subtle non-sticky announcement strip */}
      <div className="bg-[#F5EFE8] border-b border-[#E7DDD2] px-4 py-2 text-center text-xs text-[#594E47]">
        <span>Autumn &amp; Festive Couture Edit</span>
        <span className="mx-2 text-[#9A7845]" aria-hidden="true">
          ·
        </span>
        <span>Complimentary delivery on orders above ${STORE_CONFIG.freeShippingThreshold}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16">
        <div className="relative rounded-2xl overflow-hidden bg-[#EFE7DE] border border-[#E7DDD2]">
          <div className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8] w-full">
            <ResilientImage
              src={HERO_BANNER_IMAGE}
              alt="Aurelia Atelier champagne silk evening gown editorial campaign"
              loading="eager"
              className="w-full h-full object-cover object-[center_20%]"
              fallbackTitle="Aurelia Atelier Couture Campaign"
            />
          </div>

          {/* Measured contrast scrim for WCAG AA legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#1F1A17]/85 via-[#1F1A17]/35 to-transparent sm:bg-gradient-to-r sm:from-[#1F1A17]/80 sm:via-[#1F1A17]/35 sm:to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:left-0 sm:right-auto flex flex-col justify-end sm:justify-center p-6 sm:p-10 lg:p-14 max-w-xl text-[#FCFBF9]">
            <p className="text-xs tracking-[0.18em] uppercase text-[#EAD7D1] mb-2.5 sm:mb-3">
              2026 Atelier Collection · Silk, Linen &amp; Handloom
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-medium leading-[1.08] tracking-tight text-[#FCFBF9]">
              Timeless silhouettes crafted in luminous silk.
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#EFE7DE] leading-relaxed max-w-md">
              From hand-embroidered eastern couture and modest abayas to bias-cut evening gowns and tailored linen sets.
            </p>

            <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onExploreCollection('All Pieces')}
                className="min-h-[44px] px-6 py-3 rounded-lg bg-[#FCFBF9] text-[#1F1A17] hover:bg-[#EAD7D1] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCFBF9]"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => onExploreCollection('All Pieces', 'Bridal & Wedding Guest')}
                className="min-h-[44px] px-5 py-3 rounded-lg border border-[#FCFBF9]/60 text-[#FCFBF9] hover:bg-[#FCFBF9]/15 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCFBF9]"
              >
                Bridal &amp; Festive
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
