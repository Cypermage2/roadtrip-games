import React from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  HelpCircle, 
  Compass, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  MapPin, 
  Flame,
  Clock
} from 'lucide-react';
import { GameMode } from '../types';

interface MainMenuProps {
  onSelectGame: (game: GameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectGame,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-slate-900 pb-12 select-none">
      {/* Top Header */}
      <header className="w-full max-w-xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex items-center justify-center">
            <Car className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-800 block">
              Highway Fun
            </span>
            <span className="text-sm font-bold text-slate-700">
              Mobile Edition
            </span>
          </div>
        </div>

        {/* Audio sound toggle */}
        <button
          id="menu-sound-toggle-btn"
          onClick={onToggleSound}
          className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center justify-center transition-all cursor-pointer"
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-slate-900 stroke-[2.5]" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          )}
        </button>
      </header>

      {/* Hero Title & Subtitle */}
      <div className="w-full max-w-xl mx-auto px-4 text-center mt-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-900 mb-3 shadow-[0_2px_0_0_#0f172a]">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          Road Trip Games & Activities
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-slate-950 tracking-tight leading-tight">
          ROAD TRIP <br className="hidden sm:block" />
          <span className="text-rose-600 drop-shadow-[0_2px_0_#0f172a]">PLAYGROUND</span>
        </h1>
        <p className="mt-2 text-base md:text-lg font-bold text-slate-700 max-w-md mx-auto">
          Roll the dice, spark unforgettable conversations, and debate wild dilemmas on the open highway!
        </p>
      </div>

      {/* Grid of 4 Game Selection Cards */}
      <main className="w-full max-w-xl mx-auto px-4 flex-1 space-y-4">
        
        {/* GAME 1: Road Trip Questions (ACTIVE) */}
        <motion.button
          id="select-road-trip-questions-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectGame('road_trip_questions')}
          className="w-full text-left bg-amber-400 hover:bg-amber-300 rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] active:translate-y-1.5 p-5 md:p-6 transition-all cursor-pointer relative overflow-hidden group"
        >
          {/* Top tag */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-black uppercase tracking-wider">
              Ready to Roll 🎲
            </span>
            <span className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center font-display font-black text-lg text-slate-900 shadow-[0_2px_0_0_#0f172a]">
              1
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-950 leading-tight">
                Road Trip Questions
              </h2>
              <p className="mt-1.5 text-base font-bold text-amber-950 leading-snug">
                Deep questions, hilarious car confessions, travel memories &amp; storytelling prompts.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border-3 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8 text-amber-600 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-slate-900/20 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Features 3D Animated Dice Roll
            </span>
            <span className="inline-flex items-center gap-1.5 font-display font-black text-base text-slate-950 bg-white px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]">
              PLAY NOW
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </span>
          </div>
        </motion.button>

        {/* GAME 2: Would You Rather Questions (ACTIVE) */}
        <motion.button
          id="select-would-you-rather-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectGame('would_you_rather')}
          className="w-full text-left bg-rose-500 hover:bg-rose-400 text-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] active:translate-y-1.5 p-5 md:p-6 transition-all cursor-pointer relative overflow-hidden group"
        >
          {/* Top tag */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-black uppercase tracking-wider">
              Ready to Roll 🎲
            </span>
            <span className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center font-display font-black text-lg text-slate-900 shadow-[0_2px_0_0_#0f172a]">
              2
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                Would You Rather?
              </h2>
              <p className="mt-1.5 text-base font-bold text-rose-100 leading-snug">
                Highway dilemmas, snack debates, passenger drama, and hilarious choices with voting!
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border-3 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex items-center justify-center flex-shrink-0 group-hover:-rotate-6 transition-transform">
              <Flame className="w-8 h-8 text-rose-600 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-white/20 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive Car Passenger Voting
            </span>
            <span className="inline-flex items-center gap-1.5 font-display font-black text-base text-slate-950 bg-white px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]">
              PLAY NOW
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </span>
          </div>
        </motion.button>

        {/* GAME 3: License Plate Game (ACTIVE) */}
        <motion.button
          id="select-license-plate-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectGame('license_plate')}
          className="w-full text-left bg-emerald-400 hover:bg-emerald-300 rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] active:translate-y-1.5 p-5 md:p-6 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-black uppercase tracking-wider">
              Ready to Play 🚗
            </span>
            <span className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center font-display font-black text-lg text-slate-900 shadow-[0_2px_0_0_#0f172a]">
              3
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-950 leading-tight">
                License Plate Game
              </h2>
              <p className="mt-1.5 text-base font-bold text-emerald-950 leading-snug">
                Spot and check off all 50 US state license plates! Progress is saved automatically.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border-3 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-8 h-8 text-emerald-700 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-slate-900/20 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              50 States Toggle Grid • Auto-Saved
            </span>
            <span className="inline-flex items-center gap-1.5 font-display font-black text-base text-slate-950 bg-white px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]">
              PLAY NOW
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </span>
          </div>
        </motion.button>

        {/* GAME 4: Tarot Reading (ACTIVE) */}
        <motion.button
          id="select-tarot-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectGame('tarot')}
          className="w-full text-left bg-purple-600 hover:bg-purple-500 text-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] active:translate-y-1.5 p-5 md:p-6 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider">
              Ready to Read 🔮
            </span>
            <span className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center font-display font-black text-lg text-slate-900 shadow-[0_2px_0_0_#0f172a]">
              4
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                Tarot Reading
              </h2>
              <p className="mt-1.5 text-base font-bold text-purple-100 leading-snug">
                1 or 3-card readings based on The Dark Forest Guide to Tarot! Place physical draws and email summaries.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border-3 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-8 h-8 text-purple-600 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-white/20 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">
              Full 78 Cards • Reversals • Email Report
            </span>
            <span className="inline-flex items-center gap-1.5 font-display font-black text-base text-slate-950 bg-white px-3.5 py-1.5 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]">
              READ NOW
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </span>
          </div>
        </motion.button>
      </main>

      {/* Footer / Mobile Tips */}
      <footer className="w-full max-w-xl mx-auto px-4 mt-8 text-center">
        <div className="bg-amber-100/90 border-2 border-amber-300 rounded-2xl p-3 text-xs md:text-sm font-bold text-amber-950 inline-block">
          🚘 Pass the phone around the car • Touch targets built for bumpy rides!
        </div>
      </footer>
    </div>
  );
};
