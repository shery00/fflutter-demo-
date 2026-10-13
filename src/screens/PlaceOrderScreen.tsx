import React, { useState } from 'react';
import { Truck, Store, CreditCard, Banknote, Smartphone, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PriceText } from '../components/common/PriceText';
import { PaymentMethod, CustomerDetails } from '../types';
import { motion } from 'motion/react';

export const PlaceOrderScreen: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    placeOrder,
    navigateTo,
    language
  } = useApp();

  const [isDelivery, setIsDelivery] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('blik');
  const [blikCode, setBlikCode] = useState('749201');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Customer form fields
  const [fullName, setFullName] = useState('Jan Kowalski');
  const [phone, setPhone] = useState('+48 601 234 567');
  const [street, setStreet] = useState('ul. Świdnicka 14');
  const [apartment, setApartment] = useState('m. 12');
  const [city, setCity] = useState('Wrocław');
  const [postalCode, setPostalCode] = useState('50-068');
  const [notes, setNotes] = useState('Kod do klatki: 1234. Proszę dzwonić.');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = language === 'pl' ? 'Podaj imię i nazwisko' : 'Enter your name';
    if (!phone.trim() || phone.length < 9) errs.phone = language === 'pl' ? 'Wpisz poprawny numer telefonu' : 'Valid phone required';
    if (isDelivery && !street.trim()) errs.street = language === 'pl' ? 'Wpisz ulicę i numer' : 'Street address required';
    if (paymentMethod === 'blik' && blikCode.replace(/\s/g, '').length !== 6) {
      errs.blik = language === 'pl' ? 'Kod BLIK musi mieć 6 cyfr' : 'BLIK code must have 6 digits';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const customer: CustomerDetails = {
      fullName,
      phone,
      street: isDelivery ? street : '',
      apartment: isDelivery ? apartment : '',
      city: isDelivery ? city : 'Wrocław (Odbiór)',
      postalCode: isDelivery ? postalCode : '',
      notes,
    };

    // Simulate network latency & bank confirmation
    setTimeout(async () => {
      const order = await placeOrder(customer, paymentMethod, isDelivery, paymentMethod === 'blik' ? blikCode : undefined);
      setIsSubmitting(false);
      setOrderSuccess(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#10b981', '#ffffff']
        });
      } catch (err) {
        // Safe fallback
      }

      setTimeout(() => {
        navigateTo('summary');
      }, 1400);
    }, 1500);
  };

  const finalTotal = isDelivery ? cartTotal : Math.max(0, cartSubtotal - discountAmount);

  return (
    <div className="p-4 sm:p-5 pb-32 space-y-5 animate-fade-in">
      {/* Delivery or Pickup Animated Segmented Control */}
      <div className="bg-stone-200 dark:bg-stone-800 p-1 rounded-2xl flex relative select-none">
        <button
          type="button"
          onClick={() => setIsDelivery(true)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            isDelivery
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Truck className="w-4 h-4 text-orange-600" />
          <span>{language === 'pl' ? 'Dostawa kurierem' : 'Home Delivery'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDelivery(false)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            !isDelivery
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Store className="w-4 h-4 text-orange-600" />
          <span>{language === 'pl' ? 'Odbiór osobisty' : 'Self Pickup'}</span>
        </button>
      </div>

      {/* Customer Form */}
      <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100">
          {language === 'pl' ? '1. Dane kontaktowe' : '1. Contact Details'}
        </h3>

        <div>
          <label className="text-[11px] font-semibold text-stone-500 block mb-1">
            {language === 'pl' ? 'Imię i nazwisko' : 'Full Name'}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="text-[11px] font-semibold text-stone-500 block mb-1">
            {language === 'pl' ? 'Numer telefonu (do kuriera)' : 'Phone Number'}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {isDelivery && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {language === 'pl' ? 'Ulica i nr' : 'Street & no.'}
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {language === 'pl' ? 'Mieszkanie' : 'Apt'}
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={e => setApartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            {errors.street && <p className="text-[10px] text-red-500">{errors.street}</p>}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {language === 'pl' ? 'Miasto' : 'City'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {language === 'pl' ? 'Kod pocztowy' : 'Postal code'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                {language === 'pl' ? 'Wskazówki dla dostawcy' : 'Delivery instructions'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="np. domofon, zostaw pod drzwiami"
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100">
          2. {language === 'pl' ? 'Wybór metody płatności' : 'Payment Method'}
        </h3>

        <div className="space-y-2">
          {/* BLIK - Poland's favorite */}
          <button
            type="button"
            onClick={() => setPaymentMethod('blik')}
            className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
              paymentMethod === 'blik'
                ? 'border-red-600 bg-red-50/70 dark:bg-red-950/30 ring-1 ring-red-500/50'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-extrabold text-[11px] flex items-center justify-center tracking-tighter">
                BLIK
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block text-stone-900 dark:text-stone-100">
                  BLIK (Płatność kodem)
                </span>
                <span className="text-[10px] text-stone-500">Szybka płatność z aplikacji bankowej</span>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === 'blik' ? 'border-red-600 bg-red-600' : 'border-stone-400'
            }`}>
              {paymentMethod === 'blik' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </button>

          {/* Interactive BLIK Code Input Box */}
          {paymentMethod === 'blik' && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/60 animate-fade-in">
              <label className="text-[11px] font-bold text-red-900 dark:text-red-300 block mb-1.5">
                {language === 'pl' ? 'Wpisz 6-cyfrowy kod BLIK z aplikacji banku:' : 'Enter 6-digit BLIK code from your bank app:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={blikCode}
                  onChange={e => setBlikCode(e.target.value.replace(/\D/g, ''))}
                  className="w-36 text-center tracking-[0.25em] font-mono font-bold text-base py-2 rounded-xl bg-white dark:bg-stone-900 border border-red-300 dark:border-red-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setBlikCode(Math.floor(100000 + Math.random() * 900000).toString())}
                  className="px-2.5 py-2 text-[10px] font-bold rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
                >
                  {language === 'pl' ? 'Generuj testowy' : 'Random BLIK'}
                </button>
              </div>
              {errors.blik && <p className="text-[10px] text-red-600 mt-1">{errors.blik}</p>}
            </div>
          )}

          {/* Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
              paymentMethod === 'card'
                ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <span className="text-xs font-bold block text-stone-900 dark:text-stone-100">
                  {language === 'pl' ? 'Karta płatnicza online' : 'Credit / Debit Card'}
                </span>
                <span className="text-[10px] text-stone-500">Visa, Mastercard</span>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === 'card' ? 'border-orange-600 bg-orange-600' : 'border-stone-400'
            }`}>
              {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </button>

          {/* Cash */}
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
              paymentMethod === 'cash'
                ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <span className="text-xs font-bold block text-stone-900 dark:text-stone-100">
                  {language === 'pl' ? 'Gotówka przy odbiorze' : 'Cash upon delivery'}
                </span>
                <span className="text-[10px] text-stone-500">
                  {language === 'pl' ? 'Płatne kurierowi lub w lokalu' : 'Pay to courier or in-store'}
                </span>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === 'cash' ? 'border-orange-600 bg-orange-600' : 'border-stone-400'
            }`}>
              {paymentMethod === 'cash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </button>
        </div>
      </div>

      {/* Summary Review */}
      <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {language === 'pl' ? 'Podsumowanie płatności' : 'Payment Summary'}
        </h3>
        <div className="flex justify-between text-stone-600 dark:text-stone-400">
          <span>{language === 'pl' ? 'Wartość dań' : 'Items'}</span>
          <PriceText amount={cartSubtotal} isBold={false} />
        </div>
        <div className="flex justify-between text-stone-600 dark:text-stone-400">
          <span>{language === 'pl' ? 'Dostawa' : 'Delivery'}</span>
          <PriceText amount={isDelivery ? deliveryFee : 0} isBold={false} />
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>{language === 'pl' ? 'Rabat kuponowy' : 'Discount'}</span>
            <span>-{discountAmount.toFixed(2)} zł</span>
          </div>
        )}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100">
          <span>{language === 'pl' ? 'Do zapłaty' : 'Total'}</span>
          <PriceText amount={finalTotal} className="text-base text-orange-600" />
        </div>
      </div>

      {/* Sticky Place Order CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto p-4 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting || orderSuccess}
          onClick={handlePlaceOrder}
          className="w-full py-4 px-5 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-stone-500 text-white font-bold text-sm flex items-center justify-between shadow-xl shadow-orange-600/25 transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2 w-full py-0.5">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{language === 'pl' ? 'Przetwarzanie płatności...' : 'Processing payment...'}</span>
            </div>
          ) : orderSuccess ? (
            <div className="flex items-center justify-center gap-2 w-full py-0.5 text-emerald-200 font-bold">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>{language === 'pl' ? 'Zamówienie złożone!' : 'Order Placed!'}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span>{language === 'pl' ? 'Zamawiam i płacę' : 'Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <PriceText amount={finalTotal} className="text-white" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
