import { MenuItem, CustomizationOption } from '../types';

// Authentic images generated specifically for this application
export const IMAGES = {
  rollo: '/src/assets/images/kebab_rollo_wrap_1791904586990.jpg',
  bulka: '/src/assets/images/kebab_bulka_bun_1791904587488.jpg',
  box: '/src/assets/images/kebab_box_fries_1791904588018.jpg',
  pita: '/src/assets/images/falafel_pita_pocket_1791904587392.jpg',
  // High quality curated fallbacks for sides and drinks
  fries: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
  ayran: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
  cola: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
  sauces: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=800&q=80'
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'kebab-rollo-klasyk',
    category: 'rollo',
    name: {
      pl: 'Rollo Kebab Klasyk',
      en: 'Classic Kebab Roll',
    },
    description: {
      pl: 'Chrupiące ciasto lawasz, soczyste mięso opiekane, świeża kapusta, ogórek, pomidor i sos rzemieślniczy.',
      en: 'Crispy toasted lavash roll, juicy carved meat, fresh cabbage, cucumber, tomato, and artisan sauce.',
    },
    basePrice: 28.50,
    imageUrl: IMAGES.rollo,
    rating: 4.9,
    reviewsCount: 384,
    isPopular: true,
    preparationTimeMinutes: 12,
    calories: 740,
    availableMeats: ['chicken', 'beef', 'mix', 'falafel'],
    availableSizes: ['small', 'regular', 'large', 'mega'],
    availableBreads: ['lavash'],
  },
  {
    id: 'kebab-bulka-chrupiaca',
    category: 'bulka',
    name: {
      pl: 'Kebab w Bułce Tureckiej',
      en: 'Kebab in Toasted Sesame Bun',
    },
    description: {
      pl: 'Tradycyjna, wypiekana bułka z sezamem, podwójna porcja chrupiącego mięsa, czerwona cebulka i sos czosnkowy.',
      en: 'Traditional crispy sesame flatbread bun, double roasted meat, pickled red onions, and homemade garlic sauce.',
    },
    basePrice: 31.00,
    imageUrl: IMAGES.bulka,
    rating: 4.8,
    reviewsCount: 290,
    isPopular: true,
    preparationTimeMinutes: 14,
    calories: 820,
    availableMeats: ['chicken', 'beef', 'mix'],
    availableSizes: ['regular', 'large', 'mega'],
    availableBreads: ['bun'],
  },
  {
    id: 'kebab-box-frytki',
    category: 'box',
    name: {
      pl: 'Kebab Box z Frytkami',
      en: 'Loaded Kebab Box & Fries',
    },
    description: {
      pl: 'Porcja złocistych frytek, obfita warstwa mięsa z rusztu, roztopiony ser gouda i duet sosów.',
      en: 'Generous golden Belgian fries topped with carved döner meat, melted cheese, and dual sauce swirl.',
    },
    basePrice: 33.50,
    imageUrl: IMAGES.box,
    rating: 4.9,
    reviewsCount: 512,
    isPopular: true,
    isSpicy: true,
    preparationTimeMinutes: 10,
    calories: 910,
    availableMeats: ['chicken', 'beef', 'mix', 'falafel'],
    availableSizes: ['regular', 'large'],
  },
  {
    id: 'falafel-pita-grecka',
    category: 'pita',
    name: {
      pl: 'Falafel w Ciepłej Picie',
      en: 'Falafel in Warm Pita Pocket',
    },
    description: {
      pl: 'Świeża pita arabska, 4 chrupiące kotleciki z ciecierzycy, kremowy sos tahini, świeża mięta i granat.',
      en: 'Warm artisan pita pocket with 4 golden spiced falafels, velvety tahini, fresh mint, and pickled turnip.',
    },
    basePrice: 26.00,
    imageUrl: IMAGES.pita,
    rating: 4.7,
    reviewsCount: 165,
    isVegetarian: true,
    preparationTimeMinutes: 10,
    calories: 590,
    availableMeats: ['falafel'],
    availableSizes: ['small', 'regular', 'large'],
    availableBreads: ['pita'],
  },
  {
    id: 'kebab-rollo-serowe',
    category: 'rollo',
    name: {
      pl: 'Rollo Kebab Mega Ser',
      en: 'Cheesy Melt Kebab Roll',
    },
    description: {
      pl: 'Zapieczony z podwójnym serem mozzarella i cheddar w piecu konwekcyjnym. Ciągnący się, gorący rarytas.',
      en: 'Oven-melted double mozzarella and mature cheddar wrapped with roasted meat and mild herb sauce.',
    },
    basePrice: 34.00,
    imageUrl: IMAGES.rollo,
    rating: 4.9,
    reviewsCount: 420,
    isPopular: true,
    preparationTimeMinutes: 15,
    calories: 890,
    availableMeats: ['chicken', 'beef', 'mix'],
    availableSizes: ['regular', 'large', 'mega'],
    availableBreads: ['lavash'],
  },
  {
    id: 'kebab-pita-wolowina',
    category: 'pita',
    name: {
      pl: 'Kebab Pita Klasyczna',
      en: 'Classic Beef & Lamb Pita',
    },
    description: {
      pl: 'Ciepła kieszonka z mięsem wołowym doprawionym kuminem, ogórkiem kiszonym, pomidorem i sosem ostrym.',
      en: 'Toasted pita pocket stuffed with spiced beef, Polish dill pickles, tomato slices, and fiery harissa.',
    },
    basePrice: 29.50,
    imageUrl: IMAGES.bulka,
    rating: 4.7,
    reviewsCount: 198,
    isSpicy: true,
    preparationTimeMinutes: 11,
    calories: 710,
    availableMeats: ['chicken', 'beef', 'mix'],
    availableSizes: ['small', 'regular', 'large'],
    availableBreads: ['pita'],
  },
  {
    id: 'frytki-belgijskie',
    category: 'sides',
    name: {
      pl: 'Frytki Belgijskie Grubo Ciosane',
      en: 'Belgian Chunky Fries',
    },
    description: {
      pl: 'Chrupiące z zewnątrz, puszyste w środku, podawane z autorską posypką z ziół i soli morskiej.',
      en: 'Extra crispy twice-fried chunky fries sprinkled with rosemary salt and garlic seasoning.',
    },
    basePrice: 14.00,
    imageUrl: IMAGES.box,
    rating: 4.8,
    reviewsCount: 310,
    isVegetarian: true,
    preparationTimeMinutes: 8,
    calories: 390,
  },
  {
    id: 'ayran-tradycyjny',
    category: 'drinks',
    name: {
      pl: 'Ayran Schłodzony 330ml',
      en: 'Traditional Chilled Ayran',
    },
    description: {
      pl: 'Rzemieślniczy turecki napój jogurtowy z nutą soli i mięty. Idealny do gaszenia ostrych przypraw.',
      en: 'Refreshing traditional savory yogurt drink with a hint of mountain sea salt and crushed mint.',
    },
    basePrice: 7.50,
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 220,
    isVegetarian: true,
    preparationTimeMinutes: 2,
    calories: 120,
  },
  {
    id: 'fritz-kola',
    category: 'drinks',
    name: {
      pl: 'Fritz-Kola Klasyczna 330ml',
      en: 'Fritz-Kola Original 330ml',
    },
    description: {
      pl: 'Kultowa szklana butelka, prawdziwa kofeina i naturalny ekstrakt z orzeszków kola.',
      en: 'Iconic glass bottle craft cola with real caffeine and pure cane sugar extract.',
    },
    basePrice: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 140,
    isVegetarian: true,
    preparationTimeMinutes: 2,
    calories: 140,
  },
  {
    id: 'sos-ostry-harissa',
    category: 'sauces',
    name: {
      pl: 'Porcja Sosu: Piekielna Harissa',
      en: 'Extra Sauce: Fiery Harissa Dip',
    },
    description: {
      pl: 'Autorski sos z prażonych papryczek piri-piri, czosnku i kolendry. Dla koneserów mocnych wrażeń.',
      en: 'Homemade roasted red pepper and piri-piri chili dip with crushed garlic and smoked paprika.',
    },
    basePrice: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 95,
    isSpicy: true,
    isVegetarian: true,
    preparationTimeMinutes: 1,
    calories: 80,
  }
];

