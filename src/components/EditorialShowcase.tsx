import { ArrowRight } from 'lucide-react';
import { EDITORIAL_BANNER_IMAGE } from '../data/products';
import type { ClothingCategory } from '../types/shop';
import { ResilientImage } from './ResilientImage';

interface EditorialShowcaseProps {
  onFilterCategory: (category: ClothingCategory) => void;
}

const CURATED_EDITS: { title: string; subtitle: string; category: ClothingCategory }[] = [
  {
    title: 'Evening & Silk Couture',
    subtitle: 'Bias-cut mulberry charmeuse and draped satin silhouettes.',
    category: 'Luxury Evening Dresses',
  },
  {
    title: 'Eastern Heritage & Kurtis',
    subtitle: 'Hand-embroidered three-piece chiffon and cotton-silk sets.',
    category: 'Eastern Wear',
  },
  {
    title: 'Modest Abayas & Maxis',
    subtitle: 'Korean Nida crepe and pleated georgette in warm neutrals.',
    category: 'Abayas',
  },
  {
    title: 'Tailored Suits & Co-Ords',
    subtitle: 'Structured ivory blazers and relaxed European flax linen.',
    category: 'Formal Wear',
  },
];

export function EditorialShowcase({ onFilterCategory }: EditorialShowcaseProps) {
  return (
    <section id="craftsmanship" className="py-12 sm:py-16 lg:py-20 bg-[#F5EFE8] border-y border-[#E7DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Image */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#E7DDD2] bg-[#EAE0D5]">
            <div className="aspect-[16/10] lg:h-full w-full">
              <ResilientImage
                src={EDITORIAL_BANNER_IMAGE}
                alt="Aurelia Atelier showroom featuring silk, chiffon, and tailored womenswear"
                fallbackTitle="Atelier Showroom & Fabric Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Curated Category Directory */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#FCFBF9] rounded-2xl border border-[#E7DDD2] p-6 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#7A5C30]">
                Material Provenance
              </p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#1F1A17] leading-tight">
                Crafted across sixteen signature wardrobes.
              </h2>
              <p className="mt-3 text-sm text-[#594E47] leading-relaxed">
                Every garment is cut in small batches from natural fibres—mulberry silk, European linen, crinkle chiffon, and matte crepe—sized thoughtfully from XS to XXL.
              </p>
            </div>

            <div className="mt-6 divide-y divide-[#EFE7DE]">
              {CURATED_EDITS.map((edit) => (
                <button
                  key={edit.title}
                  type="button"
                  onClick={() => onFilterCategory(edit.category)}
                  className="w-full py-3.5 flex items-center justify-between gap-4 text-left group min-h-[52px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7845]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1F1A17] group-hover:text-[#7A5C30] transition-colors">
                      {edit.title}
                    </p>
                    <p className="text-xs text-[#61554D] truncate">{edit.subtitle}</p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-[#9A7845] shrink-0 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
