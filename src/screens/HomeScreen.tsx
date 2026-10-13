import React, { useState, useMemo } from 'react';
import { Search, Star, Clock, Flame, Leaf, Plus, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../data/menuData';
import { MenuItem, KebabCategory } from '../types';
import { PriceText } from '../components/common/PriceText';
import { motion, AnimatePresence } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const { navigateTo, quickAddToCart, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<KebabCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  const categories: { id: KebabCategory; label: { pl: string; en: string }; icon: string }[] = [
    { id: 'all', label: { pl: 'Wszystko', en: 'All' }, icon: '✨' },
    { id: 'rollo', label: { pl: 'Rollo', en: 'Roll' }, icon: '🌯' },
    { id: 'bulka', label: { pl: 'W Bułce', en: 'In Bun' }, icon: '🥪' },
    { id: 'pita', label: { pl: 'W Picie', en: 'In Pita' }, icon: '🥙' },
    { id: 'box', label: { pl: 'Kebab Box', en: 'Box' }, icon: '🍟' },
    { id: 'sides', label: { pl: 'Dodatki', en: 'Sides' }, icon: '🧅' },
    { id: 'drinks', label: { pl: 'Napoje', en: 'Drinks' }, icon: '🥤' },
    { id: 'sauces', label: { pl: 'Sosy', en: 'Sauces' }, icon: '🌶️' },
  ];

  const promos = [
    {
      badge: language === 'pl' ? 'HIT DNIA' : 'TODAY SPECIAL',
      title: language === 'pl' ? 'Rollo Kebab Klasyk -20%' : 'Classic Kebab Roll -20%',
      subtitle: language === 'pl' ? 'Użyj kodu MISTRZ20 przy kasie' : 'Use code MISTRZ20 at checkout',
      bgColor: 'from-orange-600 to-amber-700',
      actionText: language === 'pl' ? 'Zamów teraz' : 'Order now',
      targetCategory: 'rollo' as KebabCategory,
    },
    {
      badge: language === 'pl' ? 'BLIK PROMO' : 'BLIK PROMO',
      title: language === 'pl' ? 'Darmowa dostawa od 40 zł' : 'Free delivery from 40 zł',
      subtitle: language === 'pl' ? 'Zapłać szybkim kodem BLIK' : 'Pay in 5 seconds with BLIK',
      bgColor: 'from-emerald-700 to-teal-800',
      actionText: language === 'pl' ? 'Sprawdź menu' : 'Browse menu',
      targetCategory: 'box' as KebabCategory,
    },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.pl.toLowerCase().includes(q) ||
        item.name.en.toLowerCase().includes(q) ||
        item.description.pl.toLowerCase().includes(q) ||
        item.description.en.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fade-in">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-orange-600" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={
            language === 'pl'
              ? 'Szukaj: rollo, bułka, ostry sos, box...'
              : 'Search: roll, bun, spicy sauce, box...'
          }
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Featured / Promo Carousel with Parallax card */}
      <div className="relative overflow-hidden rounded-3xl shadow-md">
        <motion.div
          key={activePromoIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`p-5 bg-gradient-to-br ${promos[activePromoIndex].bgColor} text-white relative flex flex-col justify-between min-h-[148px]`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold tracking-wide uppercase">
              {promos[activePromoIndex].badge}
            </span>
            <div className="flex gap-1.5">
              {promos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePromoIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activePromoIndex ? 'bg-white w-5' : 'bg-white/40'
                  }`}
                  aria-label={`Go to promo ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="my-2">
            <h2 className="text-lg font-bold font-['Poppins'] leading-snug">
              {promos[activePromoIndex].title}
            </h2>
            <p className="text-xs text-white/85 mt-0.5">
              {promos[activePromoIndex].subtitle}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategory(promos[activePromoIndex].targetCategory)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-stone-100 transition-transform active:scale-95 shadow-xs"
            >
              <span>{promos[activePromoIndex].actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-white/70">Wypiekane na bieżąco 24/7</span>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Category Chips with Animated Selection Indicator */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {language === 'pl' ? 'Kategorie dań' : 'Menu Categories'}
          </span>
          <span className="text-xs text-orange-600 font-medium">
            {filteredItems.length} {language === 'pl' ? 'pozycji' : 'items'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-750'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label[language]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Menu Item Cards with 24px Rounded Corners & Soft Shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="group bg-white dark:bg-stone-850 rounded-[24px] overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Card Image Area with Badges & Hero Click */}
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer"
              onClick={() => navigateTo('customization', item)}
            >
              <img
                src={item.imageUrl}
                alt={item.name[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Tag Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {item.isPopular && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-extrabold uppercase shadow-xs">
                    {language === 'pl' ? 'HIT' : 'POPULAR'}
                  </span>
                )}
                {item.isSpicy && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                    <Flame className="w-2.5 h-2.5" />
                    <span>{language === 'pl' ? 'OSTRY' : 'SPICY'}</span>
                  </span>
                )}
                {item.isVegetarian && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                    <Leaf className="w-2.5 h-2.5" />
                    <span>VEGE</span>
                  </span>
                )}
              </div>

              {/* Rating & Prep time float */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-xl bg-black/65 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {item.rating}
                </span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-0.5 text-stone-200">
                  <Clock className="w-3 h-3 text-stone-300" />
                  {item.preparationTimeMinutes} min
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div
                className="cursor-pointer"
                onClick={() => navigateTo('customization', item)}
              >
                <h3 className="font-bold font-['Poppins'] text-base text-stone-900 dark:text-stone-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {item.name[language]}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description[language]}
                </p>
              </div>

              {/* Bottom Price & Add to Cart Button */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    {language === 'pl' ? 'Cena od' : 'From'}
                  </span>
                  <PriceText amount={item.basePrice} className="text-lg text-stone-900 dark:text-stone-50" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('customization', item)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  >
                    {language === 'pl' ? 'Dopasuj' : 'Customize'}
                  </button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => quickAddToCart(item)}
                    className="p-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-xs transition-colors flex items-center justify-center"
                    aria-label={`Szybkie dodanie ${item.name[language]}`}
                    title={language === 'pl' ? 'Szybkie dodanie do koszyka' : 'Quick add to cart'}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-850 rounded-3xl p-6 border border-stone-200 dark:border-stone-800">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200 mt-3">
            {language === 'pl' ? 'Brak dań w tej kategorii' : 'No items found'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'pl' ? 'Spróbuj wyczyścić wyszukiwanie lub wybrać inną kategorię.' : 'Try clearing your search query or choosing another category.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-orange-600 text-white"
          >
            {language === 'pl' ? 'Pokaż całe menu' : 'Show full menu'}
          </button>
        </div>
      )}
    </div>
  );
};
