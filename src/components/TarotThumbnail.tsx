import React from 'react';
import { TarotCard } from '../types';

interface TarotThumbnailProps {
  card: TarotCard;
  isReversed?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDetails?: boolean;
  className?: string;
}

export const TarotThumbnail: React.FC<TarotThumbnailProps> = ({
  card,
  isReversed = false,
  size = 'md',
  showDetails = false,
  className = ''
}) => {
  // Size dimensions
  const sizeClasses = {
    xs: 'w-10 h-16 text-[8px]',
    sm: 'w-16 h-26 text-[10px]',
    md: 'w-24 h-40 text-xs',
    lg: 'w-36 h-60 text-sm',
    xl: 'w-48 h-80 text-base'
  }[size];

  // Suit / Arcana background colors and gradients
  const getSuitStyles = () => {
    switch (card.suit) {
      case 'wands':
        return {
          bg: 'bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200',
          border: 'border-amber-800',
          accent: 'text-amber-700',
          badgeBg: 'bg-amber-600 text-white',
          symbolColor: '#d97706'
        };
      case 'cups':
        return {
          bg: 'bg-gradient-to-b from-sky-100 via-blue-50 to-cyan-200',
          border: 'border-blue-900',
          accent: 'text-blue-700',
          badgeBg: 'bg-blue-600 text-white',
          symbolColor: '#2563eb'
        };
      case 'swords':
        return {
          bg: 'bg-gradient-to-b from-slate-100 via-indigo-50 to-slate-200',
          border: 'border-slate-800',
          accent: 'text-slate-700',
          badgeBg: 'bg-slate-700 text-white',
          symbolColor: '#475569'
        };
      case 'pentacles':
        return {
          bg: 'bg-gradient-to-b from-emerald-100 via-stone-50 to-amber-100',
          border: 'border-emerald-900',
          accent: 'text-emerald-800',
          badgeBg: 'bg-emerald-700 text-white',
          symbolColor: '#059669'
        };
      default: // Major Arcana
        return {
          bg: 'bg-gradient-to-b from-amber-50 via-purple-50 to-amber-100',
          border: 'border-purple-950',
          accent: 'text-purple-900',
          badgeBg: 'bg-purple-900 text-amber-300',
          symbolColor: '#581c87'
        };
    }
  };

  const style = getSuitStyles();

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Physical Card Body */}
      <div 
        className={`relative ${sizeClasses} rounded-xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] overflow-hidden flex flex-col justify-between p-1.5 transition-transform duration-300 ${style.bg} ${
          isReversed ? 'rotate-180' : ''
        }`}
      >
        {/* Double inner vintage hairline border */}
        <div className="absolute inset-1 rounded-lg border border-amber-900/30 pointer-events-none" />

        {/* Top Header: Roman numeral or Rank */}
        <div className="flex items-center justify-between z-10 px-1">
          <span className="font-display font-black text-slate-800 tracking-tight">
            {card.numberStr}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            {card.suit === 'major' ? 'Major' : card.suit.slice(0, 1).toUpperCase()}
          </span>
        </div>

        {/* Center Illustration Artwork */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 my-1">
          {/* Decorative halo / celestial ring */}
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-amber-800/30 flex items-center justify-center bg-white/60 shadow-inner">
            <span className="text-xl md:text-3xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform">
              {card.symbol}
            </span>
          </div>

          {/* Card Element and Minor Pips */}
          {size !== 'xs' && (
            <div className="mt-1 flex items-center gap-1 opacity-75">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700">
                {card.element.split('·')[0].trim()}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Banner with Card Name */}
        <div className="z-10 text-center bg-white/90 border-t border-slate-900/20 py-0.5 px-1 rounded-md shadow-xs">
          <span className="font-display font-black text-slate-950 block truncate leading-none text-[9px] md:text-[11px]">
            {card.name}
          </span>
        </div>
      </div>

      {/* Orientation Indicator Pill (if reversed or detailed) */}
      {isReversed && (
        <span className="mt-1.5 px-2 py-0.5 rounded-full bg-rose-500 border border-slate-900 text-white font-display font-black text-[10px] tracking-wider uppercase shadow-[0_1px_0_0_#0f172a]">
          Reversed 🔄
        </span>
      )}

      {showDetails && (
        <div className="mt-1 text-center">
          <span className="font-display font-bold text-xs text-slate-800 block">
            {card.name}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">
            {isReversed ? 'Reversed' : 'Upright'}
          </span>
        </div>
      )}
    </div>
  );
};
