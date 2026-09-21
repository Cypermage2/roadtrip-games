import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, RotateCw, Check, Sparkles } from 'lucide-react';
import { TarotCard, TarotSuit } from '../types';
import { TAROT_CARDS } from '../data/tarotCards';
import { TarotThumbnail } from './TarotThumbnail';

interface TarotCardPickerProps {
  isOpen: boolean;
  positionTitle: string;
  positionJob: string;
  currentCard: TarotCard | null;
  currentIsReversed: boolean;
  onSelect: (card: TarotCard, isReversed: boolean) => void;
  onClose: () => void;
}

export const TarotCardPicker: React.FC<TarotCardPickerProps> = ({
  isOpen,
  positionTitle,
  positionJob,
  currentCard,
  currentIsReversed,
  onSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuit, setSelectedSuit] = useState<TarotSuit | 'all'>('all');
  const [isReversed, setIsReversed] = useState(currentIsReversed);

  // Sync reversal state when opening
  React.useEffect(() => {
    setIsReversed(currentIsReversed);
  }, [currentIsReversed, isOpen]);

  // Filter cards
  const filteredCards = useMemo(() => {
    return TAROT_CARDS.filter(card => {
      const matchesSuit = selectedSuit === 'all' || card.suit === selectedSuit;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        card.name.toLowerCase().includes(query) ||
        card.numberStr.toLowerCase().includes(query) ||
        card.uprightKeywords.some(k => k.toLowerCase().includes(query)) ||
        card.element.toLowerCase().includes(query);

      return matchesSuit && matchesSearch;
    });
  }, [searchQuery, selectedSuit]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-xl max-h-[90vh] bg-amber-50 rounded-t-3xl sm:rounded-3xl border-4 border-slate-900 shadow-[0_12px_0_0_#0f172a] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white border-b-3 border-slate-900 px-4 py-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 block">
                Assigning Position
              </span>
              <h3 className="text-xl font-display font-black text-slate-950 flex items-center gap-1.5">
                <span>{positionTitle}</span>
                <span className="text-slate-400 font-normal text-sm">({positionJob})</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-slate-700 cursor-pointer"
              aria-label="Close card picker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar: Search + Orientation Toggle */}
          <div className="p-4 bg-white/60 border-b-2 border-slate-200 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search card name, keyword (e.g., Fool, Star, Cups)..."
                className="w-full h-11 pl-10 pr-8 rounded-xl bg-white border-2 border-slate-900 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Reversal Toggle Switch */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-purple-100 border-2 border-slate-900">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-purple-900" />
                <div>
                  <span className="text-xs font-black text-purple-950 block">
                    Card Orientation
                  </span>
                  <span className="text-[11px] font-semibold text-purple-800">
                    {isReversed ? 'Reversed (Turned inward / quiet voice)' : 'Upright (Direct energy / open expression)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReversed(!isReversed)}
                className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 font-display font-black text-xs transition-all cursor-pointer ${
                  isReversed
                    ? 'bg-rose-500 text-white shadow-[0_2px_0_0_#0f172a]'
                    : 'bg-emerald-400 text-slate-950 shadow-[0_2px_0_0_#0f172a]'
                }`}
              >
                {isReversed ? '🔄 Reversed' : '⬆️ Upright'}
              </button>
            </div>

            {/* Suit Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All (78)' },
                { id: 'major', label: 'Majors (22)' },
                { id: 'wands', label: 'Wands (Fire)' },
                { id: 'cups', label: 'Cups (Water)' },
                { id: 'swords', label: 'Swords (Air)' },
                { id: 'pentacles', label: 'Pentacles (Earth)' }
              ].map(suit => (
                <button
                  key={suit.id}
                  type="button"
                  onClick={() => setSelectedSuit(suit.id as TarotSuit | 'all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-black border-2 border-slate-900 whitespace-nowrap transition-all cursor-pointer ${
                    selectedSuit === suit.id
                      ? 'bg-purple-600 text-white shadow-[0_2px_0_0_#0f172a]'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {suit.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCards.map(card => {
                const isCurrent = currentCard?.id === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      onSelect(card, isReversed);
                      onClose();
                    }}
                    className={`p-2.5 rounded-2xl border-2 border-slate-900 text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isCurrent
                        ? 'bg-amber-200 border-purple-900 shadow-[0_4px_0_0_#0f172a]'
                        : 'bg-white hover:bg-purple-50 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5'
                    }`}
                  >
                    {/* Mini Thumbnail */}
                    <div className="flex-shrink-0">
                      <TarotThumbnail card={card} isReversed={isReversed} size="sm" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-purple-700 px-1.5 py-0.5 rounded-md bg-purple-100 border border-purple-300">
                          {card.numberStr}
                        </span>
                        <h4 className="font-display font-black text-sm text-slate-900 truncate">
                          {card.name}
                        </h4>
                      </div>

                      <p className="text-[11px] font-medium text-slate-600 line-clamp-1 mt-0.5">
                        {isReversed ? card.reversedKeywords.slice(0, 3).join(' • ') : card.uprightKeywords.slice(0, 3).join(' • ')}
                      </p>

                      <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>{card.element}</span>
                        <span className="text-purple-700">Leans: {card.leans}</span>
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredCards.length === 0 && (
              <div className="py-12 text-center">
                <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-base font-display font-bold text-slate-700">
                  No cards match &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSuit('all');
                  }}
                  className="mt-2 text-xs font-bold text-purple-700 underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
