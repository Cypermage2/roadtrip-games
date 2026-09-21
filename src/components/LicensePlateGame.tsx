import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  Search, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { US_STATES, USState } from '../data/states';
import { playButtonTapSound, playRollCompleteChime, triggerHapticFeedback } from '../utils/audio';

interface LicensePlateGameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const STORAGE_KEY = 'roadtrip_spotted_states';

export const LicensePlateGame: React.FC<LicensePlateGameProps> = ({
  onBack,
  soundEnabled,
  onToggleSound
}) => {
  // Load spotted states from localStorage
  const [spottedCodes, setSpottedCodes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // Fallback to empty array
      }
    }
    return [];
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'spotted' | 'unspotted'>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [justSpottedState, setJustSpottedState] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(spottedCodes));
    }
  }, [spottedCodes]);

  // Toggle state
  const handleToggleState = (code: string) => {
    const isCurrentlySpotted = spottedCodes.includes(code);

    if (soundEnabled) {
      if (!isCurrentlySpotted) {
        playRollCompleteChime();
      } else {
        playButtonTapSound();
      }
    }
    triggerHapticFeedback([40]);

    if (isCurrentlySpotted) {
      setSpottedCodes(prev => prev.filter(c => c !== code));
    } else {
      setSpottedCodes(prev => [...prev, code]);
      setJustSpottedState(code);
      setTimeout(() => setJustSpottedState(null), 1200);
    }
  };

  // Reset all
  const handleConfirmReset = () => {
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([50, 50]);
    setSpottedCodes([]);
    setShowResetConfirm(false);
  };

  // Filtered states list
  const filteredStates = useMemo(() => {
    return US_STATES.filter(state => {
      const matchesSearch = 
        state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.code.toLowerCase().includes(searchQuery.toLowerCase());

      const isSpotted = spottedCodes.includes(state.code);

      if (!matchesSearch) return false;
      if (activeTab === 'spotted') return isSpotted;
      if (activeTab === 'unspotted') return !isSpotted;
      return true;
    });
  }, [searchQuery, activeTab, spottedCodes]);

  const totalStates = US_STATES.length;
  const spottedCount = spottedCodes.length;
  const progressPercent = Math.round((spottedCount / totalStates) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-slate-900 pb-16 select-none">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-4 border-slate-900 px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            id="plate-back-btn"
            onClick={onBack}
            className="h-12 px-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center gap-1.5 font-display font-bold text-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="text-base">Games</span>
          </button>

          {/* Title Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-950">
              <MapPin className="w-3.5 h-3.5 text-slate-950" />
              License Plate Game
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              id="plate-sound-toggle-btn"
              onClick={onToggleSound}
              className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center justify-center text-slate-900 transition-all cursor-pointer"
              aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400 stroke-[2.5]" />
              )}
            </button>

            {/* Reset Button */}
            <button
              id="plate-reset-btn"
              onClick={() => setShowResetConfirm(true)}
              disabled={spottedCount === 0}
              className={`h-11 px-3 rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center gap-1.5 font-display font-bold text-sm transition-all cursor-pointer ${
                spottedCount === 0 
                  ? 'bg-slate-100 text-slate-400 border-slate-300 shadow-none cursor-not-allowed' 
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-900'
              }`}
              title="Reset spotted states"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto px-4 pt-4 flex-1 flex flex-col">
        
        {/* Progress Scoreboard Card */}
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] p-4 md:p-5 mb-4">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Road Trip Scoreboard
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-950">
                {spottedCount} of {totalStates} States Spotted
              </h2>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1.5 rounded-2xl bg-amber-300 border-2 border-slate-900 font-display font-black text-lg md:text-xl text-slate-950 shadow-[0_2px_0_0_#0f172a]">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-5 bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            />
          </div>

          {/* Milestones / Trophy Alert */}
          {spottedCount === totalStates && (
            <div className="mt-3.5 bg-amber-400 border-2 border-slate-900 rounded-2xl p-3 flex items-center justify-center gap-2 text-slate-950 font-display font-black text-lg animate-bounce">
              <Trophy className="w-6 h-6 text-amber-900" />
              <span>AMAZING! YOU SPOTTED ALL 50 STATES!</span>
            </div>
          )}
        </div>

        {/* Quick Search & Filter Controls */}
        <div className="space-y-3 mb-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-states-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search state or code (e.g. Texas, TX)..."
              className="w-full h-13 pl-12 pr-10 rounded-2xl bg-white border-3 border-slate-900 shadow-[0_4px_0_0_#0f172a] text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs (All, Spotted, Remaining) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              id="filter-all-btn"
              onClick={() => setActiveTab('all')}
              className={`py-2.5 px-3 rounded-2xl font-display font-bold text-sm md:text-base border-2 border-slate-900 transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_0_#0f172a]'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              All ({totalStates})
            </button>
            <button
              id="filter-spotted-btn"
              onClick={() => setActiveTab('spotted')}
              className={`py-2.5 px-3 rounded-2xl font-display font-bold text-sm md:text-base border-2 border-slate-900 transition-all cursor-pointer ${
                activeTab === 'spotted'
                  ? 'bg-emerald-400 text-slate-950 shadow-[0_3px_0_0_#0f172a]'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Spotted ({spottedCount})
            </button>
            <button
              id="filter-unspotted-btn"
              onClick={() => setActiveTab('unspotted')}
              className={`py-2.5 px-3 rounded-2xl font-display font-bold text-sm md:text-base border-2 border-slate-900 transition-all cursor-pointer ${
                activeTab === 'unspotted'
                  ? 'bg-rose-400 text-slate-950 shadow-[0_3px_0_0_#0f172a]'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Unspotted ({totalStates - spottedCount})
            </button>
          </div>
        </div>

        {/* STATE BUTTONS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredStates.map((state) => {
            const isSpotted = spottedCodes.includes(state.code);

            return (
              <motion.button
                key={state.code}
                id={`state-btn-${state.code}`}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => handleToggleState(state.code)}
                className={`relative min-h-[92px] p-3 rounded-2xl border-3 border-slate-900 transition-all cursor-pointer flex flex-col justify-between text-left overflow-hidden ${
                  isSpotted
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_5px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_1px_0_0_#0f172a]'
                    : 'bg-white hover:bg-slate-50 text-slate-800 shadow-[0_4px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_1px_0_0_#0f172a]'
                }`}
              >
                {/* Top bar with State Code badge */}
                <div className="flex items-center justify-between w-full">
                  <span className={`px-2.5 py-0.5 rounded-lg font-display font-black text-sm border-2 border-slate-900 ${
                    isSpotted ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {state.code}
                  </span>

                  {/* Spotted Checkmark Stamp */}
                  <div className={`w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center transition-colors ${
                    isSpotted ? 'bg-slate-950 text-emerald-300' : 'bg-slate-100 text-transparent'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3.5]" />
                  </div>
                </div>

                {/* State Name */}
                <div className="mt-2">
                  <span className="font-display font-black text-lg md:text-xl leading-tight block truncate">
                    {state.name}
                  </span>
                  {state.nickname && (
                    <span className="text-[11px] font-bold text-slate-600 truncate block mt-0.5">
                      {state.nickname}
                    </span>
                  )}
                </div>

                {/* Subtle Spotted Ribbon Indicator */}
                {isSpotted && (
                  <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-emerald-500/30 rounded-full pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Empty Search Result Fallback */}
        {filteredStates.length === 0 && (
          <div className="bg-white rounded-3xl border-3 border-slate-900 p-8 text-center my-6">
            <p className="text-xl font-display font-black text-slate-900">
              No states found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-400 border-2 border-slate-900 font-bold text-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* RESET CONFIRMATION MODAL */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white rounded-3xl border-4 border-slate-900 shadow-[0_10px_0_0_#0f172a] p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-rose-600 mb-3">
                <RotateCcw className="w-7 h-7 stroke-[2.5]" />
              </div>

              <h3 className="text-2xl font-display font-black text-slate-900">
                Reset All States?
              </h3>
              <p className="mt-2 text-base text-slate-700 font-medium leading-relaxed">
                This will clear all <strong>{spottedCount}</strong> spotted states and start your road trip tracker over fresh.
              </p>

              <div className="mt-6 space-y-2">
                <button
                  id="confirm-reset-states-btn"
                  onClick={handleConfirmReset}
                  className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 border-3 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] font-display font-black text-lg text-white transition-all cursor-pointer"
                >
                  Yes, Reset Progress
                </button>
                <button
                  id="cancel-reset-states-btn"
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 font-display font-bold text-base text-slate-800 transition-all cursor-pointer"
                >
                  Cancel &amp; Keep Progress
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
