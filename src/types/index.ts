export type Language = 'pl' | 'en';

export type Screen = 'home' | 'customization' | 'cart' | 'checkout' | 'summary' | 'history';

export type KebabCategory = 'all' | 'rollo' | 'bulka' | 'pita' | 'box' | 'sides' | 'drinks' | 'sauces';

export interface LocalizedString {
  pl: string;
  en: string;
}

export type MeatType = 'chicken' | 'beef' | 'mix' | 'falafel';
export type SizeType = 'small' | 'regular' | 'large' | 'mega';
export type BreadType = 'lavash' | 'bun' | 'pita';

export interface CustomizationOption {
  id: string;
  name: LocalizedString;
  priceDelta: number; // in PLN
  category: 'meat' | 'size' | 'bread' | 'sauce' | 'extra' | 'removal';
}

export interface MenuItem {
  id: string;
  category: KebabCategory;
  name: LocalizedString;
  description: LocalizedString;
  basePrice: number; // in PLN
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  calories?: number;
  preparationTimeMinutes: number;
  availableMeats?: MeatType[];
  availableSizes?: SizeType[];
  availableBreads?: BreadType[];
}

export interface CartItemCustomization {
  size: SizeType;
  meat: MeatType;
  bread: BreadType;
  sauces: string[]; // IDs
  extras: string[]; // IDs
  removals: string[]; // IDs
  specialNotes?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  customization: CartItemCustomization;
  quantity: number;
  unitPrice: number; // base + sum of customizations
  totalPrice: number; // unitPrice * quantity
}

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'blik' | 'card' | 'cash' | 'gpay';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderRecord {
  orderId: string;
  orderNumber: string;
  createdAt: string; // ISO string
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  promoCode?: string;
  orderType: OrderType;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  blikCodeUsed?: string;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
}
