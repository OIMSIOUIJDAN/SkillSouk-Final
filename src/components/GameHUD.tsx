import React, { useEffect, useRef, useState } from 'react';
import { UserState } from '../types';
import { useSoundContext } from '../contexts/SoundContext';

interface GameHUDProps {
  user: UserState;
  compact?: boolean;
}

function usePopOnIncrease(value: number): string {
  const prev = useRef(value);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (value > prev.current) {
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 600);
      prev.current = value;
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value]);

  return popping ? 'animate-stat-pop' : '';
}

const GameHUD: React.FC<GameHUDProps> = ({ user, compact = false }) => {
  const { enabled, toggle, playCoin, playLevelUp } = useSoundContext();
  const xpPercentage = Math.min((user.xp / user.xpToNextLevel) * 100, 100);
  const prevCoins = useRef(user.coins);
  const prevLevel = useRef(user.level);

  const coinsAnim  = usePopOnIncrease(user.coins);
  const xpAnim     = usePopOnIncrease(user.xp);
  const streakAnim = usePopOnIncrease(user.streak);

  // Play coin sound when coins increase
  useEffect(() => {
    if (user.coins > prevCoins.current) {
      playCoin();
    }
    prevCoins.current = user.coins;
  }, [user.coins, playCoin]);

  // Play level up sound when level increases
  useEffect(() => {
    if (user.level > prevLevel.current) {
      playLevelUp();
    }
    prevLevel.current = user.level;
  }, [user.level, playLevelUp]);

  return (
    <div className={`${compact ? 'py-2 px-4' : 'py-3 px-4 md:px-6'} glass-dark rounded-2xl border border-gold/30`}>
      <div className="flex items-center justify-between gap-2 md:gap-6 flex-wrap">

        {/* User Info */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-2xl md:text-3xl">{user.avatar}</div>
          <div>
            <div className="font-display font-bold text-cream text-sm md:text-base">{user.name}</div>
            <div className={`text-gold text-xs md:text-sm font-semibold ${xpAnim}`}>
              Level {user.level}
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="flex-1 min-w-[120px] md:min-w-[200px] max-w-[300px]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-turquoise font-semibold">XP</span>
            <span className={`text-cream/70 ${xpAnim}`}>{user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()}</span>
          </div>
          <div className="h-2 md:h-3 bg-night-lighter/50 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-turquoise via-teal-400 to-turquoise rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${xpPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]" />
            </div>
          </div>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1 md:gap-2 bg-gold/10 px-3 md:px-4 py-1 md:py-2 rounded-full border border-gold/30">
          <span className="text-lg md:text-xl animate-float">🪙</span>
          <span className={`text-gold font-bold text-sm md:text-lg inline-block ${coinsAnim}`}>
            {user.coins.toLocaleString()}
          </span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 md:gap-2 bg-terracotta/10 px-3 md:px-4 py-1 md:py-2 rounded-full border border-terracotta/30">
          <span className={`text-lg md:text-xl inline-block ${streakAnim}`}>
            {user.streak > 0 ? '🔥' : '❄️'}
          </span>
          <span className={`text-terracotta font-bold text-sm md:text-lg inline-block ${streakAnim}`}>
            {user.streak}
          </span>
          <span className="text-cream/50 text-xs hidden md:inline">day streak</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggle}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            enabled
              ? 'glass border border-gold/30 text-gold hover:bg-gold/10'
              : 'glass border border-white/10 text-cream/40 hover:text-cream/60'
          }`}
          title={enabled ? 'Sound On (click to mute)' : 'Sound Off (click to unmute)'}
        >
          {enabled ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
};

export default GameHUD;
