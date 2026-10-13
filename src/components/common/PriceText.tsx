import React from 'react';

interface PriceTextProps {
  amount: number;
  className?: string;
  isBold?: boolean;
}

export const PriceText: React.FC<PriceTextProps> = ({ amount, className = '', isBold = true }) => {
  const formatted = amount.toFixed(2);
  return (
    <span
      className={`tabular-nums tracking-tight ${isBold ? 'font-bold' : 'font-medium'} ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {formatted} zł
    </span>
  );
};