export const SIZE_OPTIONS: CustomizationOption[] = [
  { id: 'small', name: { pl: 'Mały (ok. 300g)', en: 'Small (~300g)' }, priceDelta: -4.00, category: 'size' },
  { id: 'regular', name: { pl: 'Średni / Standard (ok. 450g)', en: 'Regular / Standard (~450g)' }, priceDelta: 0, category: 'size' },
  { id: 'large', name: { pl: 'Duży (ok. 600g)', en: 'Large (~600g)' }, priceDelta: 6.00, category: 'size' },
  { id: 'mega', name: { pl: 'Mega Gigant (ok. 800g)', en: 'Mega Giant (~800g)' }, priceDelta: 12.00, category: 'size' },
];

export const MEAT_OPTIONS: CustomizationOption[] = [
  { id: 'chicken', name: { pl: 'Kurczak opiekany w ziołach', en: 'Herb-roasted Chicken' }, priceDelta: 0, category: 'meat' },
  { id: 'beef', name: { pl: 'Wołowina premium (kraft)', en: 'Craft Premium Beef' }, priceDelta: 3.50, category: 'meat' },
  { id: 'mix', name: { pl: 'Mix (Kurczak + Wołowina)', en: 'Mixed (Chicken + Beef)' }, priceDelta: 2.00, category: 'meat' },
  { id: 'falafel', name: { pl: 'Falafel chrupiący (Wegański)', en: 'Crispy Falafel (Vegan)' }, priceDelta: 0, category: 'meat' },
];

