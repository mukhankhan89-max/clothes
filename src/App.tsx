import { useEffect, useMemo, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { CatalogSection, type SortOption } from './components/CatalogSection';
import { CartCheckoutDrawer, type DrawerStep } from './components/CartCheckoutDrawer';
import { EditorialShowcase } from './components/EditorialShowcase';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { OrderGuide } from './components/OrderGuide';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PRODUCTS } from './data/products';
import type {
  CartItem,
  ClothingCategory,
  CollectionHighlight,
  Product,
  ProductColor,
  ProductSize,
} from './types/shop';

const CART_STORAGE_KEY = 'aurelia_atelier_cart_v1';

function loadInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState<DrawerStep>('cart');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [selectedHighlight, setSelectedHighlight] = useState<CollectionHighlight>('All Pieces');
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage quota or privacy mode fallback
    }
  }, [cart]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      if (selectedHighlight === 'On Sale') {
        if (!(typeof product.salePrice === 'number' && product.salePrice < product.price)) {
          return false;
        }
      } else if (selectedHighlight !== 'All Pieces') {
        if (!product.highlights.includes(selectedHighlight)) {
          return false;
        }
      }

      if (selectedCategory !== 'All') {
        if (
          product.category !== selectedCategory &&
          product.secondaryCategory !== selectedCategory
        ) {
          return false;
        }
      }

      if (q) {
        const searchable = [
          product.name,
          product.category,
          product.secondaryCategory ?? '',
          product.description,
          product.fabricDetails,
          ...product.colors.map((c) => c.name),
        ]
          .join(' ')
          .toLowerCase();

        if (!searchable.includes(q)) {
          return false;
        }
      }

      return true;
    });

    const getEffectivePrice = (p: Product) =>
      typeof p.salePrice === 'number' && p.salePrice < p.price ? p.salePrice : p.price;

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    }
    if (sortBy === 'discount') {
      return [...list].sort((a, b) => {
        const discA = a.salePrice ? a.price - a.salePrice : 0;
        const discB = b.salePrice ? b.price - b.salePrice : 0;
        return discB - discA;
      });
    }

    return list;
  }, [selectedHighlight, selectedCategory, searchQuery, sortBy]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addItemToCart = (
    product: Product,
    size: ProductSize,
    color: ProductColor,
    quantity: number
  ) => {
    const unitPrice =
      typeof product.salePrice === 'number' && product.salePrice < product.price
        ? product.salePrice
        : product.price;
    const key = `${product.id}__${size}__${color.name}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          unitPrice,
          originalPrice: product.price,
          size,
          color,
          quantity,
        },
      ];
    });
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize: ProductSize = product.sizes.includes('M') ? 'M' : product.sizes[0];
    const defaultColor = product.colors[0];
    addItemToCart(product, defaultSize, defaultColor, 1);
    setToastMessage(`Added ${product.name} (${defaultSize}, ${defaultColor.name}) to bag`);
  };

  const handleModalAddToCart = (
    product: Product,
    size: ProductSize,
    color: ProductColor,
    quantity: number
  ) => {
    addItemToCart(product, size, color, quantity);
    setSelectedProduct(null);
    setToastMessage(`Added ${product.name} (${size}, ${color.name}) to bag`);
  };

  const handleBuyNow = (
    product: Product,
    size: ProductSize,
    color: ProductColor,
    quantity: number
  ) => {
    addItemToCart(product, size, color, quantity);
    setSelectedProduct(null);
    setDrawerStep('checkout');
    setDrawerOpen(true);
  };

  const handleUpdateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: Math.min(20, quantity) } : item))
    );
  };

  const handleRemoveItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToCatalog = (highlight?: CollectionHighlight, category?: ClothingCategory) => {
    if (highlight) setSelectedHighlight(highlight);
    if (category) {
      setSelectedCategory(category);
    } else if (highlight) {
      setSelectedCategory('All');
    }
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryNavigation = (category: ClothingCategory) => {
    setSelectedHighlight('All Pieces');
    setSelectedCategory(category);
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedHighlight('All Pieces');
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF9] text-[#1F1A17]">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => {
          setDrawerStep('cart');
          setDrawerOpen(true);
        }}
        onSelectHighlight={(h) => setSelectedHighlight(h)}
      />

      <main className="flex-1">
        <Hero onExploreCollection={scrollToCatalog} />

        <CatalogSection
          products={filteredProducts}
          selectedHighlight={selectedHighlight}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSelectHighlight={setSelectedHighlight}
          onSelectCategory={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          onSelectProduct={setSelectedProduct}
          onQuickAdd={handleQuickAdd}
        />

        <EditorialShowcase onFilterCategory={handleCategoryNavigation} />

        <OrderGuide />
      </main>

      <Footer onSelectCategory={handleCategoryNavigation} />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleModalAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartCheckoutDrawer
        isOpen={drawerOpen}
        step={drawerStep}
        items={cart}
        onClose={() => setDrawerOpen(false)}
        onStepChange={setDrawerStep}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Non-intrusive Add-to-Bag Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 sm:max-w-sm rounded-xl bg-[#1F1A17] text-[#FCFBF9] px-4 py-3 shadow-xl border border-[#382F29] flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Check className="w-4 h-4 text-[#EAD7D1] shrink-0" />
            <p className="text-xs sm:text-sm truncate">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setDrawerStep('cart');
              setDrawerOpen(true);
            }}
            className="min-h-[36px] px-2.5 rounded-md bg-[#FCFBF9] text-[#1F1A17] text-xs font-semibold inline-flex items-center gap-1 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Bag</span>
          </button>
        </div>
      )}
    </div>
  );
}
