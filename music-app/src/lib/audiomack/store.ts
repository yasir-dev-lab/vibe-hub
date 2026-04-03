import { create } from 'zustand';
import type { AudiomackMusic } from './types';

interface PlayerState {
  currentTrack: AudiomackMusic | null;
  queue: AudiomackMusic[];
  queueIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  // Actions
  setTrack: (track: AudiomackMusic) => void;
  setQueue: (tracks: AudiomackMusic[], startIndex?: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setLoading: (loading: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  shuffle: false,
  repeat: 'off',

  setTrack: (track) => set({ currentTrack: track, isLoading: true }),
  setQueue: (tracks, startIndex = 0) => set({ queue: tracks, queueIndex: startIndex }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  toggleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off',
    })),

  next: () => {
    const { queue, queueIndex, shuffle } = get();
    if (queue.length === 0) return;
    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }
    set({
      queueIndex: nextIndex,
      currentTrack: queue[nextIndex],
      isLoading: true,
      currentTime: 0,
    });
  },

  previous: () => {
    const { queue, queueIndex } = get();
    if (queue.length === 0) return;
    const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    set({
      queueIndex: prevIndex,
      currentTrack: queue[prevIndex],
      isLoading: true,
      currentTime: 0,
    });
  },
}));
