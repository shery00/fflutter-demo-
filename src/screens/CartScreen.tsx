import React, { useState } from 'react';
import { Trash2, Tag, ArrowRight, ShoppingBag, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriceText } from '../components/common/PriceText';
import { QuantityStepper } from '../components/common/QuantityStepper';
import { SIZE_OPTIONS, MEAT_OPTIONS, BREAD_OPTIONS, SAUCE_OPTIONS, EXTRA_OPTIONS } from '../data/menuData';
import { motion, AnimatePresence } from 'motion/react';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    promoCode,
    promoDiscountPercent,
    applyPromoCode,
    navigateTo,
    language
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const getCustomizationSummary = (c: any) => {
    const sizeName = SIZE_OPTIONS.find(s => s.id === c.size)?.name[language] || c.size;
    const meatName = MEAT_OPTIONS.find(m => m.id === c.meat)?.name[language] || c.meat;
    const breadName = BREAD_OPTIONS.find(b => b.id === c.bread)?.name[language] || c.bread;
    const sauceNames = (c.sauces || [])
      .map((sid: string) => SAUCE_OPTIONS.find(s => s.id === sid)?.name[language])
      .filter(Boolean)
      .join(', ');
    const extrasNames = (c.extras || [])
      .map((eid: string) => EXTRA_OPTIONS.find(e => e.id === eid)?.name[language])
      .filter(Boolean)
      .join(', ');

    return {
      sizeName,
      meatName,
      breadName,
      sauceNames,
      extrasNames,
      notes: c.specialNotes,
    };
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-4xl shadow-inner">
          <ShoppingBag className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="text-xl font-bold font-['Poppins'] text-stone-900 dark:text-stone-100">
          {language === 'pl' ? 'Twój koszyk jest pusty' : 'Your cart is empty'}
        </h2>
        <p className="text-xs text-stone-500 max-w-xs">
          {language === 'pl'
            ? 'Wygląda na to, że nie dodałeś jeszcze żadnego rzemieślniczego kebaba. Wybierz coś z naszego menu!'
            : 'Looks like you have not added any craft kebabs yet. Explore our delicious menu!'}
        </p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all active:scale-95"
        >
          {language === 'pl' ? 'Przeglądaj menu' : 'Browse menu'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 pb-32 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
          {language === 'pl' ? `Pozycje w koszyku (${cart.length})` : `Cart Items (${cart.length})`}
        </h2>
        <span className="text-xs text-stone-400">
          {language === 'pl' ? 'Przesuń, aby usunąć' : 'Swipe/tap to remove'}
        </span>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {cart.map(item => {
            const summary = getCustomizationSummary(item.customization);
            return (
              <motion.div
                key={item.cartItemId}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -80, scale: 0.95 }}
                className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between gap-3 relative group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name[language]}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-stone-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold font-['Poppins'] text-sm text-stone-900 dark:text-stone-100 truncate">
                        {item.menuItem.name[language]}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                        title={language === 'pl' ? 'Usuń pozycję' : 'Remove item'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customizations tags */}
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-0.5 mt-1 leading-tight">
                      <p className="font-medium text-stone-700 dark:text-stone-300">
                        {summary.sizeName} · {summary.meatName}
                      </p>
                      {summary.sauceNames && (
                        <p>Sosy: <span className="text-orange-600 dark:text-orange-400">{summary.sauceNames}</span></p>
                      )}
                      {summary.extrasNames && (
                        <p>Dodatki: {summary.extrasNames}</p>
                      )}
                      {summary.notes && (
                        <p className="italic text-stone-400">"{summary.notes}"</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Stepper & Item Price */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={newQty => updateQuantity(item.cartItemId, newQty - item.quantity)}
                    size="sm"
                  />
                  <PriceText amount={item.totalPrice} className="text-base text-stone-900 dark:text-stone-100" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Promo Code Voucher Box */}
      <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-orange-600" />
          <h3 className="text-xs font-bold font-['Poppins'] text-stone-900 dark:text-stone-100">
            {language === 'pl' ? 'Kupon rabatowy' : 'Promo Voucher'}
          </h3>
        </div>

        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={e => setPromoInput(e.target.value.toUpperCase())}
            placeholder={
              language === 'pl'
                ? 'Wpisz kod: MISTRZ20, KRAKOW10'
                : 'Enter code: MISTRZ20, KRAKOW10'
            }
            className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            {language === 'pl' ? 'Zastosuj' : 'Apply'}
          </button>
        </form>

        {promoDiscountPercent > 0 && (
          <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Kod <strong>{promoCode}</strong> aktywny (-{promoDiscountPercent}%)</span>
            </span>
            <span className="font-bold">-{discountAmount.toFixed(2)} zł</span>
          </div>
        )}

        {promoMessage && (
          <p
            className={`text-[11px] mt-2 ${
              promoMessage.isError ? 'text-red-500' : 'text-emerald-600'
            }`}
          >
            {promoMessage.text}
          </p>
        )}
      </div>

      {/* Financial Breakdown Card */}
      <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 text-xs">
        <div className="flex justify-between text-stone-600 dark:text-stone-400">
          <span>{language === 'pl' ? 'Wartość dań' : 'Items subtotal'}</span>
          <PriceText amount={cartSubtotal} isBold={false} />
        </div>

        <div className="flex justify-between text-stone-600 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <span>{language === 'pl' ? 'Dostawa kurierem' : 'Courier delivery'}</span>
            {cartSubtotal > 60 && (
              <span className="text-[10px] text-emerald-600 font-bold uppercase">(Gratis)</span>
            )}
          </span>
          <PriceText amount={deliveryFee} isBold={false} />
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>{language === 'pl' ? `Rabat kuponowy (${promoCode})` : `Promo discount (${promoCode})`}</span>
            <span>-{discountAmount.toFixed(2)} zł</span>
          </div>
        )}

        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100">
          <span>{language === 'pl' ? 'Razem do zapłaty' : 'Total to pay'}</span>
          <PriceText amount={cartTotal} className="text-lg text-orange-600 dark:text-orange-400" />
        </div>
      </div>

      {/* Sticky Bottom Checkout CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto p-4 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => navigateTo('checkout')}
          className="w-full py-4 px-5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-between shadow-xl shadow-orange-600/25 transition-all"
        >
          <div className="flex items-center gap-2">
            <span>{language === 'pl' ? 'Przejdź do kasy' : 'Proceed to Checkout'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <PriceText amount={cartTotal} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
};
