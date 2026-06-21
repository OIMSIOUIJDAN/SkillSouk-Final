import React, { useState, useEffect } from 'react';
import { UserState } from '../types';
import { useSoundContext } from '../contexts/SoundContext';

interface ScholarDuelModalProps {
  user: UserState;
  onClose: () => void;
  onVictory: (coins: number) => void;
}

type Phase = 'finding' | 'arena' | 'victory' | 'defeat';

const OPPONENTS = [
  { name: 'Zara Al-Rashid',  avatar: '🧕', level: 7,  tagline: 'The Quiet Strategist' },
  { name: 'Omar the Sage',   avatar: '🧙', level: 12, tagline: 'Master of Ancient Scripts' },
  { name: 'Fatima Scholar',  avatar: '🦉', level: 6,  tagline: 'Seeker of Hidden Knowledge' },
  { name: 'Ibn Battuta Jr.', avatar: '🗺️', level: 9,  tagline: 'Wanderer of the Mind' },
];

const QUESTION = {
  text: 'What is the time complexity of Binary Search?',
  answers: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
  correct: 1,
  category: 'Computer Science',
};

const ScholarDuelModal: React.FC<ScholarDuelModalProps> = ({ user, onClose, onVictory }) => {
  const [phase, setPhase] = useState<Phase>('finding');
  const [opponent] = useState(() => OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)]);
  const [selected, setSelected] = useState<number | null>(null);
  const [dots, setDots] = useState('.');
  const [playerHP, setPlayerHP] = useState(100);
  const { playCoin } = useSoundContext();
  const [opponentHP, setOpponentHP] = useState(100);

  /* Animated dots + auto-advance finding → arena */
  useEffect(() => {
    if (phase !== 'finding') return;
    const dotTimer = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500);
    const advTimer = setTimeout(() => { clearInterval(dotTimer); setPhase('arena'); }, 2800);
    return () => { clearInterval(dotTimer); clearTimeout(advTimer); };
  }, [phase]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === QUESTION.correct) {
      setOpponentHP(0);
      setTimeout(() => setPhase('victory'), 1200);
    } else {
      setPlayerHP(0);
      setTimeout(() => setPhase('defeat'), 1200);
    }
  };

  const handleRematch = () => {
    setPhase('finding');
    setSelected(null);
    setDots('.');
    setPlayerHP(100);
    setOpponentHP(100);
  };

  /* Common HP bar */
  const HPBar = ({ value, color }: { value: number; color: string }) => (
    <div className="h-3 rounded-full overflow-hidden border border-white/10" style={{ background: 'rgba(26,26,46,0.6)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      style={{ background: 'radial-gradient(ellipse at center, #100010 0%, #050005 100%)' }}
    >
      {/* ── FINDING ── */}
      {phase === 'finding' && (
        <div className="text-center screen-enter max-w-sm w-full">
          <div className="text-8xl mb-8 animate-float filter drop-shadow-[0_0_30px_rgba(224,122,95,0.6)]">⚔️</div>
          <h2 className="font-display font-bold text-4xl text-gold gold-glow mb-3">Scholar Duels</h2>
          <p className="text-cream/55 text-lg mb-10">Searching the souk for a worthy challenger{dots}</p>

          {/* Radar */}
          <div className="relative w-36 h-36 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full border-2 border-gold/15" />
            <div className="absolute inset-5 rounded-full border-2 border-gold/10" />
            <div className="absolute inset-10 rounded-full border-2 border-gold/8" />
            <div
              className="absolute inset-0 rounded-full animate-radar"
              style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(242,204,143,0.55) 25%, transparent 40%)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🔍</div>
          </div>

          <button onClick={onClose} className="text-cream/35 text-sm hover:text-cream/55 transition-colors">
            ← Leave Queue
          </button>
        </div>
      )}

      {/* ── ARENA ── */}
      {phase === 'arena' && (
        <div className="w-full max-w-2xl screen-enter">
          {/* Title */}
          <div className="text-center mb-5">
            <p className="text-gold/55 text-xs tracking-widest uppercase font-semibold mb-1">Scholar Duel</p>
            <h2 className="font-display font-bold text-3xl text-gold gold-glow">⚔️ The Knowledge Arena ⚔️</h2>
          </div>

          {/* Combatants */}
          <div className="flex items-start justify-between gap-4 mb-5">
            {/* Player */}
            <div className="flex-1 text-center">
              <div className="text-5xl animate-float mb-2">{user.avatar}</div>
              <div className="font-bold text-cream text-sm mb-0.5">{user.name}</div>
              <div className="text-gold text-xs mb-2">Lv.{user.level}</div>
              <HPBar value={playerHP} color="linear-gradient(90deg,#3D84A8,#22d3ee)" />
              <div className="text-turquoise text-xs mt-1 font-mono">{playerHP} HP</div>
            </div>

            {/* VS */}
            <div className="text-center pt-4 flex-shrink-0">
              <div
                className="font-display font-black text-4xl text-terracotta animate-pulse"
                style={{ textShadow: '0 0 25px rgba(224,122,95,0.7)' }}
              >
                VS
              </div>
              <div className="text-2xl mt-1">⚔️</div>
            </div>

            {/* Opponent */}
            <div className="flex-1 text-center">
              <div className="text-5xl animate-float mb-2" style={{ animationDelay: '1.5s' }}>{opponent.avatar}</div>
              <div className="font-bold text-cream text-sm mb-0.5">{opponent.name}</div>
              <div className="text-terracotta text-xs mb-2">Lv.{opponent.level}</div>
              <HPBar value={opponentHP} color="linear-gradient(90deg,#E07A5F,#f97316)" />
              <div className="text-terracotta text-xs mt-1 font-mono">{opponentHP} HP</div>
            </div>
          </div>

          {/* Question card */}
          <div className="glass rounded-2xl p-5 border border-gold/25 mb-4" style={{ background: 'rgba(10,5,20,0.7)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gold/55 tracking-widest uppercase font-semibold">Round 1</span>
              <div className="flex-1 h-px bg-gold/15" />
              <span className="text-cream/35 text-xs">{QUESTION.category}</span>
            </div>
            <h3 className="font-display font-bold text-xl text-cream mb-5">{QUESTION.text}</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUESTION.answers.map((answer, idx) => {
                let cls = 'rounded-xl p-4 text-left border-2 transition-all duration-300 font-semibold text-sm ';
                if (selected === null) {
                  cls += 'border-white/10 text-cream hover:border-gold/50 hover:scale-[1.02] cursor-pointer glass';
                } else if (idx === QUESTION.correct) {
                  cls += 'border-green-400 bg-green-400/15 text-green-300';
                } else if (idx === selected) {
                  cls += 'border-red-400 bg-red-400/15 text-red-300';
                } else {
                  cls += 'border-white/5 text-cream/30 cursor-default opacity-50';
                }
                return (
                  <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={selected !== null}>
                    <span className="text-gold/50 text-xs mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {answer}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={onClose} className="w-full text-cream/25 text-xs hover:text-cream/45 transition-colors py-2">
            Forfeit Duel
          </button>
        </div>
      )}

      {/* ── VICTORY ── */}
      {phase === 'victory' && (
        <div className="text-center max-w-md w-full screen-enter">
          {/* Gold aura */}
          <div className="relative inline-block mb-4">
            <div className="text-8xl animate-float filter drop-shadow-[0_0_50px_rgba(242,204,143,0.9)]">🏆</div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,204,143,0.25)_0%,transparent_70%)] pointer-events-none" />
          </div>

          <h2
            className="font-display font-black text-6xl text-gold mb-2"
            style={{ textShadow: '0 0 40px rgba(242,204,143,0.8), 0 0 80px rgba(242,204,143,0.3)' }}
          >
            VICTORY!
          </h2>
          <p className="text-cream/55 text-lg mb-6">You crushed {opponent.name}!</p>

          {/* Spoils */}
          <div
            className="rounded-2xl p-6 mb-6 border-2 border-gold/50 animate-victory"
            style={{ background: 'linear-gradient(135deg,rgba(60,40,0,0.85),rgba(20,12,0,0.95))' }}
          >
            <p className="text-gold/50 text-xs tracking-widest uppercase mb-2">Spoils of War</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl animate-float">🪙</span>
              <span className="font-display font-black text-5xl text-gold">+50</span>
            </div>
            <p className="text-gold/55 text-sm mt-1">Coins stolen from your opponent!</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { playCoin(); onVictory(50); onClose(); }}
              className="flex-1 py-3 rounded-full font-bold text-xl text-night hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #F2CC8F, #f59e0b)' }}
            >
              Claim Victory!
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 glass rounded-full text-cream/50 hover:text-cream border border-white/10 transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      )}

      {/* ── DEFEAT ── */}
      {phase === 'defeat' && (
        <div className="text-center max-w-md w-full screen-enter">
          <div className="text-8xl mb-4 opacity-55" style={{ filter: 'grayscale(0.4)' }}>💀</div>
          <h2
            className="font-display font-black text-6xl text-terracotta mb-2"
            style={{ textShadow: '0 0 35px rgba(224,122,95,0.7)' }}
          >
            DEFEAT
          </h2>
          <p className="text-cream/55 text-lg mb-6">{opponent.name} outscored you!</p>

          <div
            className="rounded-2xl p-6 mb-6 border-2 border-terracotta/40"
            style={{ background: 'linear-gradient(135deg,rgba(60,0,0,0.85),rgba(20,0,0,0.95))' }}
          >
            <p className="text-terracotta/50 text-xs tracking-widest uppercase mb-2">Result</p>
            <div className="text-2xl font-bold text-red-400 mb-1">No coins earned</div>
            <p className="text-red-400/50 text-sm">Study more and return stronger!</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRematch}
              className="flex-1 py-3 rounded-full font-bold text-xl text-white hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #E07A5F, #f97316)' }}
            >
              🔄 Rematch!
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 glass rounded-full text-cream/50 hover:text-cream border border-white/10 transition-colors"
            >
              Retreat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarDuelModal;
