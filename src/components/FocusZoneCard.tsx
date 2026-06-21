import React from 'react';
import { FocusZone } from '../types';

interface FocusZoneCardProps {
  zone: FocusZone;
  onClick: () => void;
}

const FocusZoneCard: React.FC<FocusZoneCardProps> = ({ zone, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`glass rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group border-2 border-white/10 hover:border-gold/50 bg-gradient-to-br ${zone.bgGradient}`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/10 group-hover:to-transparent transition-all duration-500" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Emoji */}
        <div className="text-4xl mb-3 group-hover:animate-float">
          {zone.emoji}
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-cream text-lg mb-2 group-hover:text-gold transition-colors">
          {zone.name}
        </h3>

        {/* Description */}
        <p className="text-cream/60 text-sm mb-4">
          {zone.description}
        </p>

        {/* Enter Button */}
        <div className="flex items-center gap-2 text-turquoise group-hover:text-gold transition-colors text-sm">
          <span>Enter Zone</span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 group-hover:opacity-15 transition-opacity">
        {zone.emoji}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-2 right-2 text-gold/0 group-hover:text-gold/40 transition-all text-xs">
        ✧
      </div>
    </button>
  );
};

export default FocusZoneCard;
