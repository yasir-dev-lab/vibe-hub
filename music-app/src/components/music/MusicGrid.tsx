import TrackCard from './TrackCard';
import type { AudiomackMusic } from '@/lib/audiomack/types';

interface MusicGridProps {
  tracks: AudiomackMusic[];
}

export default function MusicGrid({ tracks }: MusicGridProps) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No tracks available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} tracks={tracks} />
      ))}
    </div>
  );
}
