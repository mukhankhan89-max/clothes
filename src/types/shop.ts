export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ClothingCategory =
  | 'Elegant Dresses'
  | 'Maxi Dresses'
  | 'Party Wear'
  | 'Casual Wear'
  | 'Formal Wear'
  | 'Luxury Evening Dresses'
  | 'Eastern Wear'
  | 'Western Wear'
  | 'Tops & Shirts'
  | 'Co-Ord Sets'
  | 'Two-Piece Suits'
  | 'Three-Piece Suits'
  | 'Abayas'
  | 'Stylish Kurtis'
  | 'Bridal & Wedding Guest'
  | 'Seasonal Collections';

export type CollectionHighlight =
  | 'All Pieces'
  | 'New Arrivals'
  | 'Best Sellers'
  | 'Trending'
  | 'Seasonal'
  | 'On Sale';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ClothingCategory;
  secondaryCategory?: ClothingCategory;
  price: number;
  salePrice?: number;
  sizes: ProductSize[];
  colors: ProductColor[];
  description: string;
  fabricDetails: string;
  fitNotes: string;
  image: string;
  highlights: Exclude<CollectionHighlight, 'All Pieces' | 'On Sale'>[];
  editorialLabel?: string;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  category: ClothingCategory;
  image: string;
  unitPrice: number;
  originalPrice: number;
  size: ProductSize;
  color: ProductColor;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  sameAsPhone: boolean;
  address: string;
  city: string;
  instructions: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFormData, string>>;

export interface OrderReceipt {
  orderNumber: string;
  createdAt: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  whatsappUrl: string;
  messageText: string;
}
