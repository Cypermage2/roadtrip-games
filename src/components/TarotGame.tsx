import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  RotateCw, 
  Sparkles, 
  Mail, 
  Copy, 
  Check, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Compass, 
  BookOpen, 
  Share2,
  ChevronRight,
  Plus
} from 'lucide-react';
import { TarotCard, TarotSpreadType, DrawnCardSlot } from '../types';
import { TAROT_SPREADS } from '../data/tarotSpreads';
import { TarotThumbnail } from './TarotThumbnail';
import { TarotCardPicker } from './TarotCardPicker';
import { playButtonTapSound, playRollCompleteChime, triggerHapticFeedback } from '../utils/audio';

interface TarotGameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TarotGame: React.FC<TarotGameProps> = ({
  onBack,
  soundEnabled,
  onToggleSound
}) => {
  // Selected Spread (single or 3-card variants)
  const [selectedSpreadId, setSelectedSpreadId] = useState<TarotSpreadType>('past_present_future');
  
  const currentSpread = TAROT_SPREADS.find(s => s.id === selectedSpreadId) || TAROT_SPREADS[0];

  // Card slots state
  const [slots, setSlots] = useState<DrawnCardSlot[]>(() => {
    return currentSpread.positions.map((pos, idx) => ({
      positionIndex: idx,
      positionName: pos.title,
      positionJob: pos.job,
      card: null,
      isReversed: false
    }));
  });

  // When changing spread, rebuild slots
  const handleSelectSpread = (spreadId: TarotSpreadType) => {
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([30]);
    setSelectedSpreadId(spreadId);
    setShowReading(false);

    const nextSpread = TAROT_SPREADS.find(s => s.id === spreadId) || TAROT_SPREADS[0];
    setSlots(nextSpread.positions.map((pos, idx) => ({
      positionIndex: idx,
      positionName: pos.title,
      positionJob: pos.job,
      card: null,
      isReversed: false
    })));
  };

  // Card picker state
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  // Reveal reading state
  const [showReading, setShowReading] = useState(false);

  // Email form state
  const [recipientEmail, setRecipientEmail] = useState('daboyce2@gmail.com');
  const [emailCopied, setEmailCopied] = useState(false);

  // Open slot picker
  const handleOpenSlotPicker = (index: number) => {
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([20]);
    setActiveSlotIndex(index);
  };

  // Assign card to slot
  const handleAssignCard = (card: TarotCard, isReversed: boolean) => {
    if (activeSlotIndex === null) return;

    if (soundEnabled) playRollCompleteChime();
    triggerHapticFeedback([40]);

    setSlots(prev => {
      const updated = [...prev];
      updated[activeSlotIndex] = {
        ...updated[activeSlotIndex],
        card,
        isReversed
      };
      return updated;
    });

    setActiveSlotIndex(null);
  };

  // Quick toggle reversal on a slot directly
  const handleToggleSlotReversal = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([20]);

    setSlots(prev => {
      const updated = [...prev];
      if (updated[index].card) {
        updated[index] = {
          ...updated[index],
          isReversed: !updated[index].isReversed
        };
      }
      return updated;
    });
  };

  // Reset current reading
  const handleResetSlots = () => {
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([40, 40]);
    setSlots(prev => prev.map(s => ({ ...s, card: null, isReversed: false })));
    setShowReading(false);
  };

  const allSlotsFilled = slots.every(s => s.card !== null);

  // Generate the reading synthesis using Dark Forest Guide principles
  const generateSynthesis = () => {
    const filledCards = slots.filter(s => s.card !== null);
    if (filledCards.length === 0) return '';

    if (filledCards.length === 1) {
      const slot = filledCards[0];
      const card = slot.card!;
      const orientation = slot.isReversed ? 'Reversed' : 'Upright';
      return `Your single-card draw is ${card.name} (${orientation}). As the Dark Forest Guide reminds us, a single card forces you to read the picture and cut straight to the heart of the matter. This card's central invitation is: "${card.tagline}"`;
    }

    // 3 cards synthesis: Word -> Sentence -> Story & Majors/Minors scale
    const majorCount = filledCards.filter(s => s.card?.arcana === 'major').length;
    const cardNames = filledCards.map(s => `${s.card?.name} (${s.isReversed ? 'Reversed' : 'Upright'})`).join(', ');

    let scaleNote = '';
    if (majorCount >= 2) {
      scaleNote = `With ${majorCount} Major Arcana in this spread, significant slow-moving turning points and deeper life forces are at play. `;
    } else {
      scaleNote = 'With mostly Minor Arcana present, this reading speaks to the everyday texture of your journey, your conversations, immediate work, and current habits. ';
    }

    const first = filledCards[0];
    const second = filledCards[1];
    const third = filledCards[2];

    const sentenceFlow = `In three gears: You move from ${first.positionName} shaped by ${first.card?.name} (${first.isReversed ? first.card?.reversedKeywords[0] : first.card?.uprightKeywords[0]}), into the ${second.positionName} of ${second.card?.name} (${second.isReversed ? second.card?.reversedKeywords[0] : second.card?.uprightKeywords[0]}), steering toward ${third.positionName} where ${third.card?.name} brings ${third.isReversed ? third.card?.reversedKeywords[0] : third.card?.uprightKeywords[0]}.`;

    return `${scaleNote}${sentenceFlow}`;
  };

  // Formatted Text Summary for Email / Clipboard
  const getFormattedReadingText = () => {
    const dateStr = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    let text = `🌙 THE DARK FOREST TAROT READING\n`;
    text += `Spread: ${currentSpread.title}\n`;
    text += `Date: ${dateStr}\n`;
    text += `====================================\n\n`;

    slots.forEach((slot, idx) => {
      if (slot.card) {
        text += `[Position ${idx + 1}: ${slot.positionName} - ${slot.positionJob}]\n`;
        text += `Card: ${slot.card.name} (${slot.isReversed ? 'Reversed 🔄' : 'Upright ⬆️'})\n`;
        text += `Element: ${slot.card.element} | Directional Lean: ${slot.card.leans}\n`;
        text += `Core Insight: ${slot.isReversed ? slot.card.reversedMeaning : slot.card.uprightMeaning}\n`;
        text += `Keywords: ${(slot.isReversed ? slot.card.reversedKeywords : slot.card.uprightKeywords).join(', ')}\n`;
        text += `Advice: ${slot.card.advice}\n`;
        text += `Reflection: ${slot.card.reflection}\n`;
        text += `Affirmation: ${slot.card.affirmation}\n\n`;
      }
    });

    text += `====================================\n`;
    text += `STORY & SYNTHESIS:\n${generateSynthesis()}\n\n`;
    text += `A Note from the Dark Forest:\n"Tarot holds up a mirror. The cards describe; you decide. The future stays in your hands, where it belongs."\n`;

    return text;
  };

  // Trigger mailto link
  const handleSendEmail = () => {
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([40]);

    const subject = encodeURIComponent(`Your Tarot Reading: ${currentSpread.title}`);
    const body = encodeURIComponent(getFormattedReadingText());
    const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  // Copy to clipboard
  const handleCopyReading = async () => {
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([30]);

    try {
      await navigator.clipboard.writeText(getFormattedReadingText());
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-slate-900 pb-20 select-none">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-4 border-slate-900 px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            id="tarot-back-btn"
            onClick={onBack}
            className="h-12 px-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center gap-1.5 font-display font-bold text-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="text-base">Games</span>
          </button>

          {/* Title Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Dark Forest Tarot
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              id="tarot-sound-toggle-btn"
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
              id="tarot-reset-btn"
              onClick={handleResetSlots}
              className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center justify-center text-slate-700 cursor-pointer"
              title="Reset Cards"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl mx-auto px-4 pt-4 flex-1 flex flex-col space-y-4">

        {/* Spread Selector Card */}
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] p-4 md:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 block">
                Choose Spread
              </span>
              <h2 className="text-2xl font-display font-black text-slate-950">
                1 or 3 Card Readings
              </h2>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-100 border-2 border-slate-900 text-purple-900 font-display font-black text-xs">
              Draw Your Own Cards
            </span>
          </div>

          {/* 1 vs 3 Card Spread Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TAROT_SPREADS.map(spread => (
              <button
                key={spread.id}
                id={`spread-select-${spread.id}`}
                onClick={() => handleSelectSpread(spread.id)}
                className={`p-3 rounded-2xl border-2 border-slate-900 font-display font-bold text-xs md:text-sm text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                  selectedSpreadId === spread.id
                    ? 'bg-purple-600 text-white shadow-[0_4px_0_0_#0f172a]'
                    : 'bg-white text-slate-800 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-black uppercase opacity-80">
                    {spread.cardCount === 1 ? '1 Card' : '3 Cards'}
                  </span>
                  {selectedSpreadId === spread.id && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </div>
                <span className="block leading-tight mt-1 truncate">
                  {spread.title}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs md:text-sm text-slate-600 font-medium leading-relaxed bg-amber-50/80 p-2.5 rounded-xl border border-slate-200">
            📖 <strong>Dark Forest Guide:</strong> {currentSpread.description}
          </p>
        </div>

        {/* INTERACTIVE LAYOUT: CARD SLOTS */}
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] p-4 md:p-6 text-center">
          <div className="mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Physical Card Placement
            </span>
            <h3 className="text-xl md:text-2xl font-display font-black text-slate-950">
              Tap Each Slot to Assign Your Drawn Card
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Draw your cards outside the app, then tap each card slot to set which card was drawn and if it was reversed.
            </p>
          </div>

          {/* Cards Layout Grid */}
          <div className={`grid gap-3 md:gap-4 my-2 ${
            slots.length === 1 
              ? 'grid-cols-1 max-w-xs mx-auto' 
              : 'grid-cols-3'
          }`}>
            {slots.map((slot, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center"
              >
                {/* Position Title & Job */}
                <div className="mb-2 text-center">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 border border-slate-900 text-[11px] font-display font-black text-purple-950 block truncate max-w-[110px] md:max-w-none">
                    {slot.positionName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 block truncate max-w-[100px] mt-0.5">
                    {slot.positionJob}
                  </span>
                </div>

                {/* Slot Card or Empty Slot Box */}
                {slot.card ? (
                  <div 
                    onClick={() => handleOpenSlotPicker(idx)}
                    className="relative group cursor-pointer"
                  >
                    <TarotThumbnail 
                      card={slot.card} 
                      isReversed={slot.isReversed} 
                      size={slots.length === 1 ? 'lg' : 'md'} 
                    />

                    {/* Quick Flip Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSlotReversal(idx, e)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] flex items-center justify-center text-slate-900 cursor-pointer z-20"
                      title="Flip Upright / Reversed"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    id={`empty-slot-${idx}`}
                    type="button"
                    onClick={() => handleOpenSlotPicker(idx)}
                    className={`w-24 h-40 md:w-32 md:h-52 rounded-2xl border-3 border-dashed border-purple-400 hover:border-purple-600 bg-purple-50/60 hover:bg-purple-100/60 flex flex-col items-center justify-center p-2 text-purple-900 transition-all cursor-pointer shadow-inner active:scale-95`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white border-2 border-purple-900 flex items-center justify-center text-purple-900 shadow-xs mb-2">
                      <Plus className="w-5 h-5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-display font-black leading-tight text-center">
                      Place Card
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 mt-1">
                      Slot {idx + 1}
                    </span>
                  </button>
                )}

                {/* Card Name Under Slot if Placed */}
                {slot.card && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => handleOpenSlotPicker(idx)}
                      className="text-xs font-display font-black text-slate-900 hover:text-purple-700 underline truncate block max-w-[110px]"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reveal / Generate Reading Button */}
          <div className="mt-6 pt-4 border-t-2 border-slate-200">
            <button
              id="reveal-reading-btn"
              type="button"
              disabled={!allSlotsFilled}
              onClick={() => {
                if (soundEnabled) playRollCompleteChime();
                triggerHapticFeedback([40, 60]);
                setShowReading(true);
              }}
              className={`w-full py-4 px-6 rounded-2xl border-3 border-slate-900 font-display font-black text-lg md:text-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                allSlotsFilled
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_6px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_2px_0_0_#0f172a]'
                  : 'bg-slate-100 text-slate-400 border-slate-300 shadow-none cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{allSlotsFilled ? 'Reveal Tarot Reading' : `Select All ${slots.length} Card(s) to Read`}</span>
            </button>
          </div>
        </div>

        {/* FULL READING INTERPRETATION SECTION */}
        <AnimatePresence>
          {showReading && allSlotsFilled && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="space-y-4"
            >
              {/* Reading Card Breakdown */}
              <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] p-4 md:p-6 space-y-6">
                <div className="border-b-3 border-slate-900 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 block">
                      The Dark Forest Guide
                    </span>
                    <h3 className="text-2xl font-display font-black text-slate-950">
                      Your Reading Breakdown
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-300 border-2 border-slate-900 font-display font-black text-xs text-slate-950">
                    {slots.length} Cards
                  </span>
                </div>

                {/* Individual Card Interpretations */}
                <div className="space-y-6">
                  {slots.map((slot, idx) => {
                    const card = slot.card!;
                    const isRev = slot.isReversed;
                    const meaning = isRev ? card.reversedMeaning : card.uprightMeaning;
                    const keywords = isRev ? card.reversedKeywords : card.uprightKeywords;

                    return (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl bg-amber-50/70 border-3 border-slate-900 shadow-[0_4px_0_0_#0f172a] flex flex-col md:flex-row items-start gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                          <TarotThumbnail card={card} isReversed={isRev} size="md" />
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-black uppercase text-purple-800 tracking-wider">
                                Position {idx + 1}: {slot.positionName} ({slot.positionJob})
                              </span>
                              <h4 className="text-xl font-display font-black text-slate-950">
                                {card.name}
                              </h4>
                            </div>
                            <span className={`px-2.5 py-1 rounded-xl border-2 border-slate-900 text-xs font-display font-black ${
                              isRev ? 'bg-rose-400 text-white' : 'bg-emerald-400 text-slate-950'
                            }`}>
                              {isRev ? 'Reversed' : 'Upright'}
                            </span>
                          </div>

                          <p className="text-sm font-semibold italic text-purple-950 bg-purple-100/70 p-2.5 rounded-xl border border-purple-200">
                            &quot;{card.tagline}&quot;
                          </p>

                          {/* Card Meaning */}
                          <p className="text-sm text-slate-800 font-medium leading-relaxed">
                            {meaning}
                          </p>

                          {/* Keywords */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {keywords.map(kw => (
                              <span 
                                key={kw}
                                className="px-2 py-0.5 rounded-md bg-white border border-slate-900 text-[11px] font-bold text-slate-800"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>

                          {/* Advice & Affirmation */}
                          <div className="mt-2 pt-2 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="bg-white p-2.5 rounded-xl border border-slate-900">
                              <span className="font-black text-slate-900 block mb-0.5">Actionable Advice:</span>
                              <span className="text-slate-700 font-medium">{card.advice}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-slate-900">
                              <span className="font-black text-slate-900 block mb-0.5">Affirmation:</span>
                              <span className="text-purple-900 font-bold">{card.affirmation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Synthesis & Story Card */}
                <div className="p-4 md:p-5 rounded-2xl bg-purple-900 text-white border-3 border-slate-900 shadow-[0_6px_0_0_#0f172a]">
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-5 h-5 text-amber-300" />
                    <h4 className="text-lg font-display font-black text-amber-300 uppercase tracking-wider">
                      How The Cards Talk To Each Other
                    </h4>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-purple-50">
                    {generateSynthesis()}
                  </p>
                </div>
              </div>

              {/* SUMMARY & EMAIL SENDING SECTION */}
              <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-purple-700" />
                  <h3 className="text-xl md:text-2xl font-display font-black text-slate-950">
                    Email Reading Summary
                  </h3>
                </div>

                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Send this full reading report, along with card insights and affirmations from the Dark Forest Guide, directly to your email inbox:
                </p>

                {/* Email Input Field */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="tarot-email-input"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="Enter your email (e.g. user@example.com)..."
                      className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border-2 border-slate-900 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <button
                    id="send-tarot-email-btn"
                    onClick={handleSendEmail}
                    className="h-12 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 border-2 border-slate-900 text-white font-display font-black text-sm shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send to Email</span>
                  </button>
                </div>

                {/* Copy Formatted Text Option */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    id="copy-reading-text-btn"
                    onClick={handleCopyReading}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-800 font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700 font-black">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600" />
                        <span>Copy Formatted Reading Text</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-slate-500 font-semibold">
                    Works offline & on road trips
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Card Picker Modal */}
      {activeSlotIndex !== null && (
        <TarotCardPicker
          isOpen={activeSlotIndex !== null}
          positionTitle={slots[activeSlotIndex].positionName}
          positionJob={slots[activeSlotIndex].positionJob}
          currentCard={slots[activeSlotIndex].card}
          currentIsReversed={slots[activeSlotIndex].isReversed}
          onSelect={handleAssignCard}
          onClose={() => setActiveSlotIndex(null)}
        />
      )}
    </div>
  );
};
