import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, X, ArrowRight, Car, Compass } from 'lucide-react';

interface TeaserModalProps {
  game: 'license_plate' | 'tarot' | null;
  onClose: () => void;
  onSelectGame: (game: 'road_trip_questions' | 'would_you_rather') => void;
}

export const TeaserModal: React.FC<TeaserModalProps> = ({
  game,
  onClose,
  onSelectGame
}) => {
  if (!game) return null;

  const isLicensePlate = game === 'license_plate';

  const title = isLicensePlate ? 'License Plate Game' : 'Roadside Tarot Reading';
  const subtitle = isLicensePlate ? 'State Spotter & Collector' : 'Mystical Highway Prophecies';
  const description = isLicensePlate
    ? "Spot all 50 states (plus DC & territories!) as you cruise down the highway. Tap to mark them off, view your journey stats, and see who spots Hawaii or Alaska first!"
    : "Draw from a cosmic deck of highway cards! Discover what the road holds in store: unexpected detours, secret roadside diners, or encounters with mystical tumbleweeds.";

  const accentBg = isLicensePlate ? 'bg-emerald-400' : 'bg-purple-500';
  const borderColor = isLicensePlate ? 'border-emerald-950' : 'border-purple-950';
  const buttonBg = isLicensePlate ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-purple-600 hover:bg-purple-700';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-amber-50 rounded-3xl border-4 border-slate-900 shadow-[0_12px_0_0_#0f172a] p-6 text-slate-900 overflow-hidden"
        >
          {/* Top colored strip banner */}
          <div className={`absolute top-0 left-0 right-0 h-4 ${accentBg}`} />

          {/* Close button */}
          <button
            id="close-teaser-modal"
            onClick={onClose}
            className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 border-2 border-slate-900 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Coming Soon
            </span>
          </div>

          {/* Graphic / Icon Display */}
          <div className="my-5 flex justify-center">
            <div className={`w-24 h-24 rounded-3xl border-4 ${borderColor} ${accentBg} shadow-[0_6px_0_0_#0f172a] flex items-center justify-center transform -rotate-3`}>
              {isLicensePlate ? (
                <div className="text-center font-display">
                  <span className="block text-2xl font-black tracking-widest text-slate-950 border-b-2 border-slate-950 pb-0.5">
                    USA • 50
                  </span>
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    SPOTTER
                  </span>
                </div>
              ) : (
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white stroke-[2.5]" />
                  <Compass className="w-6 h-6 text-amber-300 absolute -bottom-1 -right-1" />
                </div>
              )}
            </div>
          </div>

          {/* Text Info */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-display font-black text-slate-950">
              {title}
            </h2>
            <p className="text-sm font-bold text-slate-600 mt-0.5 uppercase tracking-wide">
              {subtitle}
            </p>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-800 font-medium bg-white/80 border-2 border-slate-200 rounded-2xl p-3.5">
              {description}
            </p>
          </div>

          {/* Call to action: jump into active games */}
          <div className="mt-6 space-y-2.5">
            <button
              id="try-road-trip-questions-btn"
              onClick={() => {
                onClose();
                onSelectGame('road_trip_questions');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 border-3 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_1px_0_0_#0f172a] font-display font-bold text-lg text-slate-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Car className="w-5 h-5" />
              Play Road Trip Questions
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              id="try-would-you-rather-btn"
              onClick={() => {
                onClose();
                onSelectGame('would_you_rather');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-400 border-3 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_1px_0_0_#0f172a] font-display font-bold text-lg text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Play Would You Rather?
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
