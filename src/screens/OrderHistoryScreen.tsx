import React, { useState } from 'react';
import { Clock, RefreshCw, ChevronRight, RotateCcw, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriceText } from '../components/common/PriceText';
import { OrderRecord, OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const OrderHistoryScreen: React.FC = () => {
  const { orders, setActiveOrder, navigateTo, reorder, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'delivered' | 'active'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'delivered') return order.status === 'delivered';
    if (filter === 'active') return order.status !== 'delivered' && order.status !== 'cancelled';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return {
          label: language === 'pl' ? 'Dostarczone' : 'Delivered',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'on_the_way':
        return {
          label: language === 'pl' ? 'Kurier w drodze' : 'On the way',
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        };
      case 'preparing':
        return {
          label: language === 'pl' ? 'W piecu' : 'Grilling',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        };
      case 'received':
        return {
          label: language === 'pl' ? 'Przyjęte' : 'Received',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        };
      default:
        return {
          label: language === 'pl' ? 'Anulowane' : 'Cancelled',
          color: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
        };
    }
  };

  return (
    <div className="p-4 sm:p-5 pb-28 space-y-5 animate-fade-in">
      {/* Pull-to-refresh & Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
          {language === 'pl' ? 'Twoje zamówienia' : 'Past Orders'}
        </h2>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs text-orange-600 font-semibold hover:text-orange-700 p-1 rounded-lg"
          title="Odśwież listę zamówień"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{language === 'pl' ? 'Odśwież' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all' as const, label: { pl: 'Wszystkie', en: 'All' } },
          { id: 'active' as const, label: { pl: 'W realizacji', en: 'Active' } },
          { id: 'delivered' as const, label: { pl: 'Zrealizowane', en: 'Completed' } },
        ].map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filter === f.id
                ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
            }`}
          >
            {f.label[language]}
          </button>
        ))}
      </div>

      {/* Shimmer loading state simulation */}
      {isRefreshing ? (
        <div className="space-y-3">
          {[1, 2].map(n => (
            <div
              key={n}
              className="bg-stone-200 dark:bg-stone-800 rounded-3xl h-36 animate-pulse p-4 space-y-3"
            >
              <div className="h-4 bg-stone-300 dark:bg-stone-700 rounded-md w-1/3" />
              <div className="h-3 bg-stone-300 dark:bg-stone-700 rounded-md w-2/3" />
              <div className="h-6 bg-stone-300 dark:bg-stone-700 rounded-md w-1/4 mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map(order => {
              const badge = getStatusBadge(order.status);
              const itemsNames = order.items
                .map(i => `${i.quantity}x ${i.menuItem.name[language]}`)
                .join(', ');

              return (
                <motion.div
                  key={order.orderId}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-stone-850 p-4 sm:p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs text-stone-500">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div
                    onClick={() => {
                      setActiveOrder(order);
                      navigateTo('summary');
                    }}
                    className="cursor-pointer py-2 border-y border-stone-100 dark:border-stone-800 group-hover:bg-stone-50/50 dark:group-hover:bg-stone-800/30 -mx-4 px-4 transition-colors"
                  >
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-medium line-clamp-2">
                      {itemsNames}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-orange-600 font-semibold mt-1">
                      <span>{language === 'pl' ? 'Szczegóły i paragon' : 'Details & receipt'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        {language === 'pl' ? 'Wartość' : 'Total'}
                      </span>
                      <PriceText amount={order.total} className="text-base text-stone-900 dark:text-stone-100" />
                    </div>

                    <button
                      type="button"
                      onClick={() => reorder(order)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'pl' ? 'Zamów ponownie' : 'Reorder'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-stone-850 rounded-3xl border border-stone-200 dark:border-stone-800">
              <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <p className="text-xs text-stone-500 font-medium">
                {language === 'pl' ? 'Brak zamówień w wybranej kategorii' : 'No orders in this category'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
