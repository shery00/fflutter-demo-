import React from 'react';
import { Wifi, Battery, Smartphone, Maximize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialTopBar } from './MaterialTopBar';
import { BottomNavBar } from './BottomNavBar';
import { motion, AnimatePresence } from 'motion/react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { viewMode, setViewMode, toast, theme } = useApp();

  const isFrame = viewMode === 'mobile_frame';

  return (
    <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-[#0e0e12] text-stone-100' : 'bg-[#f4efe6] text-stone-900'} flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 font-sans`}>
      {/* Top Floating Control Bar for the AI Studio Preview */}
      <div className="w-full max-w-5xl mb-4 px-4 hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌯</span>
            <div>
              <span className="text-sm font-bold font-['Poppins'] tracking-tight">Kebab Mistrz Poland</span>
              <span className="text-xs text-stone-500 ml-2">Flutter Material 3 Live Redesign Simulator</span>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setViewMode('mobile_frame')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              isFrame
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Phone Frame (Pixel 8)</span>
          </button>
          <button
            onClick={() => setViewMode('fullscreen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              !isFrame
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Expanded Edge-to-Edge</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isFrame
            ? 'max-w-md min-h-[850px] max-h-[920px] bg-stone-50 dark:bg-stone-900 rounded-[38px] shadow-2xl border-[10px] border-stone-800 dark:border-stone-800/90 overflow-hidden ring-1 ring-black/10'
            : 'max-w-3xl min-h-screen bg-stone-50 dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden sm:rounded-3xl'
        }`}
      >
        {/* Android Material 3 Status Bar */}
        <div className="h-7 px-6 pt-1 flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 select-none bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xs z-40">
          <span className="font-semibold text-[11px] font-mono">12:30</span>

          {/* Camera cutout notch for realistic Android simulator */}
          {isFrame && (
            <div className="w-3.5 h-3.5 rounded-full bg-black/80 ring-2 ring-stone-900/20" />
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold tracking-tight">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Top App Bar */}
        <MaterialTopBar />

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto pb-20 relative focus:outline-none">
          {children}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNavBar />

        {/* Android Gesture Navigation Bar Pill */}
        {isFrame && (
          <div className="h-4 w-full bg-stone-50/95 dark:bg-stone-900/95 flex items-center justify-center pointer-events-none select-none z-40">
            <div className="w-28 h-1 bg-stone-400 dark:bg-stone-600 rounded-full" />
          </div>
        )}

        {/* Snackbar / Undo Toast Message Overlay */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 left-4 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-stone-800 dark:border-stone-300"
            >
              <span className="text-xs font-medium truncate pr-2">{toast.message}</span>
              {toast.onAction && (
                <button
                  type="button"
                  onClick={toast.onAction}
                  className="px-2.5 py-1 text-xs font-bold text-orange-400 dark:text-orange-600 hover:underline uppercase tracking-wide shrink-0"
                >
                  {toast.actionLabel || 'Cofnij'}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
