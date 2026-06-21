import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FocusZone, UserState } from '../types';
import GameHUD from './GameHUD';
import { Monster, MONSTERS } from '../data/monsters';
import { useSoundContext } from '../contexts/SoundContext';

interface FocusZoneScreenProps {
  zone: FocusZone;
  onBack: (studyMinutes: number) => void;
  user: UserState;
}

type BattlePhase = 'select' | 'battle' | 'victory' | 'defeat';

/* Particle position helper */
function seededPositions(n: number, seed = 1) {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    out.push((s % 100) / 100);
  }
  return out;
}

/* Generate explosion particles */
function generateExplosionParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const dist = 80 + Math.random() * 120;
    return {
      id: i,
      emoji: ['🪙', '✨', '⭐', '💫', '🌟', '✦'][i % 6],
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      delay: Math.random() * 200,
    };
  });
}

/* ─────────────────────────────────────────────────────────────
   FOCUS ZONE SCREEN — RPG Boss Battle Timer
   ───────────────────────────────────────────────────────────── */
const FocusZoneScreen: React.FC<FocusZoneScreenProps> = ({ zone, onBack, user }) => {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<BattlePhase>('select');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const { playError } = useSoundContext();

  // Battle state
  const [monsterHP, setMonsterHP] = useState(0);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalStudied, setTotalStudied] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Animation triggers
  const [showHitFlash, setShowHitFlash] = useState(false);
  const [heroAttacking, setHeroAttacking] = useState(false);
  const [monsterHit, setMonsterHit] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<{ id: number; value: number }[]>([]);
  const [explosionParticles, setExplosionParticles] = useState<{ id: number; emoji: string; tx: number; ty: number; delay: number }[]>([]);
  const [monsterSpawnAnim, setMonsterSpawnAnim] = useState(false);

  // Distraction detection
  const [distractionFlash, setDistractionFlash] = useState(false);
  const [distractionMessage, setDistractionMessage] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attackCounterRef = useRef(0);

  // Seeded particles for ambience
  const starX = useMemo(() => seededPositions(40, 13), []);
  const starY = useMemo(() => seededPositions(40, 29), []);

  useEffect(() => {
    setVisible(true);
  }, []);

  /* ── Monster Selection ── */
  const handleSelectMonster = (monster: Monster) => {
    setSelectedMonster(monster);
    setMonsterHP(monster.maxHP);
    setPlayerEnergy(100);
    setTimeLeft(monster.durationMinutes * 60);
    setPhase('battle');
    setMonsterSpawnAnim(true);
    setTimeout(() => setMonsterSpawnAnim(false), 900);
  };

  /* ── Core Battle Loop ── */
  useEffect(() => {
    if (phase !== 'battle' || isPaused || !selectedMonster) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time ran out — defeat
          clearInterval(intervalRef.current!);
          setPhase('defeat');
          return 0;
        }

        const newTime = prev - 1;
        const elapsed = selectedMonster.durationMinutes * 60 - newTime;

        // Check for attack every 60 seconds
        const attackInterval = 60;
        const currentAttack = Math.floor(elapsed / attackInterval);
        if (currentAttack > attackCounterRef.current) {
          attackCounterRef.current = currentAttack;
          triggerAttack(selectedMonster.damagePerHit);
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, isPaused, selectedMonster]);

  /* ── Trigger Attack Animation ── */
  const triggerAttack = useCallback((damage: number) => {
    // Hero dashes
    setHeroAttacking(true);

    setTimeout(() => {
      // Monster gets hit
      setMonsterHit(true);

      // Damage number
      const dmgId = Date.now();
      setDamageNumbers(prev => [...prev, { id: dmgId, value: damage }]);

      // Update HP
      setMonsterHP(prev => {
        const newHP = Math.max(0, prev - damage);

        // Check for victory
        if (newHP <= 0) {
          setTimeout(() => {
            setExplosionParticles(generateExplosionParticles(20));
            setTimeout(() => setPhase('victory'), 1100);
          }, 300);
        }

        return newHP;
      });

      // Screen hit flash
      setShowHitFlash(true);
      setTimeout(() => setShowHitFlash(false), 350);

      // Clear hit animations
      setTimeout(() => {
        setHeroAttacking(false);
        setMonsterHit(false);
      }, 600);

      // Remove damage number after animation
      setTimeout(() => {
        setDamageNumbers(prev => prev.filter(d => d.id !== dmgId));
      }, 1200);
    }, 400);
  }, []);

  /* ── Anti-Cheat: Tab Visibility ── */
  useEffect(() => {
    if (phase !== 'battle') return;

    const handleVisibility = () => {
      if (document.hidden) {
        // User switched tabs — monster attacks back!
        playError();
        setIsPaused(true);
        setPlayerEnergy(prev => Math.max(0, prev - 25));
        setDistractionFlash(true);
        setDistractionMessage('DISTRACTED! Monster attacked! -25 Energy');
        setTimeout(() => setDistractionFlash(false), 600);
        setTimeout(() => setDistractionMessage(null), 3000);
      } else {
        // User returned
        setIsPaused(false);
        setDistractionFlash(false);
        setDistractionMessage(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [phase]);

  /* ── Leave Handler ── */
  const handleLeave = () => {
    const minutesStudied = selectedMonster
      ? selectedMonster.durationMinutes - Math.ceil(timeLeft / 60)
      : 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    onBack(Math.max(0, minutesStudied));
  };

  /* ── Victory Handler ── */
  const handleVictoryClaim = () => {
    if (!selectedMonster) return;
    setTotalStudied(prev => prev + selectedMonster.durationMinutes);
    setSessionsCompleted(prev => prev + 1);
    setPhase('select');
    setSelectedMonster(null);
    setExplosionParticles([]);
  };

  /* ── Defeat Retry ── */
  const handleDefeatRetry = () => {
    if (!selectedMonster) return;
    setMonsterHP(selectedMonster.maxHP);
    setPlayerEnergy(100);
    setTimeLeft(selectedMonster.durationMinutes * 60);
    setPhase('battle');
    attackCounterRef.current = 0;
  };

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Hit flash overlay */}
      {showHitFlash && (
        <div className="fixed inset-0 z-40 pointer-events-none animate-hit-flash" />
      )}

      {/* Distraction flash overlay */}
      {distractionFlash && (
        <div
          className="fixed inset-0 z-50 pointer-events-none bg-red-500/40 animate-hit-flash flex items-center justify-center"
        >
          <div className="text-center screen-enter">
            <div className="text-5xl mb-3">😤</div>
            <div className="font-display font-bold text-3xl text-white drop-shadow-lg">DISTRACTION!</div>
            <div className="text-2xl text-red-200 mt-2">Monster attacked!</div>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="mb-4">
        <GameHUD user={user} compact />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 text-cream/60 hover:text-gold transition-colors group glass px-4 py-2 rounded-full text-sm"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          {phase === 'select' ? 'Leave Zone' : 'Retreat'}
        </button>

        <div className="text-center">
          <span className="text-2xl">{zone.emoji}</span>
          <span className="font-display font-bold text-lg ml-2 text-gold">{zone.name}</span>
        </div>

        {phase === 'battle' && (
          <button
            onClick={() => setIsPaused(p => !p)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              isPaused
                ? 'glass border border-turquoise/30 text-turquoise'
                : 'glass border border-cream/20 text-cream/60 hover:text-cream'
            }`}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
        )}

        {phase !== 'battle' && (
          <div className="flex gap-2">
            <div className="glass rounded-full px-3 py-1 text-xs text-cream/70">
              <span className="text-gold font-bold">{sessionsCompleted}</span> battles
            </div>
            <div className="glass rounded-full px-3 py-1 text-xs text-cream/70">
              <span className="text-turquoise font-bold">{totalStudied}</span> mins
            </div>
          </div>
        )}
      </div>

      {/* ── MONSTER SELECTION ── */}
      {phase === 'select' && (
        <div
          className="rounded-3xl overflow-hidden border border-terracotta/35 mb-6"
          style={{ background: 'linear-gradient(135deg, #12000a 0%, #200010 50%, #150008 100%)' }}
        >
          {/* Title */}
          <div className="p-6 text-center border-b border-gold/15">
            <h2 className="font-display font-bold text-3xl text-gold gold-glow mb-2">⚔️ Choose Your Battle</h2>
            <p className="text-cream/50 text-sm">Select a monster to challenge. Victory brings glory and loot!</p>
          </div>

          {/* Monster cards */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {MONSTERS.map((monster, i) => {
              const diffColors = {
                Easy: 'from-emerald-600 to-green-500',
                Medium: 'from-amber-600 to-yellow-500',
                Hard: 'from-red-600 to-orange-500',
              };
              return (
                <button
                  key={monster.id}
                  onClick={() => handleSelectMonster(monster)}
                  className="glass rounded-2xl p-5 text-left border border-white/10 hover:border-gold/40 transition-all duration-300 hover:scale-[1.03] group animate-scale-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`text-5xl group-hover:animate-float transition-transform ${
                        selectedMonster?.id === monster.id ? 'animate-float' : ''
                      }`}
                    >
                      {monster.emoji}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${diffColors[monster.difficulty]}`}
                    >
                      {monster.difficulty}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-cream group-hover:text-gold transition-colors">
                    {monster.name}
                  </h3>
                  <p className="text-cream/45 text-xs mt-1 mb-3">{monster.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="glass rounded-lg p-2 text-center">
                      <div className="text-terracotta font-bold">{monster.maxHP}</div>
                      <div className="text-cream/35 text-[10px]">HP</div>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <div className="text-turquoise font-bold">{monster.durationMinutes}m</div>
                      <div className="text-cream/35 text-[10px]">Time</div>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <div className="text-gold font-bold">🪙 {monster.coinReward}</div>
                      <div className="text-cream/35 text-[10px]">Reward</div>
                    </div>
                  </div>

                  {/* Start button */}
                  <div className="w-full py-2.5 rounded-full text-center font-bold text-sm text-night bg-gradient-to-r from-gold to-yellow-400 group-hover:scale-105 transition-transform">
                    ⚔️ Start Battle
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BATTLE ARENA ── */}
      {phase === 'battle' && selectedMonster && (
        <div className="relative rounded-3xl overflow-hidden border border-terracotta/35 shadow-2xl"
          style={{ background: 'linear-gradient(180deg, #08000c 0%, #150010 40%, #200018 100%)' }}>

          {/* Stars */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {starX.slice(0, 25).map((x, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-twinkle"
                style={{
                  width: i % 5 === 0 ? '2px' : '1px',
                  height: i % 5 === 0 ? '2px' : '1px',
                  left: `${x * 100}%`,
                  top: `${starY[i] * 50}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* ── MONSTER (top) ── */}
          <div className="pt-8 pb-6 text-center">
            {/* Monster emoji */}
            <div
              className={`text-7xl  md:text-8xl transition-all duration-300 ${
                monsterSpawnAnim ? 'animate-monster-spawn' : 'animate-float'
              } ${monsterHit ? 'animate-monster-hit' : ''}`}
            >
              {selectedMonster.emoji}
            </div>

            {/* Monster name */}
            <h2 className="font-display font-bold text-xl text-terracotta mt-3">{selectedMonster.name}</h2>

            {/* HP Bar */}
            <div className="max-w-xs mx-auto mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400 font-bold">HP</span>
                <span className="text-cream/70">{monsterHP} / {selectedMonster.maxHP}</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden border border-red-900/40" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500 relative"
                  style={{
                    width: `${(monsterHP / selectedMonster.maxHP) * 100}%`,
                    background: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)',
                  }}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer bg-[length:200%_100%]" />
                </div>
              </div>

              {/* Damage numbers */}
              {damageNumbers.map(d => (
                <div
                  key={d.id}
                  className="absolute left-1/2 -translate-x-1/2 font-bold text-3xl text-yellow-300 animate-damage-float pointer-events-none"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                >
                  -{d.value}
                </div>
              ))}
            </div>
          </div>

          {/* ── RUNE TIMER (center) ── */}
          <div className="flex justify-center my-4">
            <div
              className="relative rounded-full border-4 p-4 animate-rune-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(242,204,143,0.08) 0%, rgba(20,0,15,0.9) 70%)',
                borderColor: 'rgba(242,204,143,0.3)',
              }}
            >
              {/* Magical ring */}
              <div className="absolute inset-0 rounded-full border border-gold/20 animate-pulse" />
              <div className="absolute inset-2 rounded-full border border-turquoise/20" />

              {/* Time */}
              <div className="relative font-mono font-bold text-4xl md:text-5xl text-gold gold-glow tracking-widest">
                {formatTime(timeLeft)}
              </div>

              {/* Label */}
              <div className="text-center text-cream/45 text-xs mt-1">
                {isPaused ? '⏸ PAUSED' : '🔮 Time Remaining'}
              </div>
            </div>
          </div>

          {/* ── PLAYER ATTACK (animated) ── */}
          <div className="pb-8 text-center">
            {/* Hero avatar */}
            <div
              className={`text-5xl md:text-6xl transition-transform ${
                heroAttacking ? 'animate-hero-dash' : 'animate-float'
              }`}
              style={{ display: 'inline-block' }}
            >
              {user.avatar}
            </div>

            {/* Player name */}
            <div className="font-display font-bold text-sm text-turquoise mt-2">{user.name}</div>
            <div className="text-cream/45 text-xs">Lv.{user.level} Scholar</div>

            {/* Energy bar */}
            <div className="max-w-[240px] mx-auto mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-turquoise font-bold">Energy</span>
                <span className="text-cream/70">{playerEnergy}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden border border-cyan-900/40" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${playerEnergy}%`,
                    background: 'linear-gradient(90deg, #0891b2, #22d3ee)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Session info */}
          <div className="absolute top-4 right-4 glass-dark rounded-lg px-3 py-1.5 border border-turquoise/20">
            <div className="text-xs text-cream/60">
              Attacks: <span className="text-gold font-bold">{attackCounterRef.current}</span>
            </div>
          </div>

          {/* Zone indicator */}
          <div className="absolute top-4 left-4 glass-dark rounded-lg px-3 py-1.5 border border-gold/20">
            <span className="text-lg">{zone.emoji}</span>
            <span className="text-gold/85 text-xs font-semibold ml-1">{zone.name}</span>
          </div>
        </div>
      )}

      {/* ── VICTORY ── */}
      {phase === 'victory' && selectedMonster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'radial-gradient(ellipse at center, #1a0505 0%, #0a0101 100%)' }}
        >
          {/* Explosion particles */}
          {explosionParticles.map(p => (
            <span
              key={p.id}
              className="absolute left-1/2 top-1/2 text-2xl pointer-events-none animate-monster-explode"
              style={{
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                animationDelay: `${p.delay}ms`,
              } as React.CSSProperties}
            >
              {p.emoji}
            </span>
          ))}

          <div className="text-center screen-enter max-w-md w-full">
            {/* Victory title */}
            <div
              className="font-display font-black text-6xl md:text-7xl text-gold mb-2"
              style={{ textShadow: '0 0 50px rgba(242,204,143,0.9), 0 0 100px rgba(242,204,143,0.5)' }}
            >
              VICTORY!
            </div>

            {/* Monster defeated */}
            <div className="text-5xl mb-6 opacity-60">💥</div>
            <p className="text-cream/70 text-xl mb-8">{selectedMonster.name} Defeated!</p>

            {/* Loot box */}
            <div className="animate-victory-glow rounded-3xl p-8 border-2 border-gold/45 mb-8"
              style={{ background: 'linear-gradient(135deg, rgba(30,20,0,0.9), rgba(15,10,0,0.95))' }}
            >
              <div className="text-gold/50 text-xs tracking-widest uppercase mb-4">Rewards Claimed</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-5 border border-gold/20">
                  <div className="text-4xl animate-float mb-2">🪙</div>
                  <div className="text-gold font-bold text-3xl">+{selectedMonster.coinReward}</div>
                  <div className="text-cream/45 text-xs">Souk Coins</div>
                </div>
                <div className="glass rounded-xl p-5 border border-turquoise/20">
                  <div className="text-4xl animate-float mb-2" style={{ animationDelay: '0.3s' }}>⚡</div>
                  <div className="text-turquoise font-bold text-3xl">+{selectedMonster.xpReward}</div>
                  <div className="text-cream/45 text-xs">Experience</div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleVictoryClaim}
                className="flex-1 py-4 rounded-full font-bold text-xl text-night hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #F2CC8F, #f59e0b)' }}
              >
                ⚔️ Continue Fighting
              </button>
              <button
                onClick={handleLeave}
                className="px-6 py-4 glass rounded-full text-cream/50 hover:text-cream border border-white/10 transition-colors text-lg"
              >
                Retreat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEFEAT ── */}
      {phase === 'defeat' && selectedMonster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'radial-gradient(ellipse at center, #0c0000 0%, #050000 100%)' }}
        >
          <div className="text-center screen-enter max-w-md w-full">
            {/* Defeat title */}
            <div className="font-display font-black text-6xl text-terracotta mb-4"
              style={{ textShadow: '0 0 40px rgba(224,122,95,0.8)' }}
            >
              DEFEAT
            </div>

            {/* Monster still standing */}
            <div className="text-7xl mb-6 animate-float">{selectedMonster.emoji}</div>
            <p className="text-cream/55 text-lg mb-8">Time ran out! The {selectedMonster.name} remains undefeated.</p>

            {/* No rewards */}
            <div className="glass rounded-2xl p-6 border border-red-900/30 mb-8"
              style={{ background: 'rgba(30,5,5,0.8)' }}
            >
              <div className="text-2xl font-bold text-red-400 mb-2">❌ No Rewards</div>
              <div className="text-cream/40 text-sm">
                The monster had {monsterHP} HP remaining.
                <br />You needed {Math.ceil(monsterHP / selectedMonster.damagePerHit)} more attacks to win.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDefeatRetry}
                className="flex-1 py-4 rounded-full font-bold text-xl text-white hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #E07A5F, #f97316)' }}
              >
                🔄 Try Again
              </button>
              <button
                onClick={handleLeave}
                className="px-6 py-4 glass rounded-full text-cream/50 hover:text-cream border border-white/10 transition-colors text-lg"
              >
                Retreat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Distraction message toast */}
      {distractionMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up pointer-events-none">
          <div className="glass-dark rounded-xl px-6 py-4 border border-red-500/50 shadow-2xl">
            <p className="text-red-300 font-bold text-center">{distractionMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusZoneScreen;
