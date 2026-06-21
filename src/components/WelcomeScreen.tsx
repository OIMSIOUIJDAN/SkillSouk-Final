import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [visible, setVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setShowContent(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    /* The zellige-bg fixed element from App.tsx is the photo layer.
       We only add overlays on top here. */
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Additional welcome-specific vignette — makes it darker/dreamier than other screens */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(26,26,46,0.55)_0%,rgba(13,13,31,0.82)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,13,31,0.60)] via-transparent to-[rgba(13,13,31,0.70)] pointer-events-none" />

      {/* Floating ambient lanterns */}
      <div className="absolute top-12 left-10 text-3xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: '0s' }}>🏮</div>
      <div className="absolute top-12 right-10 text-3xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: '1.8s' }}>🏮</div>
      <div className="absolute bottom-16 left-8 text-2xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: '3s' }}>🪙</div>
      <div className="absolute bottom-16 right-8 text-2xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: '1.2s' }}>✨</div>

      {/* ── Main content card ── */}
      <div className={`relative z-10 flex flex-col items-center px-4 w-full max-w-xl transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Zellige photo accent band above card */}
        <div className="zellige-strip w-72 md:w-[420px] h-4 rounded-t-xl" />

        {/* Glassmorphism card */}
        <div className="glass-dark border-2 border-gold/35 rounded-b-3xl px-8 md:px-14 py-10 flex flex-col items-center text-center shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(242,204,143,0.08)] w-full backdrop-blur-2xl">

          {/* Top rule */}
          <div className="flex items-center gap-3 w-full mb-7">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
            <span className="text-gold/70 text-sm tracking-widest">✦ ✦ ✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
          </div>

          {/* Logo */}
          <div className="text-6xl md:text-7xl mb-5 animate-float filter drop-shadow-[0_0_28px_rgba(242,204,143,0.50)]">
            🏺
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-5xl md:text-6xl text-gold gold-glow mb-3 tracking-wide">
            SkillSouk
          </h1>

          {/* Tagline */}
          <p className="text-cream/75 text-lg md:text-xl italic mb-2">
            Where Knowledge is Traded Like Gold
          </p>
          <p className="text-cream/40 text-xs tracking-widest uppercase mb-8">
            Learn &nbsp;·&nbsp; Explore &nbsp;·&nbsp; Succeed
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { icon: '📚', label: 'Academic Districts' },
              { icon: '🧘', label: 'Focus Zones' },
              { icon: '🎯', label: 'Daily Quests' },
              { icon: '🪙', label: 'Earn Rewards' },
            ].map(f => (
              <div key={f.label} className="glass rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10 hover:border-gold/30 transition-colors">
                <span className="text-sm">{f.icon}</span>
                <span className="text-cream/60 text-xs font-semibold">{f.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onEnter}
            className="group relative px-12 md:px-16 py-4 bg-gradient-to-r from-terracotta via-gold to-terracotta bg-[length:200%_100%] text-night font-display font-bold text-xl md:text-2xl rounded-full overflow-hidden transition-all duration-300 hover:scale-105 animate-pulse-glow shadow-lg shadow-gold/30 hover:shadow-gold/50"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>🚪</span>
              Enter the Souk
              <span>✨</span>
            </span>
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          {/* Bottom rule */}
          <div className="flex items-center gap-3 w-full mt-7">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-gold/35" />
            <span className="text-gold/35 text-lg">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/25 to-gold/35" />
          </div>
        </div>

        {/* Zellige photo accent band below card */}
        <div className="zellige-strip w-72 md:w-[420px] h-4 rounded-b-xl" />
      </div>
    </div>
  );
};

export default WelcomeScreen;
