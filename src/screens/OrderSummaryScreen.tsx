import React, { useState } from 'react';
import { Download, Share2, RotateCcw, CheckCircle2, Clock, Phone, MapPin, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriceText } from '../components/common/PriceText';
import { OrderStatus } from '../types';
import { motion } from 'motion/react';

export const OrderSummaryScreen: React.FC = () => {
  const { activeOrder, orders, reorder, navigateTo, language, showToast } = useApp();
  const [showPdfModal, setShowPdfModal] = useState(false);

  const order = activeOrder || orders[0];

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-stone-500">
          {language === 'pl' ? 'Brak aktywnego zamówienia' : 'No active order found'}
        </p>
      </div>
    );
  }

  const steps: { id: OrderStatus; label: { pl: string; en: string }; time: string }[] = [
    { id: 'received', label: { pl: 'Przyjęte do realizacji', en: 'Order Received' }, time: '14:20' },
    { id: 'preparing', label: { pl: 'Opiekanie na ruszcie', en: 'Grilling on spit' }, time: '14:24' },
    { id: 'on_the_way', label: { pl: 'Kurier w drodze', en: 'On the way' }, time: '14:38' },
    { id: 'delivered', label: { pl: 'Dostarczone', en: 'Delivered' }, time: '14:55' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 1;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Zamówienie ${order.orderNumber} - Warsztat Kebabu`,
        text: `Moje zamówienie ${order.orderNumber} na kwotę ${order.total.toFixed(2)} zł jest w realizacji!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`https://warsztatkebabu.pl/track/${order.orderNumber}`);
      showToast(language === 'pl' ? 'Link skopiowany do schowka!' : 'Tracking link copied to clipboard!');
    }
  };

  return (
    <div className="p-4 sm:p-5 pb-28 space-y-5 animate-fade-in">
      {/* Live Status Tracker Stepper */}
      <div className="bg-white dark:bg-stone-850 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
              {language === 'pl' ? 'ŚLEDZENIE NA ŻYWO' : 'LIVE TRACKING'}
            </span>
            <h2 className="text-base font-bold font-['Poppins'] text-stone-900 dark:text-stone-100">
              {steps[currentStepIdx]?.label[language]}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-stone-400 block">{language === 'pl' ? 'Szacowany czas' : 'Est. time'}</span>
            <span className="text-sm font-bold font-mono text-emerald-600">~{order.estimatedDeliveryMinutes} min</span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="relative pt-2 pb-1">
          <div className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-orange-600 rounded-full"
            />
          </div>

          <div className="flex justify-between mt-3 text-[10px]">
            {steps.map((st, i) => {
              const isPassed = i <= currentStepIdx;
              return (
                <div key={st.id} className="flex flex-col items-center text-center w-1/4">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] mb-1 ${
                      isPassed
                        ? 'bg-orange-600 text-white ring-2 ring-orange-200 dark:ring-orange-950'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                    }`}
                  >
                    {isPassed ? '✓' : i + 1}
                  </div>
                  <span className={`leading-tight ${isPassed ? 'font-bold text-stone-800 dark:text-stone-200' : 'text-stone-400'}`}>
                    {st.label[language]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Polish Authentic Thermal Receipt Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md p-6 relative overflow-hidden">
        {/* Top Jagged Receipt Edge Graphic */}
        <div className="border-b-2 border-dashed border-stone-200 dark:border-stone-700 pb-4 mb-4 text-center">
          <span className="text-2xl block mb-1">🌯</span>
          <h3 className="font-['Poppins'] font-bold text-base tracking-tight text-stone-900 dark:text-stone-100">
            WARSZTAT KEBABU SP. Z O.O.
          </h3>
          <p className="text-[11px] text-stone-500 font-mono">
            Rynek 23/24, 50-101 Wrocław · NIP: 897-192-33-41
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-stone-600 dark:text-stone-400">
            <span>PARAGON: #{order.orderNumber}</span>
            <span>{new Date(order.createdAt).toLocaleDateString('pl-PL')}</span>
          </div>
        </div>

        {/* Receipt Stamp */}
        <div className="my-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-900 dark:text-emerald-300">
              OPŁACONO ({order.paymentMethod.toUpperCase()})
            </span>
          </div>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
            {order.total.toFixed(2)} zł
          </span>
        </div>

        {/* Items List */}
        <div className="divide-y divide-dashed divide-stone-200 dark:divide-stone-800 text-xs my-4 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-2 first:pt-0">
              <div className="flex justify-between font-bold text-stone-800 dark:text-stone-200">
                <span>
                  {item.quantity}x {item.menuItem.name[language]}
                </span>
                <PriceText amount={item.totalPrice} />
              </div>
              <div className="text-[11px] text-stone-500 pl-4 mt-0.5 space-y-0.5">
                <p>• Rozmiar: {item.customization.size.toUpperCase()}, Mięso: {item.customization.meat}</p>
                {item.customization.sauces?.length > 0 && (
                  <p>• Sosy: {item.customization.sauces.join(', ')}</p>
                )}
                {item.customization.extras?.length > 0 && (
                  <p>• Dodatki: {item.customization.extras.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Calculation Totals */}
        <div className="border-t-2 border-dashed border-stone-200 dark:border-stone-800 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-stone-500 font-mono">
            <span>Suma pozycji:</span>
            <span>{order.subtotal.toFixed(2)} zł</span>
          </div>
          <div className="flex justify-between text-stone-500 font-mono">
            <span>Dostawa:</span>
            <span>{order.deliveryFee === 0 ? '0.00 zł (GRATIS)' : `${order.deliveryFee.toFixed(2)} zł`}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-mono font-bold">
              <span>Rabat kupon:</span>
              <span>-{order.discountAmount.toFixed(2)} zł</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-100 dark:border-stone-800 font-mono">
            <span>SUMA PLN:</span>
            <PriceText amount={order.total} className="text-base text-orange-600" />
          </div>
        </div>

        {/* Delivery Destination details */}
        {order.orderType === 'delivery' && (
          <div className="mt-4 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Adres: {order.customer.street} {order.customer.apartment}, {order.customer.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>Odbiorca: {order.customer.fullName} ({order.customer.phone})</span>
            </div>
          </div>
        )}

        {/* Realistic Barcode graphic at bottom */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col items-center">
          <div className="flex items-center gap-1 h-9 opacity-75">
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 2, 1, 3].map((w, i) => (
              <div key={i} className={`h-full bg-stone-900 dark:bg-stone-100`} style={{ width: `${w * 1.5}px` }} />
            ))}
          </div>
          <span className="text-[10px] font-mono tracking-widest text-stone-400 mt-1">
            * 59000000{order.orderNumber.replace(/\D/g, '')} *
          </span>
        </div>
      </div>

      {/* Action Buttons: Download PDF & Reorder */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setShowPdfModal(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4 text-orange-600" />
          <span>{language === 'pl' ? 'Pobierz paragon (PDF)' : 'Download Receipt'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-xs"
        >
          <Share2 className="w-4 h-4 text-orange-600" />
          <span>{language === 'pl' ? 'Udostępnij status' : 'Share Status'}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => reorder(order)}
        className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        <span>{language === 'pl' ? 'Zamów ponownie ten zestaw' : 'Reorder This Meal'}</span>
      </button>

      {/* PDF Simulator Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-orange-600">
              <Printer className="w-6 h-6" />
              <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Poppins']">
                {language === 'pl' ? 'Generowanie PDF' : 'PDF Generation'}
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'pl'
                ? `Elektroniczny paragon fiskalny dla zamówienia #${order.orderNumber} został wygenerowany zgodnie z polskimi przepisami.`
                : `Electronic tax receipt for order #${order.orderNumber} generated successfully.`}
            </p>
            <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-xl font-mono text-[11px] text-stone-700 dark:text-stone-300">
              Warsztat_Kebabu_Paragon_{order.orderNumber}.pdf
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
              >
                {language === 'pl' ? 'Drukuj / Zapisz' : 'Print / Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold"
              >
                {language === 'pl' ? 'Zamknij' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
