import React, { useState, useEffect } from 'react';
import { UserState, District, FocusZone, DailyQuest } from '../types';
import { districts, focusZones } from '../data/districts';
import { quests } from '../data/quests';
import { leaderboard } from '../data/leaderboard';
import GameHUD from './GameHUD';
import DistrictCard from './DistrictCard';
import QuestCard from './QuestCard';
import FocusZoneCard from './FocusZoneCard';
import Leaderboard from './Leaderboard';
import SoukCompanion from './SoukCompanion';
import LiveEventsBanner from './LiveEventsBanner';
import MysteryLantern from './MysteryLantern';
import ScholarDuelModal from './ScholarDuelModal';
import CaravanBoard from './CaravanBoard';
import AIStudyForgeModal from './AIStudyForgeModal';

type Tab = 'souk' | 'caravans';

interface DashboardScreenProps {
  user: UserState;
  companionHappiness: number;
  onAddCoins: (amount: number, reason: string) => void;
  onDistrictClick: (district: District) => void;
  onFocusZoneClick: (zone: FocusZone) => void;
  onRoleChange: () => void;
  dailyQuest: DailyQuest;
}

/* Zellige photo section header */
const SectionHeader = ({ emoji, title, posY }: { emoji: string; title: string; posY: string }) => (
  <div className="relative rounded-xl overflow-hidden mb-4 h-12">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: posY }}
    />
    <div className="absolute inset-0 bg-night/68 flex items-center px-4 gap-3">
      <span className="text-2xl">{emoji}</span>
      <h2 className="font-display font-bold text-xl text-gold gold-glow">{title}</h2>
    </div>
  </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  companionHappiness,
  onAddCoins,
  onDistrictClick,
  onFocusZoneClick,
  onRoleChange,
  dailyQuest,
}) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('souk');
  const [showDuel, setShowDuel] = useState(false);
  const [showAIForge, setShowAIForge] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Zellige photo top banner */}
      <div className="relative w-full h-28 md:h-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/30 via-night/55 to-night" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(242,204,143,0.06)_0%,transparent_100%)]" />
        <div className="absolute inset-0 flex items-center justify-center pb-4">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gold gold-glow tracking-wide drop-shadow-2xl">
            🏺 Welcome Back to the Souk
          </h1>
        </div>
      </div>

      <div className="p-4 md:p-6">

        {/* Live Events banner — always visible above tabs */}
        <div className="mb-4">
          <LiveEventsBanner />
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 glass rounded-xl p-1 border border-white/10">
          {([
            { key: 'souk',     label: '🏺 Souk'     },
            { key: 'caravans', label: '🏕️ Caravans' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === t.key
                  ? 'bg-gradient-to-r from-gold/30 to-gold/20 text-gold border border-gold/30'
                  : 'text-cream/50 hover:text-cream hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── SOUK TAB ── */}
        {activeTab === 'souk' && (
          <>
            {/* GameHUD (2/3) + Companion (1/3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <GameHUD user={user} />
              </div>
              <SoukCompanion level={user.level} happiness={companionHappiness} coins={user.coins} />
            </div>

            {/* Daily quest */}
            <div className="glass rounded-xl p-3 mb-4 border border-gold/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-pulse">{dailyQuest.emoji}</span>
                <div>
                  <div className="font-bold text-gold text-sm">Daily Quest</div>
                  <div className="text-cream/65 text-xs">{dailyQuest.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-20 md:w-28 bg-night-lighter rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
                    style={{ width: `${(dailyQuest.progress / dailyQuest.target) * 100}%` }}
                  />
                </div>
                <span className="text-cream/45 text-xs">{dailyQuest.progress}/{dailyQuest.target}</span>
                <div className="flex items-center gap-1 text-xs">
                  <span>🪙</span>
                  <span className="text-gold font-bold">+{dailyQuest.reward}</span>
                </div>
              </div>
            </div>

            {/* Role badge + switch */}
            <div className="flex items-center justify-between mb-4">
              <span className="glass px-4 py-2 rounded-full text-sm border border-white/10">
                {user.role === 'merchant' ? (
                  <><span className="text-terracotta">💰</span><span className="text-terracotta font-semibold ml-1">Merchant Mode</span></>
                ) : (
                  <><span className="text-turquoise">📚</span><span className="text-turquoise font-semibold ml-1">Seeker Mode</span></>
                )}
              </span>
              <button
                onClick={onRoleChange}
                className="text-cream/55 hover:text-gold text-sm flex items-center gap-1 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">🔄</span>
                <span>Switch Role</span>
              </button>
            </div>

            {/* Achievements */}
            {user.achievements.length > 0 && (
              <div className="glass rounded-xl p-3 mb-4 flex items-center gap-4 overflow-x-auto border border-white/10">
                <span className="text-cream/45 text-sm whitespace-nowrap">Achievements:</span>
                <div className="flex items-center gap-2">
                  {user.achievements.map((badge, i) => (
                    <span
                      key={i}
                      className="text-2xl hover:scale-125 transition-transform cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${i * 0.1}s` }}
                      title={badge}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { icon: '📚', val: user.downloadsCount,      label: 'Downloads',  color: 'text-turquoise',  border: 'border-turquoise/30'  },
                { icon: '📤', val: user.uploadsCount,        label: 'Uploads',    color: 'text-terracotta', border: 'border-terracotta/30' },
                { icon: '⏱️', val: user.totalStudyMinutes,  label: 'Study Mins', color: 'text-gold',       border: 'border-gold/30'       },
                { icon: user.streak > 0 ? '🔥' : '❄️', val: user.streak, label: 'Day Streak', color: 'text-green-400', border: 'border-green-400/30' },
              ].map(s => (
                <div key={s.label} className={`glass rounded-xl p-3 text-center border ${s.border} hover:scale-[1.02] transition-transform`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-cream/45 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mystery Lantern + Scholar Duels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

              <MysteryLantern onClaim={onAddCoins} />

              {/* Scholar Duels card */}
              <button
                onClick={() => setShowDuel(true)}
                className="group relative overflow-hidden rounded-2xl border border-terracotta/40 hover:border-terracotta/70 transition-all duration-300 hover:scale-[1.02] text-left w-full"
                style={{ background: 'linear-gradient(135deg, #1a0000 0%, #2d0000 40%, #1a0008 100%)' }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta/6 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,122,95,0.12)_0%,transparent_70%)] pointer-events-none" />

                <div className="relative p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-red-400 text-xs tracking-widest uppercase font-bold mb-1">⚔️ Scholar Duels</div>
                    <h3 className="font-display font-bold text-lg text-cream group-hover:text-terracotta transition-colors">
                      Challenge a Peer
                    </h3>
                    <p className="text-cream/40 text-xs mt-0.5">Win +50 🪙 · Real-time quiz battles</p>
                  </div>
                  <div className="text-4xl flex-shrink-0 group-hover:animate-float filter drop-shadow-[0_0_12px_rgba(224,122,95,0.6)]">⚔️</div>
                </div>

                {/* Bottom bar */}
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#E07A5F,#f97316,#E07A5F)' }} />
              </button>

              {/* AI Study Forge card */}
              <button
                onClick={() => setShowAIForge(true)}
                className="group relative overflow-hidden rounded-2xl border border-violet-500/40 hover:border-violet-400/70 transition-all duration-300 hover:scale-[1.02] text-left w-full"
                style={{ background: 'linear-gradient(135deg, #0c0018 0%, #1a0030 40%, #0c0018 100%)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/6 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-violet-400 text-xs tracking-widest uppercase font-bold mb-1">✨ AI Study Forge</div>
                    <h3 className="font-display font-bold text-lg text-cream group-hover:text-violet-300 transition-colors">
                      AI-Powered Learning
                    </h3>
                    <p className="text-cream/40 text-xs mt-0.5">Upload PDF · Generate Quiz · +50 XP</p>
                  </div>
                  <div className="text-4xl flex-shrink-0 group-hover:animate-float filter drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]">🧠</div>
                </div>
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#8b5cf6,#a78bfa,#8b5cf6)' }} />
              </button>
            </div>

            {/* Focus Zones */}
            <section className="mb-8">
              <SectionHeader emoji="🧘" title="Focus Zones" posY="20%" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {focusZones.map(zone => (
                  <FocusZoneCard key={zone.id} zone={zone} onClick={() => onFocusZoneClick(zone)} />
                ))}
              </div>
            </section>

            {/* Academic Districts */}
            <section className="mb-8">
              <SectionHeader emoji="🎓" title="Academic Districts" posY="65%" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {districts.map((district, i) => (
                  <div key={district.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <DistrictCard district={district} onClick={() => onDistrictClick(district)} />
                  </div>
                ))}
              </div>
            </section>

            {/* Quests + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section>
                <h2 className="font-display font-bold text-2xl text-gold mb-4 flex items-center gap-2 gold-glow">
                  <span>⚔️</span> Active Quests
                </h2>
                <div className="space-y-3">
                  {quests.slice(0, 4).map((quest, i) => (
                    <div key={quest.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                      <QuestCard quest={quest} />
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <Leaderboard entries={leaderboard} />
              </section>
            </div>
          </>
        )}

        {/* ── CARAVANS TAB ── */}
        {activeTab === 'caravans' && <CaravanBoard />}

      </div>

      {/* Scholar Duel — full-screen overlay */}
      {showDuel && (
        <ScholarDuelModal
          user={user}
          onClose={() => setShowDuel(false)}
          onVictory={coins => onAddCoins(coins, 'Scholar Duel victory!')}
        />
      )}

      {/* AI Study Forge overlay */}
      {showAIForge && (
        <AIStudyForgeModal
          onClose={() => setShowAIForge(false)}
          onReward={_xp => { /* XP would need prop to add */ }}
        />
      )}
    </div>
  );
};

export default DashboardScreen;
