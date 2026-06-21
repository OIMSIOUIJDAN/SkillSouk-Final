import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { useSoundContext } from '../contexts/SoundContext';
import { QUIZ_LEADERBOARD, CURRENT_USER_QUIZ_RANK } from '../data/quizLeaderboard';
import { CLASS_RANK, getTitle } from '../data/classRank';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

type Tab = 'focus' | 'scholar' | 'class';

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  const { playClick } = useSoundContext();

  const topThree = entries.slice(0, 3);
  const topScholars = QUIZ_LEADERBOARD;

  const handleTabChange = (tab: Tab) => {
    playClick();
    setActiveTab(tab);
  };

  const rankStyles: { [key: number]: string } = {
    1: 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
    2: 'border-gray-300 shadow-[0_0_15px_rgba(156,163,175,0.3)]',
    3: 'border-amber-600 shadow-[0_0_12px_rgba(180,83,9,0.3)]',
  };

  const rankBgStyles: { [key: number]: string } = {
    1: 'from-yellow-500 to-yellow-300',
    2: 'from-gray-400 to-gray-300',
    3: 'from-amber-700 to-amber-500',
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-6 border border-gold/25">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 glass rounded-lg flex-wrap">
        {[
          { key: 'focus', label: '🔥 Focus Champions', tab: 'focus' as Tab },
          { key: 'scholar', label: '🧠 Top Scholars', tab: 'scholar' as Tab },
          { key: 'class', label: '🎓 Class Rank', tab: 'class' as Tab },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.tab)}
            className={`py-2 px-2 rounded-md text-xs font-bold transition-all ${
              activeTab === t.tab
                ? 'bg-gradient-to-r from-gold/30 to-gold/20 text-gold border border-gold/30'
                : 'text-cream/50 hover:text-cream hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── FOCUS CHAMPIONS TAB ── */}
      {activeTab === 'focus' && (
        <div className="space-y-3">
          {topThree.map((entry, index) => (
            <div
              key={entry.id}
              className={`glass-dark rounded-xl p-3 flex items-center gap-3 transition-all hover:scale-[1.02] border ${
                rankStyles[index + 1] || 'border-white/10'
              } ${index === 0 ? 'relative' : ''}`}
            >
              {/* Crown for #1 */}
              {index === 0 && (
                <div className="absolute -top-3 left-2 text-lg">👑</div>
              )}

              {/* Rank badge */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankBgStyles[index + 1] || 'from-gray-500 to-gray-400'} flex items-center justify-center font-bold text-night flex-shrink-0`}>
                {index + 1}
              </div>

              {/* Avatar */}
              <div className="text-2xl flex-shrink-0">{entry.avatar}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-cream text-sm truncate">{entry.name}</span>
                  {entry.role === 'merchant' && (
                    <span className="text-xs bg-terracotta/20 text-terracotta px-2 py-0.5 rounded-full">Merchant</span>
                  )}
                </div>
                <div className="text-cream/50 text-xs">Level {entry.level}</div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-sm">🪙</span>
                  <span className="text-gold font-bold text-sm">{entry.coins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-xs">{entry.streak > 0 ? '🔥' : '❄️'}</span>
                  <span className="text-cream/50 text-xs">{entry.streak}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TOP SCHOLARS TAB ── */}
      {activeTab === 'scholar' && (
        <div>
          <div className="space-y-3 mb-4">
            {topScholars.map((entry, index) => (
              <div
                key={entry.id}
                className={`glass-dark rounded-xl p-3 flex items-center gap-3 transition-all hover:scale-[1.02] border ${
                  rankStyles[index + 1] || 'border-white/10'
                } ${index === 0 ? 'relative' : ''}`}
              >
                {/* Crown for #1 */}
                {index === 0 && (
                  <div className="absolute -top-3 left-2 text-lg animate-float">👑</div>
                )}

                {/* Rank badge */}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankBgStyles[index + 1] || 'from-gray-500 to-gray-400'} flex items-center justify-center font-bold text-night flex-shrink-0`}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="text-2xl flex-shrink-0">{entry.avatar}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-cream text-sm truncate">{entry.name}</div>
                  <div className="text-cream/50 text-xs">Level {entry.level}</div>
                </div>

                {/* Quiz stats */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-sm">🧠</span>
                    <span className="text-turquoise font-bold text-sm">{entry.accuracy}%</span>
                  </div>
                  <div className="text-cream/50 text-xs">{entry.quizzesPassed} quizzes passed</div>
                </div>
              </div>
            ))}
          </div>

          {/* Current user rank */}
          <div className="glass rounded-xl p-3 border border-turquoise/20 text-center">
            <div className="text-cream/60 text-xs mb-1">Your Rank</div>
            <div className="text-2xl font-bold text-gold">#{CURRENT_USER_QUIZ_RANK.rank}</div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="text-xs text-cream/50">
                <span className="text-turquoise font-semibold">{CURRENT_USER_QUIZ_RANK.accuracy}%</span> accuracy
              </div>
              <div className="text-xs text-cream/50">
                <span className="text-gold font-semibold">{CURRENT_USER_QUIZ_RANK.quizzesPassed}</span> quizzes
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CLASS RANK TAB ── */}
      {activeTab === 'class' && (
        <div className="space-y-3">
          {CLASS_RANK.map((entry, index) => (
            <div
              key={entry.id}
              className={`glass-dark rounded-xl p-3 flex items-center gap-3 transition-all hover:scale-[1.02] border ${
                rankStyles[index + 1] || 'border-white/10'
              } ${index === 0 ? 'relative' : ''}`}
            >
              {index === 0 && <div className="absolute -top-3 left-2 text-lg animate-float">👑</div>}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankBgStyles[index + 1] || 'from-gray-500 to-gray-400'} flex items-center justify-center font-bold text-night flex-shrink-0`}>
                {index + 1}
              </div>
              <div className="text-2xl flex-shrink-0">{entry.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-cream text-sm truncate">{entry.name}</div>
                <div className="text-cream/50 text-xs">{getTitle(entry.averageGrade)}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-turquoise font-bold text-sm">{entry.averageGrade}%</div>
                <div className="text-cream/40 text-xs">Avg Grade</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Full Button */}
      <button className="w-full mt-4 py-2 text-center text-turquoise text-sm hover:text-gold transition-colors">
        View Full Leaderboard →
      </button>
    </div>
  );
};

export default Leaderboard;
