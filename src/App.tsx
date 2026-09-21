import React, { useState, useEffect } from 'react';
import { GameMode } from './types';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { LicensePlateGame } from './components/LicensePlateGame';
import { TarotGame } from './components/TarotGame';
import { playButtonTapSound } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('menu');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('roadtrip_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('roadtrip_sound_enabled', String(next));
      if (next) playButtonTapSound();
      return next;
    });
  };

  const handleSelectGame = (mode: GameMode) => {
    if (soundEnabled) playButtonTapSound();
    setCurrentMode(mode);
  };

  const handleBackToMenu = () => {
    if (soundEnabled) playButtonTapSound();
    setCurrentMode('menu');
  };

  return (
    <div className="w-full min-h-screen bg-amber-50 selection:bg-amber-300">
      {currentMode === 'menu' ? (
        <MainMenu 
          onSelectGame={handleSelectGame}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      ) : currentMode === 'license_plate' ? (
        <LicensePlateGame
          onBack={handleBackToMenu}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      ) : currentMode === 'tarot' ? (
        <TarotGame
          onBack={handleBackToMenu}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      ) : (
        <GameScreen
          mode={currentMode as 'road_trip_questions' | 'would_you_rather'}
          onBack={handleBackToMenu}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}
    </div>
  );
}



