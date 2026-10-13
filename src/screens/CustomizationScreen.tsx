import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, AlertCircle, Plus, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS, SIZE_OPTIONS, MEAT_OPTIONS, BREAD_OPTIONS, SAUCE_OPTIONS, EXTRA_OPTIONS, REMOVAL_OPTIONS } from '../data/menuData';
import { SizeType, MeatType, BreadType, CartItemCustomization } from '../types';
import { PriceText } from '../components/common/PriceText';
import { QuantityStepper } from '../components/common/QuantityStepper';
import { motion } from 'motion/react';

export const CustomizationScreen: React.FC = () => {
  const { customizingItem, navigateTo, addToCart, language } = useApp();

  const item = customizingItem || MENU_ITEMS[0];

  const [selectedSize, setSelectedSize] = useState<SizeType>('regular');
  const [selectedMeat, setSelectedMeat] = useState<MeatType>('mix');
  const [selectedBread, setSelectedBread] = useState<BreadType>('lavash');
  const [selectedSauces, setSelectedSauces] = useState<string[]>(['garlic']);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Live price calculation
  const calculateUnitPrice = () => {
    let price = item.basePrice;
    const sizeOpt = SIZE_OPTIONS.find(s => s.id === selectedSize);
    if (sizeOpt) price += sizeOpt.priceDelta;

    const meatOpt = MEAT_OPTIONS.find(m => m.id === selectedMeat);
    if (meatOpt) price += meatOpt.priceDelta;

    const breadOpt = BREAD_OPTIONS.find(b => b.id === selectedBread);
    if (breadOpt) price += breadOpt.priceDelta;

    selectedExtras.forEach(extraId => {
      const extraOpt = EXTRA_OPTIONS.find(e => e.id === extraId);
      if (extraOpt) price += extraOpt.priceDelta;
    });

    return price;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * quantity;

  const handleSauceToggle = (sauceId: string) => {
    if (selectedSauces.includes(sauceId)) {
      if (selectedSauces.length > 1) {
        setSelectedSauces(prev => prev.filter(id => id !== sauceId));
      }
    } else {
      if (selectedSauces.length < 2) {
        setSelectedSauces(prev => [...prev, sauceId]);
      } else {
        // Replace second sauce
        setSelectedSauces([selectedSauces[0], sauceId]);
      }
    }
  };

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId) ? prev.filter(id => id !== extraId) : [...prev, extraId]
    );
  };

  const handleRemovalToggle = (removalId: string) => {
    setRemovedIngredients(prev =>
      prev.includes(removalId) ? prev.filter(id => id !== removalId) : [...prev, removalId]
    );
  };

  const handleAddToCart = () => {
    const customization: CartItemCustomization = {
      size: selectedSize,
      meat: selectedMeat,
      bread: selectedBread,
      sauces: selectedSauces,
      extras: selectedExtras,
      removals: removedIngredients,
      specialNotes: specialNotes.trim() || undefined,
    };

    addToCart(item, customization, quantity);
    navigateTo('cart');
  };

  return (
    <div className="relative pb-28 animate-fade-in">
      {/* Hero Collapsing Image Banner */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] overflow-hidden bg-stone-900">
        <img
          src={item.imageUrl}
          alt={item.name[language]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-black/30" />

        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => navigateTo('home')}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
            aria-label="Wróć"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white z-20">
          <span className="px-2.5 py-0.5 rounded-md bg-orange-600 text-[10px] font-extrabold uppercase tracking-wide">
            {language === 'pl' ? 'KREATOR KEBABA' : 'CUSTOMIZER'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] mt-1 leading-tight">
            {item.name[language]}
          </h2>
          <p className="text-xs text-stone-300 mt-0.5 line-clamp-2">
            {item.description[language]}
          </p>
        </div>
      </div>

      {/* Customization Options Container */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Size Selection */}
        <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>1. {language === 'pl' ? 'Wybierz rozmiar porcji' : 'Choose portion size'}</span>
              <span className="text-orange-600 font-extrabold">*</span>
            </h3>
            <span className="text-[11px] text-stone-400">Wymagane</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {SIZE_OPTIONS.map(opt => {
              const isSelected = selectedSize === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedSize(opt.id as SizeType)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-stone-900 dark:text-stone-100 ring-2 ring-orange-500/30'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.name[language]}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                  </div>
                  <span className="text-[11px] font-semibold text-orange-600 mt-2">
                    {opt.priceDelta === 0
                      ? (language === 'pl' ? 'W cenie bazowej' : 'Base price')
                      : `${opt.priceDelta > 0 ? '+' : ''}${opt.priceDelta.toFixed(2)} zł`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Meat Selection */}
        <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>2. {language === 'pl' ? 'Rodzaj mięsa (Kraft)' : 'Meat selection (Craft)'}</span>
              <span className="text-orange-600 font-extrabold">*</span>
            </h3>
            <span className="text-[11px] text-stone-400">Wymagane</span>
          </div>

          <div className="space-y-2">
            {MEAT_OPTIONS.map(opt => {
              const isSelected = selectedMeat === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedMeat(opt.id as MeatType)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-stone-900 dark:text-stone-100'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-orange-600 bg-orange-600' : 'border-stone-400'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs font-semibold">{opt.name[language]}</span>
                  </div>
                  <span className="text-xs font-bold text-orange-600">
                    {opt.priceDelta === 0 ? '+0.00 zł' : `+${opt.priceDelta.toFixed(2)} zł`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bread / Roll Selection */}
        <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100 mb-3">
            3. {language === 'pl' ? 'Rodzaj pieczywa' : 'Bread type'}
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {BREAD_OPTIONS.map(opt => {
              const isSelected = selectedBread === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedBread(opt.id as BreadType)}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-stone-900 dark:text-stone-100 font-bold'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs'
                  }`}
                >
                  <span className="text-xs">{opt.name[language]}</span>
                  <span className="text-[10px] text-orange-600 font-bold mt-1">
                    {opt.priceDelta === 0 ? '+0 zł' : `+${opt.priceDelta.toFixed(2)} zł`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sauces Selection (Up to 2) */}
        <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100">
              4. {language === 'pl' ? 'Sosy rzemieślnicze (max 2)' : 'Artisan sauces (max 2)'}
            </h3>
            <span className="text-[11px] text-orange-600 font-bold">
              {selectedSauces.length}/2 {language === 'pl' ? 'wybrane' : 'selected'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAUCE_OPTIONS.map(opt => {
              const isSelected = selectedSauces.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSauceToggle(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-600 text-white shadow-xs'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{opt.name[language]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Extras to Add */}
        <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100 mb-3">
            5. {language === 'pl' ? 'Dodatki do środka' : 'Extras inside'}
          </h3>

          <div className="space-y-2">
            {EXTRA_OPTIONS.map(opt => {
              const isSelected = selectedExtras.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleExtraToggle(opt.id)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 text-stone-900 dark:text-stone-100'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-stone-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs font-semibold">{opt.name[language]}</span>
                  </div>
                  <span className="text-xs font-bold text-orange-600">
                    +{opt.priceDelta.toFixed(2)} zł
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Removals / Allergens checklist */}
        <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100 mb-2">
            6. {language === 'pl' ? 'Usuń składniki (Bez czego?)' : 'Remove ingredients'}
          </h3>
          <p className="text-[11px] text-stone-400 mb-3">
            {language === 'pl' ? 'Zaznacz, jeśli nie lubisz danego składnika:' : 'Check what you do not want in your kebab:'}
          </p>

          <div className="flex flex-wrap gap-2">
            {REMOVAL_OPTIONS.map(opt => {
              const isExcluded = removedIngredients.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleRemovalToggle(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    isExcluded
                      ? 'border-red-500 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isExcluded ? <span>✕</span> : null}
                  <span>{opt.name[language]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Special Notes */}
        <div className="bg-white dark:bg-stone-850 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <h3 className="text-sm font-bold font-['Poppins'] text-stone-900 dark:text-stone-100 mb-2">
            7. {language === 'pl' ? 'Uwagi dla kucharza' : 'Special notes for the chef'}
          </h3>
          <input
            type="text"
            value={specialNotes}
            onChange={e => setSpecialNotes(e.target.value)}
            placeholder={
              language === 'pl'
                ? 'np. mocno spieczone mięso, sos osobno w pojemniczku...'
                : 'e.g. extra crispy meat, sauce on the side...'
            }
            className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Sticky Bottom Bar with Live Animated Price Counter & Stepper */}
      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto p-4 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            size="md"
          />

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-between shadow-lg shadow-orange-600/20 transition-all"
          >
            <span>{language === 'pl' ? 'Dodaj do koszyka' : 'Add to cart'}</span>
            <PriceText amount={totalPrice} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
