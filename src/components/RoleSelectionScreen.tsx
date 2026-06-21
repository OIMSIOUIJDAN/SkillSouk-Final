import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
  selectedRole: UserRole;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  onContinue,
  selectedRole,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* ── Zellige photo hero header ── */}
      <div className="relative w-full h-44 md:h-52 overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '40%' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/15 via-night/50 to-night" />
        {/* Centre glow highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(242,204,143,0.06)_0%,transparent_100%)]" />

        {/* Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-px w-12 bg-gold/60" />
            <span className="text-gold text-lg drop-shadow-[0_0_8px_rgba(242,204,143,0.8)]">✦</span>
            <div className="h-px w-12 bg-gold/60" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gold gold-glow text-center px-4 drop-shadow-2xl">
            Choose Your Path
          </h2>
          <p className="text-cream/55 text-sm tracking-wider drop-shadow-md">
            in the Marketplace of Knowledge
          </p>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-cream/60 mt-6 mb-6 text-center max-w-md px-4 text-sm md:text-base">
        Select how you wish to participate — you can switch at any time
      </p>

      {/* Role Cards */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 w-full max-w-4xl px-4">

        {/* Knowledge Seeker Card */}
        <button
          onClick={() => onSelectRole('seeker')}
          className={`flex-1 glass rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer group relative text-left
            ${selectedRole === 'seeker'
              ? 'ring-4 ring-turquoise scale-[1.02] shadow-2xl shadow-turquoise/20'
              : 'hover:scale-[1.02] hover:shadow-xl'
            }`}
        >
          {/* Zellige photo header — turquoise tint */}
          <div className="relative h-20 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '10%' }}
            />
            <div className="absolute inset-0 bg-turquoise/55" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl filter drop-shadow-lg">📚</span>
            </div>
            {selectedRole === 'seeker' && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                <span className="text-turquoise text-xs font-bold">✓</span>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-6">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-turquoise mb-1">
              Knowledge Seeker
            </h3>
            <p className={`text-sm mb-4 font-semibold ${selectedRole === 'seeker' ? 'text-turquoise/70' : 'text-cream/50'}`}>
              Student
            </p>
            <p className="text-cream/80 text-sm md:text-base mb-5">
              Learn from skilled merchants, acquire new abilities, and level up your expertise through guided sessions
            </p>
            <div className="space-y-2">
              {['Browse knowledge products', 'Book learning sessions', 'Earn XP and coins'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-cream/70 text-sm">
                  <span className="text-turquoise text-xs">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {selectedRole === 'seeker' && (
              <div className="mt-5 py-2 px-4 rounded-full bg-turquoise/20 border border-turquoise/30 text-turquoise font-bold text-sm text-center animate-scale-in">
                Selected ✓
              </div>
            )}
          </div>
        </button>

        {/* Knowledge Merchant Card */}
        <button
          onClick={() => onSelectRole('merchant')}
          className={`flex-1 glass rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer group relative text-left
            ${selectedRole === 'merchant'
              ? 'ring-4 ring-terracotta scale-[1.02] shadow-2xl shadow-terracotta/20'
              : 'hover:scale-[1.02] hover:shadow-xl'
            }`}
        >
          {/* Zellige photo header — terracotta tint */}
          <div className="relative h-20 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '80%' }}
            />
            <div className="absolute inset-0 bg-terracotta/55" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl filter drop-shadow-lg">💰</span>
            </div>
            {selectedRole === 'merchant' && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                <span className="text-terracotta text-xs font-bold">✓</span>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-6">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-terracotta mb-1">
              Knowledge Merchant
            </h3>
            <p className={`text-sm mb-4 font-semibold ${selectedRole === 'merchant' ? 'text-terracotta/70' : 'text-cream/50'}`}>
              Teacher
            </p>
            <p className="text-cream/80 text-sm md:text-base mb-5">
              Share your expertise, craft knowledge products, and earn coins by guiding others on their learning journey
            </p>
            <div className="space-y-2">
              {['Create knowledge products', 'Host teaching sessions', 'Earn coins and reputation'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-cream/70 text-sm">
                  <span className="text-terracotta text-xs">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {selectedRole === 'merchant' && (
              <div className="mt-5 py-2 px-4 rounded-full bg-terracotta/20 border border-terracotta/30 text-terracotta font-bold text-sm text-center animate-scale-in">
                Selected ✓
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Hint */}
      <p className="text-cream/40 text-sm mb-6 text-center px-4">
        💡 You can switch roles anytime from the dashboard
      </p>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        disabled={!selectedRole}
        className={`px-10 py-4 bg-gradient-to-r from-gold via-cream to-gold text-night font-display font-bold text-xl rounded-full transition-all duration-300 mb-10
          ${selectedRole
            ? 'hover:scale-105 animate-pulse-glow cursor-pointer shadow-lg shadow-gold/20'
            : 'opacity-40 cursor-not-allowed'
          }`}
      >
        Continue to the Souk →
      </button>

      {/* Bottom zellige strip */}
      <div className="fixed bottom-0 left-0 right-0 h-3 zellige-strip opacity-60 pointer-events-none" />
    </div>
  );
};

export default RoleSelectionScreen;
