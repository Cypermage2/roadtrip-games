import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Share2, 
  Bookmark, 
  Volume1, 
  RotateCw, 
  Car, 
  HelpCircle, 
  Check,
  Flame,
  ThumbsUp,
  MessageCircleQuestion
} from 'lucide-react';
import { GameMode, RoadTripQuestion, WouldYouRatherQuestion } from '../types';
import { ROAD_TRIP_QUESTIONS, ROAD_TRIP_CATEGORIES } from '../data/roadTripQuestions';
import { WOULD_YOU_RATHER_QUESTIONS } from '../data/wouldYouRatherQuestions';
import { Dice } from './Dice';
import { playDiceRollSound, playRollCompleteChime, playButtonTapSound, triggerHapticFeedback } from '../utils/audio';

interface GameScreenProps {
  mode: 'road_trip_questions' | 'would_you_rather';
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  onBack,
  soundEnabled,
  onToggleSound
}) => {
  const isWouldYouRather = mode === 'would_you_rather';

  // State
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Current items
  const [currentRoadTripQuestion, setCurrentRoadTripQuestion] = useState<RoadTripQuestion | null>(null);
  const [currentWyrQuestion, setCurrentWyrQuestion] = useState<WouldYouRatherQuestion | null>(null);

  // Would You Rather voting state
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [optionVotes, setOptionVotes] = useState<{ aPercent: number; bPercent: number } | null>(null);

  // Favorites & Copy feedback
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [rollCount, setRollCount] = useState<number>(0);

  // Questions index tracking
  const usedRtIndices = useRef<Set<number>>(new Set());
  const usedWyrIndices = useRef<Set<number>>(new Set());

  // Function to execute rolling animation & pick question
  const rollDice = () => {
    if (isRolling) return;

    if (soundEnabled) {
      playDiceRollSound();
    }
    triggerHapticFeedback([40, 60, 40]);

    setIsRolling(true);
    setSelectedOption(null);
    setOptionVotes(null);
    setIsFavorited(false);

    // Roll cycle simulation for face change
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 8) {
        clearInterval(interval);
      }
    }, 90);

    // Conclude after 900ms
    setTimeout(() => {
      clearInterval(interval);
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalRoll);
      setIsRolling(false);
      setHasRolled(true);
      setRollCount(prev => prev + 1);

      // Select new question based on mode
      if (isWouldYouRather) {
        pickNextWouldYouRather();
      } else {
        pickNextRoadTripQuestion(finalRoll);
      }

      if (soundEnabled) {
        playRollCompleteChime();
      }
      triggerHapticFeedback([80]);
    }, 950);
  };

  const pickNextRoadTripQuestion = (roll: number) => {
    // Filter questions if category is specific
    let pool = ROAD_TRIP_QUESTIONS;
    if (selectedCategory !== 'all') {
      pool = ROAD_TRIP_QUESTIONS.filter(q => q.category === selectedCategory);
    } else {
      // Prioritize questions matching the rolled dice number if available
      const rollMatched = ROAD_TRIP_QUESTIONS.filter(q => q.diceRollTrigger === roll);
      if (rollMatched.length > 0 && Math.random() > 0.25) {
        pool = rollMatched;
      }
    }

    if (pool.length === 0) pool = ROAD_TRIP_QUESTIONS;

    // Pick non-repeating if possible
    const availableIndices = pool
      .map((_, i) => i)
      .filter(i => !usedRtIndices.current.has(i));

    let chosenIndex: number;
    if (availableIndices.length === 0) {
      usedRtIndices.current.clear();
      chosenIndex = Math.floor(Math.random() * pool.length);
    } else {
      chosenIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }

    usedRtIndices.current.add(chosenIndex);
    setCurrentRoadTripQuestion(pool[chosenIndex]);
  };

  const pickNextWouldYouRather = () => {
    const pool = WOULD_YOU_RATHER_QUESTIONS;
    const availableIndices = pool
      .map((_, i) => i)
      .filter(i => !usedWyrIndices.current.has(i));

    let chosenIndex: number;
    if (availableIndices.length === 0) {
      usedWyrIndices.current.clear();
      chosenIndex = Math.floor(Math.random() * pool.length);
    } else {
      chosenIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }

    usedWyrIndices.current.add(chosenIndex);
    setCurrentWyrQuestion(pool[chosenIndex]);
  };

  // Initialize with a roll or prompt on mount
  useEffect(() => {
    // Initial random value
    setDiceValue(Math.floor(Math.random() * 6) + 1);
  }, []);

  // Vote on Would You Rather
  const handleVote = (option: 'A' | 'B') => {
    if (selectedOption) return;
    if (soundEnabled) playButtonTapSound();
    triggerHapticFeedback([30]);

    setSelectedOption(option);
    // Generate fun split
    const aPercent = option === 'A' 
      ? Math.floor(Math.random() * 25) + 55 
      : Math.floor(Math.random() * 25) + 20;
    const bPercent = 100 - aPercent;
    setOptionVotes({ aPercent, bPercent });
  };

  // Web Speech API for reading questions aloud in car
  const handleSpeakQuestion = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToSpeak = '';
    if (isWouldYouRather && currentWyrQuestion) {
      textToSpeak = `Would you rather: Option A, ${currentWyrQuestion.optionA}. Or Option B, ${currentWyrQuestion.optionB}.`;
    } else if (currentRoadTripQuestion) {
      textToSpeak = currentRoadTripQuestion.question;
    }

    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Copy question to clipboard
  const handleCopyQuestion = () => {
    let text = '';
    if (isWouldYouRather && currentWyrQuestion) {
      text = `Road Trip Would You Rather:\nA) ${currentWyrQuestion.optionA}\nOR\nB) ${currentWyrQuestion.optionB}`;
    } else if (currentRoadTripQuestion) {
      text = `Road Trip Question: "${currentRoadTripQuestion.question}"`;
    }

    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-slate-900 pb-12 select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-4 border-slate-900 px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            id="back-to-menu-btn"
            onClick={onBack}
            className="h-12 px-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center gap-1.5 font-display font-bold text-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="text-base">Games</span>
          </button>

          {/* Mode Title Badge */}
          <div className="text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-slate-900 ${
              isWouldYouRather ? 'bg-rose-400 text-slate-950' : 'bg-amber-400 text-slate-950'
            }`}>
              {isWouldYouRather ? <Flame className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
              {isWouldYouRather ? 'Would You Rather' : 'Road Trip Questions'}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a] flex items-center justify-center text-slate-900 transition-all cursor-pointer"
            aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-slate-900 stroke-[2.5]" />
            ) : (
              <VolumeX className="w-6 h-6 text-slate-400 stroke-[2.5]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Interactive Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-4 flex flex-col items-center">
        
        {/* DICE SECTION */}
        <section className="w-full flex flex-col items-center mt-2 mb-5">
          {/* Interactive 3D Dice Display */}
          <div className="relative my-2">
            <Dice 
              value={diceValue} 
              isRolling={isRolling} 
              onRoll={rollDice} 
              size="lg" 
            />
          </div>

          {/* Prominent Tactile Dice Roll Button */}
          <div className="w-full max-w-md px-2 mt-3">
            <motion.button
              id="roll-dice-action-btn"
              type="button"
              onClick={rollDice}
              disabled={isRolling}
              whileTap={{ scale: 0.96 }}
              className={`w-full py-4 px-6 rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] active:translate-y-1.5 transition-all cursor-pointer font-display text-2xl md:text-3xl font-black tracking-wide flex items-center justify-center gap-3 ${
                isRolling 
                  ? 'bg-amber-300 text-slate-800' 
                  : isWouldYouRather 
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_8px_0_0_#4c0519]' 
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_8px_0_0_#451a03]'
              }`}
            >
              {isRolling ? (
                <>
                  <RotateCw className="w-7 h-7 animate-spin" />
                  <span>ROLLING...</span>
                </>
              ) : (
                <>
                  <span>🎲</span>
                  <span>{hasRolled ? 'ROLL AGAIN!' : 'ROLL THE DICE!'}</span>
                  <span>🎲</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Roll Status / Indicator */}
          <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-600">
            {hasRolled ? (
              <span className="bg-white/80 border-2 border-slate-300 px-3 py-1 rounded-full">
                Rolled a <strong className="text-slate-950 text-base">{diceValue}</strong> • Roll #{rollCount}
              </span>
            ) : (
              <span className="bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-full text-amber-900 animate-pulse">
                Tap button or dice to start!
              </span>
            )}
          </div>
        </section>

        {/* QUESTION DISPLAY AREA */}
        <section className="w-full flex-1 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!hasRolled ? (
              /* Pre-roll Welcome Teaser Card */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_0_#0f172a] p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-3xl">
                  {isWouldYouRather ? '🤔' : '🚗'}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900">
                  {isWouldYouRather ? 'Ready to Debate?' : 'Ready to Connect?'}
                </h3>
                <p className="mt-2 text-lg text-slate-700 font-medium max-w-sm mx-auto leading-relaxed">
                  {isWouldYouRather
                    ? 'Roll the dice to summon hilarious dilemmas and tough choices for everyone in the car!'
                    : 'Roll the dice to reveal fun stories, car secrets, and bonding questions for your journey!'}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-200 text-sm font-bold text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Tap &quot;ROLL THE DICE&quot; above to draw your first card!
                </div>
              </motion.div>
            ) : isWouldYouRather && currentWyrQuestion ? (
              /* WOULD YOU RATHER QUESTION CARD */
              <motion.div
                key={currentWyrQuestion.id}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                className="w-full bg-white rounded-3xl border-4 border-slate-900 shadow-[0_10px_0_0_#0f172a] p-5 md:p-6 flex flex-col"
              >
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-slate-900 ${currentWyrQuestion.categoryColor}`}>
                    {currentWyrQuestion.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Dilemma
                  </span>
                </div>

                {/* Scenario Header */}
                <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 mb-4">
                  {currentWyrQuestion.scenario || "Would you rather..."}
                </h3>

                {/* Voting Choices (Option A vs Option B) */}
                <div className="space-y-4 my-2">
                  {/* Option A */}
                  <motion.button
                    id="wyr-option-a-btn"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVote('A')}
                    className={`relative w-full text-left p-4 md:p-5 rounded-2xl border-3 border-slate-900 transition-all cursor-pointer overflow-hidden ${
                      selectedOption === 'A'
                        ? 'bg-amber-400 text-slate-950 shadow-[0_4px_0_0_#0f172a] ring-2 ring-amber-500'
                        : selectedOption === 'B'
                          ? 'bg-slate-50 text-slate-600 opacity-80 shadow-[0_2px_0_0_#0f172a]'
                          : 'bg-amber-50 hover:bg-amber-100 text-slate-900 shadow-[0_4px_0_0_#0f172a]'
                    }`}
                  >
                    {/* Vote progress fill bar if voted */}
                    {optionVotes && (
                      <div 
                        className="absolute inset-y-0 left-0 bg-amber-300/40 pointer-events-none transition-all duration-500"
                        style={{ width: `${optionVotes.aPercent}%` }}
                      />
                    )}

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center font-display font-black text-slate-950 text-lg">
                          A
                        </span>
                        <p className="text-lg md:text-xl font-bold leading-snug">
                          {currentWyrQuestion.optionA}
                        </p>
                      </div>

                      {selectedOption === 'A' && (
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    {optionVotes && (
                      <div className="relative mt-2 text-right">
                        <span className="text-sm font-black font-display text-slate-900 bg-white/90 border border-slate-300 px-2.5 py-0.5 rounded-full">
                          {optionVotes.aPercent}% Agree!
                        </span>
                      </div>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="border-t-2 border-slate-300 w-full" />
                    <span className="absolute px-3 py-1 bg-rose-500 text-white font-display font-black text-sm uppercase rounded-full border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a]">
                      VS
                    </span>
                  </div>

                  {/* Option B */}
                  <motion.button
                    id="wyr-option-b-btn"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVote('B')}
                    className={`relative w-full text-left p-4 md:p-5 rounded-2xl border-3 border-slate-900 transition-all cursor-pointer overflow-hidden ${
                      selectedOption === 'B'
                        ? 'bg-rose-400 text-slate-950 shadow-[0_4px_0_0_#0f172a] ring-2 ring-rose-500'
                        : selectedOption === 'A'
                          ? 'bg-slate-50 text-slate-600 opacity-80 shadow-[0_2px_0_0_#0f172a]'
                          : 'bg-rose-50 hover:bg-rose-100 text-slate-900 shadow-[0_4px_0_0_#0f172a]'
                    }`}
                  >
                    {/* Vote progress fill bar if voted */}
                    {optionVotes && (
                      <div 
                        className="absolute inset-y-0 left-0 bg-rose-300/40 pointer-events-none transition-all duration-500"
                        style={{ width: `${optionVotes.bPercent}%` }}
                      />
                    )}

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-rose-300 border-2 border-slate-900 flex items-center justify-center font-display font-black text-slate-950 text-lg">
                          B
                        </span>
                        <p className="text-lg md:text-xl font-bold leading-snug">
                          {currentWyrQuestion.optionB}
                        </p>
                      </div>

                      {selectedOption === 'B' && (
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-900 text-rose-300 flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    {optionVotes && (
                      <div className="relative mt-2 text-right">
                        <span className="text-sm font-black font-display text-slate-900 bg-white/90 border border-slate-300 px-2.5 py-0.5 rounded-full">
                          {optionVotes.bPercent}% Agree!
                        </span>
                      </div>
                    )}
                  </motion.button>
                </div>

                {/* Helpful Prompt for car discussion */}
                <p className="text-center text-xs md:text-sm font-bold text-slate-500 mt-2">
                  {!selectedOption ? "Tap your choice to cast your vote & see what passengers think!" : "Now defend your choice to everyone in the car!"}
                </p>

                {/* Interactive Tool Bar */}
                <div className="mt-5 pt-4 border-t-2 border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Read Aloud Button */}
                    <button
                      id="speak-wyr-question-btn"
                      onClick={handleSpeakQuestion}
                      className={`h-11 px-3 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isSpeaking ? 'bg-amber-300 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                      title="Read question out loud"
                    >
                      <Volume1 className="w-4 h-4" />
                      <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      id="copy-wyr-question-btn"
                      onClick={handleCopyQuestion}
                      className="h-11 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 font-bold text-sm text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy question text"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      <span>{isCopied ? 'Copied!' : 'Share'}</span>
                    </button>
                  </div>

                  {/* Favorite / Star */}
                  <button
                    id="fav-wyr-question-btn"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`w-11 h-11 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 flex items-center justify-center transition-colors cursor-pointer ${
                      isFavorited ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    title="Bookmark question"
                  >
                    <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-slate-900' : ''}`} />
                  </button>
                </div>
              </motion.div>
            ) : currentRoadTripQuestion ? (
              /* ROAD TRIP QUESTION CARD */
              <motion.div
                key={currentRoadTripQuestion.id}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                className="w-full bg-white rounded-3xl border-4 border-slate-900 shadow-[0_10px_0_0_#0f172a] p-6 md:p-7 flex flex-col"
              >
                {/* Header Category & Dice Match */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-slate-900 ${currentRoadTripQuestion.categoryColor}`}>
                    {currentRoadTripQuestion.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                    <span>Dice Face {currentRoadTripQuestion.diceRollTrigger || diceValue}</span>
                  </div>
                </div>

                {/* Primary Question Prompt - BIG, BOLD, HIGH CONTRAST */}
                <div className="my-2 py-2">
                  <p className="text-2xl md:text-3xl font-display font-black leading-snug text-slate-950">
                    &ldquo;{currentRoadTripQuestion.question}&rdquo;
                  </p>
                </div>

                {/* Pro Tip / Fun prompt if available */}
                {currentRoadTripQuestion.tip && (
                  <div className="mt-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
                    <span className="text-lg">💡</span>
                    <p className="text-sm font-medium text-amber-950 leading-normal">
                      <strong>Host prompt:</strong> {currentRoadTripQuestion.tip}
                    </p>
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="mt-6 pt-4 border-t-2 border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Read Aloud Button */}
                    <button
                      id="speak-road-trip-question-btn"
                      onClick={handleSpeakQuestion}
                      className={`h-11 px-3.5 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isSpeaking ? 'bg-amber-300 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                      title="Read question out loud for driver"
                    >
                      <Volume1 className="w-4 h-4" />
                      <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                    </button>

                    {/* Copy / Share Button */}
                    <button
                      id="copy-road-trip-question-btn"
                      onClick={handleCopyQuestion}
                      className="h-11 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 font-bold text-sm text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy question text"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      <span>{isCopied ? 'Copied!' : 'Share'}</span>
                    </button>
                  </div>

                  {/* Bookmark / Favorite */}
                  <button
                    id="fav-road-trip-question-btn"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`w-11 h-11 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 flex items-center justify-center transition-colors cursor-pointer ${
                      isFavorited ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    title="Bookmark question"
                  >
                    <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-slate-900' : ''}`} />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Quick Category Filter for Road Trip Questions */}
          {!isWouldYouRather && (
            <div className="w-full mt-6">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Filter by Category (or let dice pick):
                </span>
                {selectedCategory !== 'all' && (
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs font-bold text-amber-700 underline cursor-pointer"
                  >
                    Reset to All
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                {ROAD_TRIP_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    id={`cat-filter-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id === 'all' ? 'all' : cat.name)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-slate-900 transition-all cursor-pointer whitespace-nowrap ${
                      (cat.id === 'all' && selectedCategory === 'all') || selectedCategory === cat.name
                        ? `${cat.color} shadow-[0_2px_0_0_#0f172a] scale-105`
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
