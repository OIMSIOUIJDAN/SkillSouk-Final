import React, { useState, useEffect } from 'react';

const INITIAL_SECONDS = 2 * 3600 + 14 * 60 + 30;

const LiveEventsBanner: React.FC = () => {
  const [remaining, setRemaining] = useState(INITIAL_SECONDS);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const fmt = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full relative overflow-hidden rounded-xl border border-gold/30 shadow-lg shadow-red-900/30 hover:scale-[1.01] transition-transform text-left"
        style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #1c0800 35%, #78350f 70%, #7f1d1d 100%)',
        }}
      >
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/8 to-transparent animate-shimmer bg-[length:200%_100%] pointer-events-none" />

        <div className="relative flex items-center justify-between px-4 py-2.5 gap-3 flex-wrap">
          {/* Left — LIVE dot + event text */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-red-400 font-bold text-xs tracking-widest uppercase">Live</span>
            </div>
            <div className="w-px h-4 bg-gold/25 flex-shrink-0" />
            <p className="text-gold text-sm font-semibold truncate">
              🎪 EVENT: The Midnight Exam Rush!&nbsp;
              <span className="text-yellow-300 font-bold">2× XP</span>
              &nbsp;until 2:00 AM
            </p>
          </div>

          {/* Right — countdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-cream/45 text-xs">Ends in</span>
            <span
              className="font-mono text-gold font-bold text-sm tracking-widest px-3 py-1 rounded-lg border border-gold/20"
              style={{ background: 'rgba(0,0,0,0.35)' }}
            >
              {fmt(remaining)}
            </span>
          </div>
        </div>
      </button>

      {/* Event detail modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-dark rounded-3xl p-8 max-w-lg w-full border-2 border-gold/45 shadow-2xl text-center screen-enter"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-6xl mb-4 animate-float">🎪</div>
            <h2 className="font-display font-bold text-3xl text-gold gold-glow mb-1">
              The Midnight Exam Rush!
            </h2>
            <p className="text-cream/60 text-base mb-5">
              Double XP on all knowledge purchases and focus sessions
            </p>

            {/* Live countdown */}
            <div
              className="rounded-2xl p-5 mb-6 border border-gold/25"
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              <div className="font-mono text-5xl text-gold font-bold tracking-widest">{fmt(remaining)}</div>
              <div className="text-cream/40 text-sm mt-1">remaining</div>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
              {[
                '⚡ 2× XP on uploads',
                '🧘 2× XP on focus zones',
                '🪙 Bonus quest rewards',
                '🏆 Special title unlock',
              ].map(p => (
                <div
                  key={p}
                  className="glass rounded-xl p-2.5 border border-gold/10 text-cream/65 text-left"
                >
                  {p}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-full font-bold text-lg text-night transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #F2CC8F, #f59e0b)' }}
            >
              ⚡ Start Grinding!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveEventsBanner;
