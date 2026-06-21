import React, { useState } from 'react';

interface Caravan {
  id: string;
  name: string;
  emoji: string;
  members: number;
  maxMembers: number;
  totalXP: number;
  weeklyHours: number;
  weeklyTarget: number;
  description: string;
  joined: boolean;
  banner: string;
}

const BASE_CARAVANS: Caravan[] = [
  {
    id: 'midnight',
    name: 'The Midnight Scholars',
    emoji: '🌙',
    members: 4,
    maxMembers: 5,
    totalXP: 48500,
    weeklyHours: 35,
    weeklyTarget: 50,
    description: 'We study when the world sleeps. Focus, silence, and mastery.',
    joined: false,
    banner: 'linear-gradient(135deg, #0f0035, #1a0a4e)',
  },
  {
    id: 'code',
    name: 'Code Warriors',
    emoji: '⚔️',
    members: 3,
    maxMembers: 5,
    totalXP: 32100,
    weeklyHours: 22,
    weeklyTarget: 40,
    description: 'Algorithms, data structures, and digital conquest await.',
    joined: false,
    banner: 'linear-gradient(135deg, #300008, #4a0012)',
  },
  {
    id: 'focus',
    name: 'The Focus Guild',
    emoji: '🎯',
    members: 5,
    maxMembers: 5,
    totalXP: 61800,
    weeklyHours: 48,
    weeklyTarget: 50,
    description: 'Deep work champions. Pomodoro masters. No distractions.',
    joined: false,
    banner: 'linear-gradient(135deg, #001a10, #002a18)',
  },
];

const CaravanBoard: React.FC = () => {
  const [caravans, setCaravans] = useState<Caravan[]>(BASE_CARAVANS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleJoin = (id: string) => {
    setCaravans(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const joining = !c.joined;
        if (joining) showToast(`Joined "${c.name}"! 🎉`);
        else showToast(`Left "${c.name}"`);
        return {
          ...c,
          joined: joining,
          members: joining ? Math.min(c.members + 1, c.maxMembers) : Math.max(c.members - 1, 0),
        };
      })
    );
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const created: Caravan = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      emoji: '🏕️',
      members: 1,
      maxMembers: 5,
      totalXP: 0,
      weeklyHours: 0,
      weeklyTarget: 50,
      description: 'A new caravan forged in the souk.',
      joined: true,
      banner: 'linear-gradient(135deg, #1a1000, #2a1800)',
    };
    setCaravans(prev => [...prev, created]);
    setShowCreate(false);
    setNewName('');
    showToast(`"${created.name}" founded! 🏕️`);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/zellige-bg.jpg')", backgroundPositionY: '60%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/15 via-night/55 to-night" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-gold gold-glow drop-shadow-2xl">
            🏕️ Knowledge Caravans
          </h1>
          <p className="text-cream/55 text-sm mt-1">Guild halls of the Souk's greatest scholars</p>
        </div>
      </div>

      {/* Create button */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-full font-bold text-night hover:scale-105 transition-transform flex items-center gap-2 text-sm shadow-lg"
          style={{ background: 'linear-gradient(135deg, #F2CC8F, #f59e0b)' }}
        >
          🏕️ Found a Caravan
        </button>
      </div>

      {/* Guild board */}
      <div
        className="rounded-3xl p-4 md:p-6 border border-gold/15"
        style={{ background: 'linear-gradient(135deg, rgba(16,10,2,0.85) 0%, rgba(24,16,4,0.9) 100%)' }}
      >
        {/* Board title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gold/15" />
          <span className="text-gold/50 text-xs tracking-widest uppercase font-semibold">Active Caravans</span>
          <div className="h-px flex-1 bg-gold/15" />
        </div>

        <div className="space-y-4">
          {caravans.map((c, i) => {
            const pct = Math.min((c.weeklyHours / c.weeklyTarget) * 100, 100);
            const full = c.members >= c.maxMembers && !c.joined;
            return (
              <div
                key={c.id}
                className="rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/25 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Colour banner strip */}
                <div className="relative h-14 flex items-center px-5 gap-3" style={{ background: c.banner }}>
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-cream leading-none">{c.name}</h3>
                      {c.joined && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-gold/25 text-gold border border-gold/30 rounded-full uppercase tracking-wide">
                          Member
                        </span>
                      )}
                    </div>
                    <p className="text-cream/45 text-xs">{c.description}</p>
                  </div>
                  {/* Top-right join button */}
                  <button
                    onClick={() => toggleJoin(c.id)}
                    disabled={full}
                    className={`ml-auto flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      c.joined
                        ? 'bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30'
                        : full
                        ? 'bg-white/5 text-white/25 border border-white/10 cursor-not-allowed'
                        : 'text-white hover:scale-105'
                    }`}
                    style={
                      !c.joined && !full
                        ? { background: 'linear-gradient(135deg,#3D84A8,#22d3ee)' }
                        : undefined
                    }
                  >
                    {c.joined ? 'Leave' : full ? 'Full' : 'Join Caravan'}
                  </button>
                </div>

                {/* Stats */}
                <div
                  className="px-5 py-4"
                  style={{ background: 'rgba(10,6,2,0.7)' }}
                >
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Members', value: `${c.members}/${c.maxMembers}`, color: 'text-gold' },
                      { label: 'Guild XP', value: c.totalXP.toLocaleString(), color: 'text-turquoise' },
                      { label: 'Weekly', value: `${c.weeklyHours}/${c.weeklyTarget}h`, color: 'text-terracotta' },
                    ].map(stat => (
                      <div key={stat.label} className="text-center glass rounded-xl p-2 border border-white/5">
                        <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-cream/35 text-[10px]">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Goal progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cream/35">Weekly Study Goal</span>
                      <span className="text-gold/70">{Math.round(pct)}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden border border-white/5" style={{ background: 'rgba(26,26,46,0.5)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background:
                            pct >= 80
                              ? 'linear-gradient(90deg,#10b981,#34d399)'
                              : pct >= 50
                              ? 'linear-gradient(90deg,#F2CC8F,#fbbf24)'
                              : 'linear-gradient(90deg,#E07A5F,#f97316)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 backdrop-blur-sm p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="glass-dark rounded-3xl p-8 max-w-sm w-full border-2 border-gold/40 text-center screen-enter"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-5xl mb-4 animate-float">🏕️</div>
            <h2 className="font-display font-bold text-2xl text-gold mb-5">Found a Caravan</h2>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 bg-white/5 border border-gold/20 focus:border-gold focus:outline-none text-cream text-center mb-5 placeholder-cream/30"
              placeholder="Name your caravan…"
              maxLength={30}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3 glass rounded-full text-cream/55 hover:text-cream border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className={`flex-1 py-3 rounded-full font-bold transition-all ${
                  newName.trim()
                    ? 'text-night hover:scale-105'
                    : 'bg-white/10 text-white/35 cursor-not-allowed'
                }`}
                style={newName.trim() ? { background: 'linear-gradient(135deg,#F2CC8F,#f59e0b)' } : undefined}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up pointer-events-none">
          <div className="glass-dark rounded-xl px-6 py-4 border border-gold/45 shadow-2xl">
            <p className="text-cream font-semibold text-center">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaravanBoard;
