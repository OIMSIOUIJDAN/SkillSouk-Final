import { useRef, useCallback, useEffect, useState } from 'react';

type SoundType = 'click' | 'coin' | 'levelup' | 'error' | 'lantern';

const SOUND_URLS: Record<SoundType, string> = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  coin: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  levelup: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  lantern: 'https://assets.mixkit.co/active_storage/sfx/1114/1114-preview.mp3',
};

const VOLUME = 0.6;

export function useSound() {
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const [enabled, setEnabled] = useState(true);

  // Preload all sounds
  useEffect(() => {
    const refs = audioRefs.current;
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = VOLUME;
      audio.preload = 'auto';
      refs.set(key as SoundType, audio);
    });

    return () => {
      refs.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      refs.clear();
    };
  }, []);

  const play = useCallback((type: SoundType, volume = VOLUME) => {
    if (!enabled) return;
    const audio = audioRefs.current.get(type);
    if (!audio) return;

    // Clone and play to allow overlapping sounds
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = volume;
    clone.currentTime = 0;
    clone.play().catch(() => {
      // Ignore autoplay restrictions
    });
  }, [enabled]);

  const playClick = useCallback(() => play('click'), [play]);
  const playCoin = useCallback(() => play('coin'), [play]);
  const playLevelUp = useCallback(() => play('levelup'), [play]);
  const playError = useCallback(() => play('error'), [play]);
  const playLantern = useCallback(() => play('lantern'), [play]);

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  return {
    enabled,
    toggle,
    play,
    playClick,
    playCoin,
    playLevelUp,
    playError,
    playLantern,
  };
}

export type SoundHook = ReturnType<typeof useSound>;
