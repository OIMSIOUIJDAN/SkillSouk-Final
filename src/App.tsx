import { useState, useEffect, useCallback } from 'react';
import { Screen, UserState, District, KnowledgeProduct, FocusZone, DailyQuest } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import DashboardScreen from './components/DashboardScreen';
import DistrictScreen from './components/DistrictScreen';
import FocusZoneScreen from './components/FocusZoneScreen';
import DailyQuestPopup from './components/DailyQuestPopup';
import SoundEffects from './components/SoundEffects';
import { SoundProvider } from './contexts/SoundContext';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedFocusZone, setSelectedFocusZone] = useState<FocusZone | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showDailyQuest, setShowDailyQuest] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [companionHappiness, setCompanionHappiness] = useState(70);

  // User state with gamification
  const [user, setUser] = useState<UserState>({
    role: null,
    level: 5,
    xp: 2450,
    xpToNextLevel: 3000,
    coins: 850,
    streak: 7,
    achievements: ['🏆', '⭐', '🔥', '📚', '🎯'],
    name: 'Young Scholar',
    avatar: '🎓',
    totalStudyMinutes: 0,
    uploadsCount: 0,
    downloadsCount: 0,
  });

  // Daily quest state
  const [dailyQuest, setDailyQuest] = useState<DailyQuest>({
    id: 'daily-1',
    title: 'Daily Knowledge Quest',
    description: 'Upload 1 knowledge file today',
    reward: 50,
    xpReward: 100,
    target: 1,
    progress: 0,
    emoji: '📜',
  });

  // Play sound effect
  const playSound = useCallback((type: 'click' | 'success' | 'coin' | 'levelup' | 'error') => {
    if (!audioEnabled) return;
    // Visual feedback instead of actual audio for simplicity
    const sounds: Record<string, string> = {
      click: '🔊',
      success: '✨',
      coin: '🪙',
      levelup: '🎊',
      error: '❌',
    };
    console.log(`Sound: ${sounds[type]}`);
  }, [audioEnabled]);

  // Transition helper — 350ms fade+scale out, then swap screen and animate in
  const transitionTo = useCallback((screen: Screen) => {
    playSound('click');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 350);
  }, [playSound]);

  // Show notification
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Add coins with animation
  const addCoins = useCallback((amount: number, reason?: string) => {
    playSound('coin');
    setUser(prev => {
      const newCoins = prev.coins + amount;
      return { ...prev, coins: newCoins };
    });
    if (reason) {
      showNotification(`🪙 +${amount} coins! ${reason}`);
    }
  }, [playSound, showNotification]);

  // Add XP with level check
  const addXP = useCallback((amount: number, reason?: string) => {
    setUser(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let newAchievements = [...prev.achievements];

      while (newXP >= newXpToNext) {
        newXP -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.floor(newXpToNext * 1.5);
        playSound('levelup');
        showNotification(`🎊 Level Up! You are now Level ${newLevel}!`);
        if (newLevel === 10 && !newAchievements.includes('🏅')) {
          newAchievements.push('🏅');
        }
        if (newLevel === 20 && !newAchievements.includes('👑')) {
          newAchievements.push('👑');
        }
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        achievements: newAchievements
      };
    });
    if (reason) {
      showNotification(`⚡ +${amount} XP! ${reason}`);
    }
  }, [playSound, showNotification]);

  // Handle role selection
  const handleSelectRole = useCallback((role: 'seeker' | 'merchant' | null) => {
    playSound('click');
    setUser(prev => ({ ...prev, role }));
  }, [playSound]);

  // Handle entering souk
  const handleEnterSouk = useCallback(() => {
    transitionTo('role-select');
  }, [transitionTo]);

  // Handle continue from role selection
  const handleContinue = useCallback(() => {
    transitionTo('dashboard');
    setTimeout(() => setShowDailyQuest(true), 500);
  }, [transitionTo]);

  // Handle district click
  const handleDistrictClick = useCallback((district: District) => {
    setSelectedDistrict(district);
    transitionTo('district');
    addXP(10, 'Exploring district');
  }, [transitionTo, addXP]);

  // Handle focus zone click
  const handleFocusZoneClick = useCallback((zone: FocusZone) => {
    setSelectedFocusZone(zone);
    transitionTo('focus-zone');
  }, [transitionTo]);

  // Handle back from district
  const handleBackFromDistrict = useCallback(() => {
    transitionTo('dashboard');
  }, [transitionTo]);

  // Handle back from focus zone
  const handleBackFromFocusZone = useCallback((studyMinutes: number) => {
    if (studyMinutes > 0) {
      addXP(studyMinutes * 5, `${studyMinutes} minutes of study`);
      addCoins(Math.floor(studyMinutes * 2), 'Study session complete');
      setUser(prev => ({
        ...prev,
        totalStudyMinutes: prev.totalStudyMinutes + studyMinutes,
        streak: prev.streak + (studyMinutes >= 25 ? 1 : 0),
      }));
      setCompanionHappiness(h => Math.min(100, h + 15));
      if (studyMinutes >= 25 && !user.achievements.includes('⏰')) {
        setUser(prev => ({
          ...prev,
          achievements: [...prev.achievements, '⏰'],
        }));
        showNotification('🏆 Achievement Unlocked: Focus Master!');
      }
    }
    transitionTo('dashboard');
  }, [transitionTo, addXP, addCoins, user.achievements, showNotification]);

  // Handle role change
  const handleRoleChange = useCallback(() => {
    transitionTo('role-select');
  }, [transitionTo]);

  // Handle booking a product
  const handleBookProduct = useCallback((product: KnowledgeProduct) => {
    if (user.coins >= product.price) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins - product.price,
        xp: prev.xp + 100,
        downloadsCount: prev.downloadsCount + 1,
      }));
      playSound('success');
      showNotification(`🎉 Acquired "${product.title}"! Check your library.`);
    } else {
      playSound('error');
      showNotification(`❌ Not enough coins! You need ${product.price} coins.`);
    }
  }, [user.coins, showNotification, playSound]);

  // Handle uploading a product
  const handleUploadProduct = useCallback((_product: Omit<KnowledgeProduct, 'id' | 'rating' | 'reviewCount'>) => {
    playSound('success');
    addCoins(50, 'Knowledge uploaded!');
    addXP(150, 'Sharing knowledge');

    // Update daily quest
    setDailyQuest(prev => ({
      ...prev,
      progress: Math.min(prev.progress + 1, prev.target),
    }));

    setUser(prev => ({
      ...prev,
      uploadsCount: prev.uploadsCount + 1,
    }));

    if (user.uploadsCount === 0 && !user.achievements.includes('📝')) {
      setUser(prev => ({
        ...prev,
        achievements: [...prev.achievements, '📝'],
      }));
      showNotification('🏆 Achievement Unlocked: First Upload!');
    }
  }, [addCoins, addXP, playSound, showNotification, user.uploadsCount]);

  // Handle daily quest dismiss
  const handleDismissDailyQuest = useCallback(() => {
    setShowDailyQuest(false);
  }, []);

  // Enable audio on first interaction
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);
    return () => document.removeEventListener('click', enableAudio);
  }, []);

  // Level up check
  useEffect(() => {
    if (user.xp >= user.xpToNextLevel) {
      playSound('levelup');
    }
  }, [user.xp, user.xpToNextLevel, playSound]);

  return (
    <SoundProvider>
    <div className="min-h-screen relative overflow-hidden">
      {/* Zellige Background */}
      <div className="zellige-bg"></div>

      {/* Sound Effects Component */}
      <SoundEffects enabled={audioEnabled} />

      {/* Main Content — dreamy scale+fade transition between screens */}
      <div className={`relative z-10 ${isTransitioning ? 'screen-exit' : 'screen-enter'}`}>
        {currentScreen === 'welcome' && (
          <WelcomeScreen onEnter={handleEnterSouk} />
        )}

        {currentScreen === 'role-select' && (
          <RoleSelectionScreen
            onSelectRole={handleSelectRole}
            onContinue={handleContinue}
            selectedRole={user.role}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
            user={user}
            companionHappiness={companionHappiness}
            onAddCoins={addCoins}
            onDistrictClick={handleDistrictClick}
            onFocusZoneClick={handleFocusZoneClick}
            onRoleChange={handleRoleChange}
            dailyQuest={dailyQuest}
          />
        )}

        {currentScreen === 'district' && selectedDistrict && (
          <DistrictScreen
            district={selectedDistrict}
            user={user}
            onBack={handleBackFromDistrict}
            onBookProduct={handleBookProduct}
            onUploadProduct={handleUploadProduct}
            onAddCoins={addCoins}
          />
        )}

        {currentScreen === 'focus-zone' && selectedFocusZone && (
          <FocusZoneScreen
            zone={selectedFocusZone}
            onBack={handleBackFromFocusZone}
            user={user}
          />
        )}
      </div>

      {/* Daily Quest Popup */}
      {showDailyQuest && (
        <DailyQuestPopup
          quest={dailyQuest}
          onDismiss={handleDismissDailyQuest}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="glass-dark rounded-xl px-6 py-4 border border-gold/50 shadow-2xl">
            <p className="text-cream font-semibold text-center">{notification}</p>
          </div>
        </div>
      )}

      {/* Particle Effects Container */}
      <div id="particles-container" className="fixed inset-0 pointer-events-none z-40"></div>

      {/* Decorative Floating Elements */}
      <div className="fixed bottom-4 right-4 z-20 pointer-events-none">
        <div className="text-4xl animate-float opacity-20">🪙</div>
      </div>
      <div className="fixed top-20 right-8 z-20 pointer-events-none hidden md:block">
        <div className="text-3xl animate-float opacity-10" style={{ animationDelay: '2s' }}>✨</div>
      </div>
    </div>
    </SoundProvider>
  );
}

export default App;
