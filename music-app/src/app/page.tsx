'use client';

import { useEffect, useState } from 'react';
import { musicApi } from '@/lib/audiomack/client';
import type { AudiomackMusic } from '@/lib/audiomack/types';

export default function Home() {
  const [trending, setTrending] = useState<AudiomackMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await musicApi.getTrending(1);
        if (data && data.results) {
          setTrending(data.results);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trending music');
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-white">VibeHub</h1>
        <p className="text-gray-400 mb-8">Discover and stream the latest music</p>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-white">Trending Now</h2>
            {trending.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400">No trending music available. Please check your API credentials.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {trending.map((track) => (
                  <div
                    key={track.id}
                    className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors cursor-pointer group"
                  >
                    <div className="relative aspect-square">
                      {track.image ? (
                        <img
                          src={track.image}
                          alt={track.title || 'Track artwork'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <span className="text-4xl">🎵</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate mb-1">
                        {track.title || 'Unknown Title'}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {track.artist?.name || 'Unknown Artist'}
                      </p>
                      {track.genre && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-full">
                          {track.genre}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
