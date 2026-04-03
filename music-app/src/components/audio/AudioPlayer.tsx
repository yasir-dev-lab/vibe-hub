'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { usePlayerStore } from '@/lib/audiomack/store';
import type { AudiomackMusic } from '@/lib/audiomack/types';

interface TrackInfoProps {
  track: AudiomackMusic;
}

function TrackInfo({ track }: TrackInfoProps) {
  return (
    <div className="flex items-center gap-3 w-1/4">
      <img src={track.image} alt={track.title} className="w-14 h-14 rounded object-cover" />
      <div className="overflow-hidden">
        <h4 className="font-semibold text-sm truncate">{track.title}</h4>
        <p className="text-gray-400 text-xs truncate">{track.artist}</p>
      </div>
    </div>
  );
}

export default function AudioPlayer() {
  const howRef = useRef<Howl | null>(null);
  const progressRef = useRef<number | null>(null);
  
  const {
    currentTrack,
    isPlaying,
    isLoading,
    volume,
    play,
    pause,
    setCurrentTime,
    setDuration,
    setLoading,
    next,
    repeat,
    queue,
  } = usePlayerStore();

  // Fetch streaming URL when track changes
  const fetchStreamUrl = useCallback(async (trackId: string): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audiomack/music/play?id=${trackId}`);
      if (!res.ok) throw new Error('Failed to get stream URL');
      const url = await res.json();
      return url;
    } catch (error) {
      console.error('Stream fetch error:', error);
      return null;
    }
  }, [setLoading]);

  // Handle track ending
  useEffect(() => {
    const how = howRef.current;
    if (!how) return;

    how.on('end', () => {
      if (repeat === 'one') {
        how.seek(0);
        how.play();
      } else if (repeat === 'all' || queue.length > 0) {
        next();
      }
    });
  }, [repeat, queue.length, next]);

  // Handle track changes
  useEffect(() => {
    if (!currentTrack) return;

    // Stop previous track
    if (howRef.current) {
      howRef.current.unload();
      howRef.current = null;
    }

    let isCancelled = false;

    (async () => {
      const streamUrl = await fetchStreamUrl(currentTrack.id);
      if (!streamUrl || isCancelled) {
        setLoading(false);
        return;
      }

      const how = new Howl({
        src: [streamUrl],
        html5: true, // Enable for streaming
        volume: volume,
        onload: () => {
          if (!isCancelled) {
            setDuration(how.duration());
            setLoading(false);
          }
        },
        onloaderror: () => {
          if (!isCancelled) {
            setLoading(false);
          }
        },
        onplay: () => {
          if (!isCancelled) {
            // Start progress updates
            const updateProgress = () => {
              if (howRef.current && !howRef.current.paused()) {
                setCurrentTime(howRef.current.seek() as number);
                progressRef.current = requestAnimationFrame(updateProgress);
              }
            };
            progressRef.current = requestAnimationFrame(updateProgress);
          }
        },
        onpause: () => {
          if (progressRef.current) {
            cancelAnimationFrame(progressRef.current);
          }
        },
      });

      howRef.current = how;
      how.play();
      play();
    })();

    return () => {
      isCancelled = true;
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current);
      }
    };
  }, [currentTrack, fetchStreamUrl, play, pause, setCurrentTime, setDuration, setLoading, volume]);

  // Update volume
  useEffect(() => {
    if (howRef.current) {
      howRef.current.volume(volume);
    }
  }, [volume]);

  // Play/pause toggle
  const togglePlayback = useCallback(() => {
    if (!howRef.current) return;
    if (isPlaying) {
      howRef.current.pause();
      pause();
    } else {
      howRef.current.play();
      play();
    }
  }, [isPlaying, play, pause]);

  // Seek handler
  const handleSeek = useCallback((time: number) => {
    if (howRef.current) {
      howRef.current.seek(time);
      setCurrentTime(time);
    }
  }, [setCurrentTime]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-700 cursor-pointer group" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const duration = howRef.current?.duration() || 0;
        handleSeek(percent * duration);
      }}>
        <div 
          className="h-full bg-blue-500 relative"
          style={{ width: `${(usePlayerStore.getState().currentTime / (howRef.current?.duration() || 1)) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      <div className="flex items-center justify-between px-4 py-3">
        <TrackInfo track={currentTrack} />
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => usePlayerStore.getState().previous()}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <button
            onClick={() => usePlayerStore.getState().next()}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
        
        {/* Volume */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => usePlayerStore.getState().setVolume(parseFloat(e.target.value))}
            className="w-24 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
