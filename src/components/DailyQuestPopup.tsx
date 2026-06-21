import React, { useState, useEffect } from 'react';
import { DailyQuest } from '../types';

interface DailyQuestPopupProps {
  quest: DailyQuest;
  onDismiss: () => void;
}

const DailyQuestPopup: React.FC<DailyQuestPopupProps> = ({ quest, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setVisible(true);
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const handleDismiss = () => {
    setAnimateIn(false);
    setTimeout(() => onDismiss(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'bg-night/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`glass rounded-3xl p-6 md:p-8 max-w-md w-full border-2 border-gold/50 shadow-2xl transform transition-all duration-300 ${
          animateIn ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4 animate-float">{quest.emoji}</div>
          <h2 className="font-display font-bold text-2xl text-gold gold-glow mb-2">
            {quest.title}
          </h2>
          <p className="text-cream/70 text-sm">{quest.description}</p>
        </div>

        {/* Rewards */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="glass rounded-xl p-3 text-center min-w-[80px]">
            <div className="text-2xl animate-float">🪙</div>
            <div className="text-gold font-bold text-lg">+{quest.reward}</div>
          </div>
          <div className="glass rounded-xl p-3 text-center min-w-[80px]">
            <div className="text-2xl animate-float">⚡</div>
            <div className="text-turquoise font-bold text-lg">+{quest.xpReward}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-cream/50">Progress</span>
            <span className="text-cream">{quest.progress}/{quest.target}</span>
          </div>
          <div className="h-3 bg-night-lighter rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold via-yellow-400 to-gold rounded-full transition-all duration-500 shimmer"
              style={{ width: `${(quest.progress / quest.target) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDismiss}
          className="w-full py-3 bg-gradient-to-r from-gold to-yellow-400 text-night font-bold text-lg rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <span>⚔️</span>
          Begin Your Quest
        </button>

        {/* Skip Link */}
        <button
          onClick={handleDismiss}
          className="w-full text-center mt-4 text-cream/40 text-xs cursor-pointer hover:text-cream/60"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default DailyQuestPopup;
