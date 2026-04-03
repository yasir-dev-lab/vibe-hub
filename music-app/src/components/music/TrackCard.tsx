'use client';

import Image from 'next/image';
import { usePlayerStore } from '@/lib/audiomack/store';
import type { AudiomackMusic } from '@/lib/audiomack/types';

interface TrackCardProps {
  track: AudiomackMusic;
  tracks?: AudiomackMusic[];
}

export default function TrackCard({ track, tracks }: TrackCardProps) {
  const { setTrack, setQueue } = usePlayerStore();

  const handlePlay = () => {
    if (tracks) {
      const index = tracks.findIndex((t) => t.id === track.id);
      setQueue(tracks, index);
    }
    setTrack(track);
  };

  return (
    <button
      onClick={handlePlay}
      className="group bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition w-full text-left"
    >
      <div className="relative aspect-square">
        <Image
          src={track.image}
          alt={track.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{track.title}</h3>
        <p className="text-gray-400 text-xs truncate">{track.artist}</p>
      </div>
    </button>
  );
}
