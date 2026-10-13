import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Screen,
  MenuItem,
  CartItem,
  CartItemCustomization,
  OrderRecord,
  CustomerDetails,
  PaymentMethod,
  SizeType,
  MeatType,
  BreadType
} from '../types';
import { MENU_ITEMS, PROMO_CODES } from '../data/menuData';

interface ToastState {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  screen: Screen;
  navigateTo: (screen: Screen, item?: MenuItem) => void;

  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;

  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  cartTotal: number;
  promoCode: string;
  promoDiscountPercent: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };

  addToCart: (item: MenuItem, customization: CartItemCustomization, quantity: number) => void;
  quickAddToCart: (item: MenuItem) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  undoRemove: () => void;
  clearCart: () => void;

  orders: OrderRecord[];
  activeOrder: OrderRecord | null;
  setActiveOrder: (order: OrderRecord | null) => void;
  placeOrder: (customer: CustomerDetails, payment: PaymentMethod, isDelivery: boolean, blikCode?: string) => Promise<OrderRecord>;
  reorder: (order: OrderRecord) => void;

  toast: ToastState | null;
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;

  viewMode: 'mobile_frame' | 'fullscreen';
  setViewMode: (mode: 'mobile_frame' | 'fullscreen') => void;

  showFlutterInspector: boolean;
  setShowFlutterInspector: (show: boolean) => void;
  activeFlutterFileId: string;
  setActiveFlutterFileId: (id: string) => void;

  showApkModal: boolean;
  setShowApkModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PAST_ORDERS: OrderRecord[] = [
  {
    orderId: 'KB-8492',
    orderNumber: 'KB-8492',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    items: [
      {
        cartItemId: 'init-1',
        menuItem: MENU_ITEMS[0],
        customization: {
          size: 'large',
          meat: 'beef',
          bread: 'lavash',
          sauces: ['garlic', 'hot'],
          extras: ['extra_cheese'],
          removals: [],
        },
        quantity: 1,
        unitPrice: 42.50,
        totalPrice: 42.50,
      },
      {
        cartItemId: 'init-2',
        menuItem: MENU_ITEMS[2],
        customization: {
          size: 'regular',
          meat: 'mix',
          bread: 'lavash',
          sauces: ['mixed'],
          extras: [],
          removals: [],
        },
        quantity: 1,
        unitPrice: 35.50,
        totalPrice: 35.50,
      }
    ],
    subtotal: 78.00,
    deliveryFee: 6.00,
    discountAmount: 15.60,
    total: 68.40,
    promoCode: 'MISTRZ20',
    orderType: 'delivery',
    customer: {
      fullName: 'Jan Kowalski',
      phone: '+48 601 234 567',
      street: 'ul. Świdnicka 14',
      apartment: 'm. 12',
      city: 'Wrocław',
      postalCode: '50-068',
      notes: 'Kod do domofonu: 1234',
    },
    paymentMethod: 'blik',
    paymentStatus: 'paid',
    blikCodeUsed: '749 201',
    status: 'on_the_way',
    estimatedDeliveryMinutes: 18,
  },
  {
    orderId: 'KB-7319',
    orderNumber: 'KB-7319',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        cartItemId: 'init-3',
        menuItem: MENU_ITEMS[1],
        customization: {
          size: 'regular',
          meat: 'chicken',
          bread: 'bun',
          sauces: ['garlic'],
          extras: ['fries_inside'],
          removals: ['no_onion'],
        },
        quantity: 2,
        unitPrice: 35.00,
        totalPrice: 70.00,
      }
    ],
    subtotal: 70.00,
    deliveryFee: 0,
    discountAmount: 7.00,
    total: 63.00,
    promoCode: 'KRAKOW10',
    orderType: 'pickup',
    customer: {
      fullName: 'Jan Kowalski',
      phone: '+48 601 234 567',
      street: '',
      apartment: '',
      city: 'Wrocław',
      postalCode: '',
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'delivered',
    estimatedDeliveryMinutes: 0,
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pl');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [screen, setScreen] = useState<Screen>('home');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartItemId: 'sample-cart-1',
      menuItem: MENU_ITEMS[0],
      customization: {
        size: 'regular',
        meat: 'mix',
        bread: 'lavash',
        sauces: ['garlic', 'hot'],
        extras: ['extra_cheese'],
        removals: [],
        specialNotes: 'Mocno przypiec ciasto prosimy!'
      },
      quantity: 1,
      unitPrice: 35.00,
      totalPrice: 35.00,
    }
  ]);
  const [lastRemovedItem, setLastRemovedItem] = useState<{ item: CartItem; index: number } | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_PAST_ORDERS);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(INITIAL_PAST_ORDERS[0]);
  const [promoCode, setPromoCode] = useState<string>('MISTRZ20');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(20);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [viewMode, setViewMode] = useState<'mobile_frame' | 'fullscreen'>('mobile_frame');
  const [showFlutterInspector, setShowFlutterInspector] = useState<boolean>(false);
  const [activeFlutterFileId, setActiveFlutterFileId] = useState<string>('pubspec');
  const [showApkModal, setShowApkModal] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'pl' ? 'en' : 'pl'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = (targetScreen: Screen, item?: MenuItem) => {
    if (item) {
      setCustomizingItem(item);
    }
    setScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    const id = Math.random().toString();
    setToast({ id, message, actionLabel, onAction });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = cartSubtotal > 60 || cart.length === 0 ? 0 : 6.00;
  const discountAmount = promoDiscountPercent > 0 ? (cartSubtotal * promoDiscountPercent) / 100 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? deliveryFee : 0));

  const applyPromoCode = (code: string) => {
    const upper = code.trim().toUpperCase();
    const config = PROMO_CODES[upper];
    if (config) {
      if (cartSubtotal < config.minOrder) {
        return {
          success: false,
          message: language === 'pl'
            ? `Minimalna wartość zamówienia dla tego kodu to ${config.minOrder} zł`
            : `Minimum order for this code is ${config.minOrder} zł`
        };
      }
      setPromoCode(upper);
      setPromoDiscountPercent(config.discountPercent);
      return {
        success: true,
        message: language === 'pl'
          ? `Zastosowano kod -${config.discountPercent}%!`
          : `Promo code applied: -${config.discountPercent}%!`
      };
    }
    return {
      success: false,
      message: language === 'pl' ? 'Nieprawidłowy kod promocyjny' : 'Invalid promo code'
    };
  };

  const addToCart = (item: MenuItem, customization: CartItemCustomization, quantity: number) => {
    let unitPrice = item.basePrice;
    if (customization.size === 'small') unitPrice -= 4.0;
    if (customization.size === 'large') unitPrice += 6.0;
    if (customization.size === 'mega') unitPrice += 12.0;

    if (customization.meat === 'beef') unitPrice += 3.5;
    if (customization.meat === 'mix') unitPrice += 2.0;

    if (customization.extras.includes('extra_cheese')) unitPrice += 4.5;
    if (customization.extras.includes('fries_inside')) unitPrice += 4.0;
    if (customization.extras.includes('jalapeno')) unitPrice += 3.0;
    if (customization.extras.includes('extra_meat')) unitPrice += 7.5;

    const newCartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      menuItem: item,
      customization,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCart(prev => [...prev, newCartItem]);
    showToast(
      language === 'pl' ? `Dodano: ${item.name.pl}` : `Added: ${item.name.en}`,
      language === 'pl' ? 'KOSZYK' : 'CART',
      () => setScreen('cart')
    );
  };

  const quickAddToCart = (item: MenuItem) => {
    const defaultCustomization: CartItemCustomization = {
      size: (item.availableSizes?.[0] as SizeType) || 'regular',
      meat: (item.availableMeats?.[0] as MeatType) || 'chicken',
      bread: (item.availableBreads?.[0] as BreadType) || 'lavash',
      sauces: ['garlic'],
      extras: [],
      removals: [],
    };
    addToCart(item, defaultCustomization, 1);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: item.unitPrice * nextQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    const idx = cart.findIndex(i => i.cartItemId === cartItemId);
    if (idx !== -1) {
      const removed = cart[idx];
      setLastRemovedItem({ item: removed, index: idx });
      setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
      showToast(
        language === 'pl' ? `Usunięto z koszyka` : `Removed from cart`,
        language === 'pl' ? 'COFNIJ' : 'UNDO',
        undoRemove
      );
    }
  };

  const undoRemove = () => {
    if (lastRemovedItem) {
      setCart(prev => {
        const next = [...prev];
        next.splice(lastRemovedItem.index, 0, lastRemovedItem.item);
        return next;
      });
      setLastRemovedItem(null);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod,
    isDelivery: boolean,
    blikCode?: string
  ): Promise<OrderRecord> => {
    const newOrderNumber = `KB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      orderId: newOrderNumber,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: isDelivery ? deliveryFee : 0,
      discountAmount,
      total: isDelivery ? cartTotal : Math.max(0, cartSubtotal - discountAmount),
      promoCode: promoDiscountPercent > 0 ? promoCode : undefined,
      orderType: isDelivery ? 'delivery' : 'pickup',
      customer,
      paymentMethod,
      paymentStatus: 'paid',
      blikCodeUsed: blikCode,
      status: 'received',
      estimatedDeliveryMinutes: isDelivery ? 35 : 15,
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const reorder = (order: OrderRecord) => {
    setCart(order.items.map(item => ({
      ...item,
      cartItemId: `reorder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    })));
    setScreen('cart');
    showToast(
      language === 'pl' ? 'Pozycje dodane z poprzedniego zamówienia!' : 'Items added from past order!',
      language === 'pl' ? 'KOSZYK' : 'CART',
      () => setScreen('cart')
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        screen,
        navigateTo,
        customizingItem,
        setCustomizingItem,
        cart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        cartTotal,
        promoCode,
        promoDiscountPercent,
        applyPromoCode,
        addToCart,
        quickAddToCart,
        updateQuantity,
        removeFromCart,
        undoRemove,
        clearCart,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        reorder,
        toast,
        showToast,
        viewMode,
        setViewMode,
        showFlutterInspector,
        setShowFlutterInspector,
        activeFlutterFileId,
        setActiveFlutterFileId,
        showApkModal,
        setShowApkModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
