import React, { useState } from 'react';
import { useSoundContext } from '../contexts/SoundContext';

interface MysteryLanternProps {
  onClaim: (coins: number, reason: string) => void;
}

const REWARDS = [
  { title: 'Golden Turban', desc: 'Rare Avatar Item — granted to worthy scholars', emoji: '👑', coins: 0 },
  { title: '100 Souk Coins', desc: 'The lantern was generous tonight!', emoji: '🪙', coins: 100 },
  { title: 'Sapphire Sash', desc: 'Legendary Avatar Item — worn by desert sages', emoji: '💎', coins: 0 },
  { title: '50 Souk Coins', desc: 'A modest but welcome reward', emoji: '💰', coins: 50 },
  { title: 'Scholar Scroll', desc: 'Ancient Avatar Item — marks the truly learned', emoji: '📜', coins: 0 },
  { title: '200 Souk Coins', desc: 'The lantern overflows with generosity!', emoji: '💫', coins: 200 },
];

type Phase = 'idle' | 'shaking' | 'exploding' | 'revealed' | 'claimed';

const MysteryLantern: React.FC<MysteryLanternProps> = ({ onClaim }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [modalOpen, setModalOpen] = useState(false);
  const [reward] = useState(() => REWARDS[Math.floor(Math.random() * REWARDS.length)]);
  const [particles, setParticles] = useState<{ id: number; emoji: string; tx: number; ty: number; delay: number }[]>([]);
  const { playLantern, playCoin } = useSoundContext();

  const handleOpen = () => {
    if (phase !== 'idle') return;
    playLantern();
    setModalOpen(true);
    setPhase('shaking');

    setTimeout(() => {
      setPhase('exploding');
      const emojis = ['✨', '🪙', '⭐', '💫', '🌟', '✦', '🎇'];
      const pts = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        tx: (Math.random() - 0.5) * 240,
        ty: -(40 + Math.random() * 160),
        delay: Math.random() * 250,
      }));
      setParticles(pts);
      setTimeout(() => setPhase('revealed'), 950);
    }, 850);
  };

  const handleClaim = () => {
    if (reward.coins > 0) {
      playCoin();
      onClaim(reward.coins, 'Mystery Lantern reward!');
    }
    setPhase('claimed');
  };

  const handleClose = () => {
    setModalOpen(false);
    if (phase !== 'claimed') setPhase('idle');
  };

  return (
    <>
      {/* Dashboard card */}
      <div className="glass rounded-2xl p-4 border border-gold/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,204,143,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-gold text-sm">Mystery Lantern</h3>
            <p className="text-cream/45 text-xs mt-0.5">
              {phase === 'claimed' ? '✅ Claimed for today' : 'Tap to reveal a secret reward'}
            </p>
          </div>
          <button
            onClick={handleOpen}
            disabled={phase !== 'idle'}
            className={`text-4xl transition-all duration-200 relative focus:outline-none ${
              phase === 'idle'
                ? 'animate-lantern-glow hover:scale-125 cursor-pointer'
                : 'opacity-50 cursor-default'
            }`}
            aria-label="Open Mystery Lantern"
          >
            {phase === 'claimed' ? '🕯️' : phase === 'exploding' || phase === 'revealed' ? '💨' : '🏮'}
            {phase === 'idle' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          <div
            className="relative glass-dark rounded-3xl p-10 max-w-sm w-full border-2 border-gold/50 text-center overflow-visible shadow-2xl shadow-gold/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Explosion particles */}
            {phase === 'exploding' && particles.map(p => (
              <span
                key={p.id}
                className="absolute text-xl pointer-events-none animate-particle-burst"
                style={{
                  left: '50%',
                  top: '40%',
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  animationDelay: `${p.delay}ms`,
                } as React.CSSProperties}
              >
                {p.emoji}
              </span>
            ))}

            {/* Lantern / reward emoji */}
            <div
              className={`text-7xl mb-6 inline-block ${phase === 'shaking' ? 'animate-shake' : phase === 'revealed' || phase === 'claimed' ? 'animate-float' : ''}`}
            >
              {phase === 'revealed' || phase === 'claimed' ? reward.emoji : '🏮'}
            </div>

            {phase === 'shaking' && (
              <div>
                <p className="font-display font-bold text-2xl text-gold gold-glow animate-pulse">The lantern trembles…</p>
                <p className="text-cream/45 text-sm mt-2">Something stirs within</p>
              </div>
            )}

            {phase === 'exploding' && (
              <p className="font-display font-bold text-2xl text-gold animate-pulse">💥 It explodes!</p>
            )}

            {(phase === 'revealed' || phase === 'claimed') && (
              <div className="screen-enter">
                <p className="text-gold/60 text-xs tracking-widest uppercase mb-1">You discovered</p>
                <h2 className="font-display font-bold text-3xl text-gold gold-glow mb-1">{reward.title}</h2>
                <p className="text-cream/55 text-sm mb-6">{reward.desc}</p>

                {phase === 'revealed' ? (
                  <button
                    onClick={handleClaim}
                    className="w-full py-3 rounded-full font-bold text-lg text-night hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #F2CC8F, #f59e0b)' }}
                  >
                    ✨ Claim Reward
                  </button>
                ) : (
                  <>
                    <div className="text-green-400 font-bold text-lg mb-4 flex items-center justify-center gap-2">
                      ✅ Reward Claimed!
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-cream/40 text-sm hover:text-cream/60 transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MysteryLantern;