export const BREAD_OPTIONS: CustomizationOption[] = [
  { id: 'lavash', name: { pl: 'Cienki Lawasz (Rollo)', en: 'Thin Lavash (Roll)' }, priceDelta: 0, category: 'bread' },
  { id: 'bun', name: { pl: 'Chrupiąca Bułka Sezamowa', en: 'Crispy Sesame Bun' }, priceDelta: 2.00, category: 'bread' },
  { id: 'pita', name: { pl: 'Ciepła Pita Arabska', en: 'Warm Arabic Pita' }, priceDelta: 1.00, category: 'bread' },
];

export const SAUCE_OPTIONS: CustomizationOption[] = [
  { id: 'garlic', name: { pl: 'Sos Czosnkowy (Łagodny)', en: 'Garlic Yogurt (Mild)' }, priceDelta: 0, category: 'sauce' },
  { id: 'mild', name: { pl: 'Sos Łagodny Ziołowy', en: 'Herb Cream Sauce' }, priceDelta: 0, category: 'sauce' },
  { id: 'hot', name: { pl: 'Sos Ostry (Ostra papryka)', en: 'Hot Chili Harissa' }, priceDelta: 0, category: 'sauce' },
  { id: 'mixed', name: { pl: 'Mieszany (Czosnek + Ostry)', en: 'Mixed (Garlic + Spicy)' }, priceDelta: 0, category: 'sauce' },
  { id: 'bbq', name: { pl: 'Sos BBQ Wędzony', en: 'Smoky BBQ Glaze' }, priceDelta: 1.00, category: 'sauce' },
];

export const EXTRA_OPTIONS: CustomizationOption[] = [
  { id: 'extra_cheese', name: { pl: 'Podwójny ser zapiekany (+Ser)', en: 'Extra Melted Gouda Cheese' }, priceDelta: 4.50, category: 'extra' },
  { id: 'fries_inside', name: { pl: 'Frytki w środku (French Tacos style)', en: 'Fries inside the wrap' }, priceDelta: 4.00, category: 'extra' },
  { id: 'jalapeno', name: { pl: 'Papryczki Jalapeño na ostro', en: 'Pickled Spicy Jalapeños' }, priceDelta: 3.00, category: 'extra' },
  { id: 'extra_meat', name: { pl: 'Dodatkowa porcja mięsa (+80g)', en: 'Double Meat Portion (+80g)' }, priceDelta: 7.50, category: 'extra' },
];

export const REMOVAL_OPTIONS: CustomizationOption[] = [
  { id: 'no_onion', name: { pl: 'Bez czerwonej cebuli', en: 'No red onions' }, priceDelta: 0, category: 'removal' },
  { id: 'no_tomato', name: { pl: 'Bez świeżego pomidora', en: 'No fresh tomatoes' }, priceDelta: 0, category: 'removal' },
  { id: 'no_cabbage', name: { pl: 'Bez kapusty pekińskiej', en: 'No white cabbage' }, priceDelta: 0, category: 'removal' },
  { id: 'no_cucumber', name: { pl: 'Bez ogórka konserwowego', en: 'No pickles' }, priceDelta: 0, category: 'removal' },
];

export const PROMO_CODES: Record<string, { discountPercent: number; minOrder: number }> = {
  KRAKOW10: { discountPercent: 10, minOrder: 30 },
  MISTRZ20: { discountPercent: 20, minOrder: 50 },
  BLIKFREE: { discountPercent: 15, minOrder: 40 },
};
