import React, { useEffect, useRef, useState } from 'react';

interface SoukCompanionProps {
  level: number;
  happiness: number;
  coins: number;
}

type Stage = 'egg' | 'baby' | 'adult';

function getStage(level: number): Stage {
  if (level >= 16) return 'adult';
  if (level >= 6) return 'baby';
  return 'egg';
}

const STAGES: Record<Stage, { emoji: string; name: string; color: string; hint: string }> = {
  egg:   { emoji: '🥚', name: 'Souk Egg',    color: 'text-cream',       hint: 'Reach Level 6 to hatch!' },
  baby:  { emoji: '🦊', name: 'Desert Fox',  color: 'text-terracotta',  hint: 'Evolves at Level 16' },
  adult: { emoji: '🦅', name: 'Souk Eagle',  color: 'text-gold',        hint: 'Fully evolved!' },
};

const SoukCompanion: React.FC<SoukCompanionProps> = ({ level, happiness, coins }) => {
  const prevCoins = useRef(coins);
  const [bouncing, setBouncing] = useState(false);
  const [particles, setParticles] = useState<{ id: number; emoji: string; tx: number }[]>([]);

  useEffect(() => {
    if (coins > prevCoins.current) {
      setBouncing(true);
      const pts = ['🪙', '✨', '⭐'].map((emoji, i) => ({
        id: Date.now() + i,
        emoji,
        tx: (i - 1) * 28,
      }));
      setParticles(pts);
      const t = setTimeout(() => { setBouncing(false); setParticles([]); }, 1000);
      prevCoins.current = coins;
      return () => clearTimeout(t);
    }
    prevCoins.current = coins;
  }, [coins]);

  const stage = getStage(level);
  const cfg = STAGES[stage];

  const happinessGradient =
    happiness >= 70 ? 'from-emerald-400 to-green-500' :
    happiness >= 40 ? 'from-gold to-yellow-400' :
                      'from-terracotta to-red-400';

  const mood =
    happiness >= 80 ? '😄 Thriving!' :
    happiness >= 60 ? '😊 Happy' :
    happiness >= 40 ? '😐 Needs care' :
                      '😢 Unhappy';

  return (
    <div className="glass rounded-2xl p-4 border border-gold/20 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,204,143,0.07)_0%,transparent_65%)] pointer-events-none" />

      {/* Pet */}
      <div className="relative mb-2">
        <div
          className={`text-5xl inline-block ${bouncing ? 'animate-companion-bounce' : 'animate-float'}`}
          style={{ willChange: 'transform' }}
        >
          {cfg.emoji}
        </div>
        {/* Coin particles */}
        {particles.map(p => (
          <span
            key={p.id}
            className="absolute top-0 left-1/2 text-sm pointer-events-none animate-particle-up"
            style={{ '--tx': `${p.tx}px` } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Name */}
      <div className={`font-display font-bold text-sm ${cfg.color} leading-tight`}>{cfg.name}</div>
      <div className="text-cream/35 text-[10px] mb-3">{cfg.hint}</div>

      {/* Happiness */}
      <div className="w-full">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-cream/50">Happiness</span>
          <span className="text-cream/60">{happiness}%</span>
        </div>
        <div className="h-2 bg-night-lighter rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full bg-gradient-to-r ${happinessGradient} rounded-full transition-all duration-700`}
            style={{ width: `${happiness}%` }}
          />
        </div>
      </div>

      <div className="text-[11px] text-cream/40 mt-2">{mood}</div>
    </div>
  );
};

export default SoukCompanion;
