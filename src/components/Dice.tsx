import React from 'react';
import { motion } from 'motion/react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRoll?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  onRoll,
  size = 'lg'
}) => {
  // Pips pattern for standard D6
  const renderPips = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className="w-5 h-5 md:w-6 md:h-6 bg-red-600 rounded-full shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between w-full h-full p-2.5">
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full self-start" />
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full self-end" />
          </div>
        );
      case 3:
        return (
          <div className="flex justify-between w-full h-full p-2.5">
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full self-start" />
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full self-center" />
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full self-end" />
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-2.5 gap-2 place-items-center">
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
            <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
          </div>
        );
      case 5:
        return (
          <div className="relative w-full h-full p-2.5">
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-2 place-items-center">
              <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
              <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
              <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
              <span className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full" />
            </div>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 bg-red-600 rounded-full" />
          </div>
        );
      case 6:
        return (
          <div className="grid grid-cols-2 grid-rows-3 w-full h-full p-2 gap-1.5 place-items-center">
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-900 rounded-full" />
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-900 rounded-full" />
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-900 rounded-full" />
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-900 rounded-full" />
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-900 rounded-full" />
            <span className="w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-900 rounded-full" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-full h-full font-display text-4xl text-amber-600">
            ?
          </div>
        );
    }
  };

  const dimensionClasses = {
    sm: 'w-14 h-14 rounded-xl border-3 text-sm',
    md: 'w-20 h-20 rounded-2xl border-4 text-base',
    lg: 'w-24 h-24 md:w-28 md:h-28 rounded-3xl border-4 text-lg'
  }[size];

  return (
    <div className="relative inline-flex items-center justify-center p-2">
      {/* Dynamic Ground Shadow */}
      <motion.div 
        className="absolute -bottom-1 w-20 md:w-24 h-4 bg-black/20 rounded-full blur-xs"
        animate={isRolling ? {
          scaleX: [1, 0.6, 1.3, 0.7, 1],
          opacity: [0.3, 0.1, 0.35, 0.15, 0.3],
        } : { scaleX: 1, opacity: 0.25 }}
        transition={{ duration: 0.8, repeat: isRolling ? Infinity : 0 }}
      />

      {/* Tappable Animated Dice */}
      <motion.button
        id="dice-roll-touch-target"
        type="button"
        onClick={onRoll}
        disabled={isRolling}
        aria-label={`Dice showing ${value || 'ready to roll'}. Tap to roll.`}
        className={`relative ${dimensionClasses} bg-white border-slate-900 shadow-[0_8px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] active:translate-y-1 transition-colors cursor-pointer select-none flex items-center justify-center`}
        animate={
          isRolling
            ? {
                rotate: [0, 180, 360, 540, 720],
                rotateX: [0, 180, 360, 540, 720],
                rotateY: [0, -180, -360, -540, -720],
                y: [0, -55, -20, -45, 0],
                scale: [1, 1.15, 0.95, 1.1, 1],
              }
            : {
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                y: 0,
                scale: 1,
              }
        }
        transition={
          isRolling
            ? {
                duration: 0.9,
                ease: 'easeInOut',
              }
            : {
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }
        }
        whileHover={!isRolling ? { scale: 1.05, rotate: 2 } : {}}
        whileTap={!isRolling ? { scale: 0.95 } : {}}
      >
        {/* Subtle corner gloss highlight */}
        <div className="absolute top-1 left-2 w-3 h-3 bg-white/70 rounded-full blur-xs pointer-events-none" />

        {/* Dice face */}
        <div className="w-full h-full flex items-center justify-center">
          {renderPips(value)}
        </div>
      </motion.button>
    </div>
  );
};
