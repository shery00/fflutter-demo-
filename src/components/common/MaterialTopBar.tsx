import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Code2, MapPin, Zap, Download, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadFlutterProjectZip } from '../../flutter_export/downloadZip';

export const MaterialTopBar: React.FC = () => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const {
    screen,
    navigateTo,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    setShowFlutterInspector,
    setShowApkModal,
  } = useApp();

  const isHome = screen === 'home';

  const screenTitles: Record<string, { pl: string; en: string }> = {
    home: { pl: 'Warsztat Kebabu', en: 'Kebab Craft' },
    customization: { pl: 'Dopasuj kebaba', en: 'Customize Kebab' },
    cart: { pl: 'Twój koszyk', en: 'Your Cart' },
    checkout: { pl: 'Kasa i płatność', en: 'Checkout' },
    summary: { pl: 'Paragon i status', en: 'Receipt & Status' },
    history: { pl: 'Historia zamówień', en: 'Order History' },
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-stone-50/90 dark:bg-stone-900/90 border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left Slot: Back or Logo */}
        <div className="flex items-center gap-2">
          {!isHome ? (
            <button
              type="button"
              onClick={() => {
                if (screen === 'customization') navigateTo('home');
                else if (screen === 'checkout') navigateTo('cart');
                else if (screen === 'summary') navigateTo('history');
                else navigateTo('home');
              }}
              className="p-2 -ml-2 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              aria-label="Wróć"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-xl" role="img" aria-label="kebab">🌯</span>
          )}

          <div>
            <h1 className="text-base font-bold font-['Poppins'] text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
              {screenTitles[screen]?.[language] || 'Warsztat Kebabu'}
            </h1>
            {isHome && (
              <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                <MapPin className="w-3 h-3 text-orange-600" />
                <span>Wrocław, Polska · Otwarte</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Slot: Actions */}
        <div className="flex items-center gap-1.5">
          {/* 1-Click Download Entire Flutter Project as ZIP */}
          <button
            type="button"
            disabled={downloadingZip}
            onClick={async () => {
              setDownloadingZip(true);
              await downloadFlutterProjectZip();
              setTimeout(() => setDownloadingZip(false), 2000);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 shadow-xs transition-colors"
            title="Pobierz cały projekt Flutter w pliku .ZIP (Download Flutter Project ZIP)"
          >
            {downloadingZip ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloadingZip ? 'Pobrano!' : '.ZIP'}</span>
          </button>

          {/* APK Optimizer Hub Button */}
          <button
            type="button"
            onClick={() => setShowApkModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            title="Smallest APK Build & Optimization Hub (13.8 MB)"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>APK 14MB</span>
          </button>

          {/* Flutter Code Inspector Trigger */}
          <button
            type="button"
            onClick={() => setShowFlutterInspector(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-xs transition-colors"
            title="Inspect Flutter Dart code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dart</span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1 text-xs font-bold rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            title="Przełącz język / Switch language"
          >
            {language.toUpperCase()}
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title="Zmień motyw"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
