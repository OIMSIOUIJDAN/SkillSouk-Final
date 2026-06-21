import React from 'react';
import { District } from '../types';

interface MarketplaceStallProps {
  district: District;
}

const MarketplaceStall: React.FC<MarketplaceStallProps> = ({ district }) => {
  return (
    <div className="relative mb-8">
      {/* Floating Lanterns */}
      <div className="absolute -top-4 left-8 text-2xl animate-float opacity-70 z-10">🏮</div>
      <div className="absolute -top-4 right-8 text-2xl animate-float opacity-70 z-10" style={{ animationDelay: '1s' }}>🏮</div>

      {/* Main Stall Container */}
      <div className="glass rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl shadow-gold/5">

        {/* Zellige photo header banner */}
        <div className="relative w-full h-28 md:h-36 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/zellige-bg.jpg')" }}
          />
          {/* Dark gradient overlay — lighter centre lets tiles shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-night/25 via-night/45 to-night/85" />

          {/* Gold top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />

          {/* Centred label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gold/60" />
              <span className="text-gold text-lg drop-shadow-[0_0_8px_rgba(242,204,143,0.8)]">✦</span>
              <div className="h-px w-12 bg-gold/60" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-gold/40" />
              <span className="text-gold/80 text-xs tracking-widest uppercase font-semibold drop-shadow-md">Academic District</span>
              <div className="h-px w-16 bg-gold/40" />
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-night/90 to-transparent" />
        </div>

        {/* Shop Interior */}
        <div className="relative py-8 px-4 md:px-8 bg-gradient-to-br from-night-light/60 to-night/80">
          {/* Decorative elements */}
          <div className="absolute left-3 top-4 text-3xl opacity-20">📜</div>
          <div className="absolute right-3 top-4 text-3xl opacity-20">📜</div>
          <div className="absolute left-4 bottom-4 text-2xl opacity-15">🏺</div>
          <div className="absolute right-4 bottom-4 text-2xl opacity-15">🏺</div>

          {/* Main Content */}
          <div className="text-center max-w-2xl mx-auto">
            {/* Large Emoji */}
            <div className="text-6xl md:text-8xl mb-4 animate-float filter drop-shadow-lg">
              {district.emoji}
            </div>

            {/* Title with Ornamental Borders */}
            <div className="relative inline-block mb-4">
              <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-gold text-2xl select-none">❧</span>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-gold gold-glow px-8">
                {district.name}
              </h1>
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-gold text-2xl select-none">❧</span>
            </div>

            {/* Description */}
            <p className="text-cream/80 text-lg mb-6">{district.description}</p>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
              <div className="text-gold">✦</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
            </div>

            {/* District Badge */}
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 border border-gold/30">
              <span className="text-gold">🏪</span>
              <span className="text-cream/70 text-sm">District #{district.id.toUpperCase()}</span>
            </div>
          </div>

          {/* Wooden Shelf Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-amber-900/40 via-amber-800/20 to-transparent" />
        </div>

        {/* Gold bottom bar */}
        <div className="h-1 bg-gradient-to-r from-gold/40 via-gold/80 to-gold/40" />
      </div>
    </div>
  );
};

export default MarketplaceStall;
