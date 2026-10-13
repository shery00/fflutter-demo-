import React from 'react';
import { Home, ShoppingBag, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

export const BottomNavBar: React.FC = () => {
  const { screen, navigateTo, cartCount, language } = useApp();

  const navItems = [
    {
      id: 'home' as const,
      label: { pl: 'Menu', en: 'Menu' },
      icon: Home,
    },
    {
      id: 'cart' as const,
      label: { pl: 'Koszyk', en: 'Cart' },
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'history' as const,
      label: { pl: 'Zamówienia', en: 'Orders' },
      icon: Clock,
    },
    {
      id: 'summary' as const,
      label: { pl: 'Ostatnie', en: 'Latest' },
      icon: FileText,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="grid grid-cols-4 items-center h-16 px-2">
        {navItems.map(item => {
          const isActive = screen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              className="flex flex-col items-center justify-center py-1 group relative transition-transform active:scale-95"
            >
              <div className="relative flex items-center justify-center">
                {/* Active Indicator Pill (Material 3 style) */}
                {isActive && (
                  <motion.div
                    layoutId="m3-nav-pill"
                    className="absolute inset-0 -mx-3 -my-1 bg-orange-100 dark:bg-orange-950/70 rounded-full"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}

                <Icon
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    isActive
                      ? 'text-orange-700 dark:text-orange-400 stroke-[2.4]'
                      : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200'
                  }`}
                />

                {item.badge !== undefined && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 z-20 min-w-4.5 h-4.5 px-1 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 relative z-10 transition-colors font-medium ${
                  isActive
                    ? 'font-bold text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {item.label[language]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
