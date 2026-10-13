import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface QuantityStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 20,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const btnClass = isSm
    ? 'w-7 h-7 text-xs'
    : isLg
    ? 'w-10 h-10 text-base'
    : 'w-8 h-8 text-sm';

  return (
    <div className="inline-flex items-center bg-stone-100 dark:bg-stone-800 rounded-2xl p-1 border border-stone-200 dark:border-stone-700/60 select-none">
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        disabled={value <= min}
        onClick={() => value > min && onChange(value - 1)}
        className={`${btnClass} flex items-center justify-center rounded-xl bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 shadow-xs disabled:opacity-35 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-600 transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </motion.button>

      <span
        className={`px-3 font-bold tabular-nums text-stone-900 dark:text-white ${
          isSm ? 'text-sm' : isLg ? 'text-lg' : 'text-base'
        }`}
      >
        {value}
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        disabled={value >= max}
        onClick={() => value < max && onChange(value + 1)}
        className={`${btnClass} flex items-center justify-center rounded-xl bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 shadow-xs disabled:opacity-35 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-600 transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
};
