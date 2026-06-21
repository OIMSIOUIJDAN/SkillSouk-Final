import React from 'react';
import { District } from '../types';

interface DistrictCardProps {
  district: District;
  onClick: () => void;
}

const DistrictCard: React.FC<DistrictCardProps> = ({ district, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group glass rounded-2xl p-4 md:p-6 moroccan-arch transition-all duration-300 hover:scale-105 hover:bg-white/15 cursor-pointer relative overflow-hidden gold-border hover:shadow-lg hover:shadow-gold/10"
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${district.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

      <div className="relative z-10 text-center">
        {/* Emoji */}
        <div className="text-4xl md:text-5xl mb-3 group-hover:animate-float">
          {district.emoji}
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-cream text-sm md:text-base mb-2 group-hover:text-gold transition-colors">
          {district.name}
        </h3>

        {/* Description */}
        <p className="text-cream/60 text-xs hidden md:block">
          {district.description}
        </p>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-2 left-2 text-gold/30 opacity-0 group-hover:opacity-100 transition-opacity">
        ✧
      </div>
      <div className="absolute top-2 right-2 text-gold/30 opacity-0 group-hover:opacity-100 transition-opacity">
        ✧
      </div>
    </button>
  );
};

export default DistrictCard;
