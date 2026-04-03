import { signRequest, toHeader } from './oauth';
import type {
  AudiomackMusic,
  AudiomackArtist,
  AudiomackPlaylist,
  AudiomackSearchResults,
} from './types';

const BASE_URL = process.env.AUDIOMACK_BASE_URL || 'https://api.audiomack.com/v1';

async function audiomackFetch<T>(
  endpoint: string,
  options: {
    method?: string;
    params?: Record<string, string>;
    authenticated?: boolean;
    token?: { key: string; secret: string };
    body?: Record<string, unknown>;
    revalidate?: number;
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    params = {},
    authenticated = false,
    token,
    body,
    revalidate = 300,
  } = options;

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const headers: Record<string, string> = {};

  if (authenticated && token) {
    const authData = signRequest(method, url.toString(), token);
    const authHeader = toHeader(authData);
    Object.assign(headers, authHeader);
  } else {
    const authData = signRequest(method, url.toString());
    const authHeader = toHeader(authData);
    Object.assign(headers, authHeader);
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    next: { revalidate },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url.toString(), fetchOptions);

  if (!res.ok) {
    throw new Error(`Audiomack API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// --- Music API Methods ---
export const musicApi = {
  getMusicById(id: string) {
    return audiomackFetch<AudiomackMusic>(`/music/${id}`);
  },

  getMusicBySlug(type: string, artistSlug: string, musicSlug: string) {
    return audiomackFetch<AudiomackMusic>(`/music/${type}/${artistSlug}/${musicSlug}`);
  },

  getRecent(page = 1) {
    return audiomackFetch<AudiomackSearchResults>(`/music/recent/page/${page}`);
  },

  getTrending(page = 1) {
    return audiomackFetch<AudiomackSearchResults>(`/music/trending/page/${page}`);
  },

  getGenreRecent(genre: string, page = 1) {
    return audiomackFetch<AudiomackSearchResults>(`/music/${genre}/recent/page/${page}`);
  },

  getGenreTrending(genre: string, page = 1) {
    return audiomackFetch<AudiomackSearchResults>(`/music/${genre}/trending/page/${page}`);
  },

  getStreamingUrl(id: string, session?: string) {
    const params: Record<string, string> = {};
    if (session) params.session = session;
    return audiomackFetch<string>(`/music/${id}/play`, {
      method: 'POST',
      params,
      revalidate: 0,
    });
  },

  favorite(id: string, token: { key: string; secret: string }) {
    return audiomackFetch<void>(`/music/${id}/favorite`, {
      method: 'PUT',
      authenticated: true,
      token,
    });
  },

  unfavorite(id: string, token: { key: string; secret: string }) {
    return audiomackFetch<void>(`/music/${id}/favorite`, {
      method: 'DELETE',
      authenticated: true,
      token,
    });
  },
};

// --- Artist API Methods ---
export const artistApi = {
  getInfo(slug: string) {
    return audiomackFetch<{ results: AudiomackArtist }>(`/artist/${slug}`);
  },

  getUploads(slug: string, page = 1) {
    return audiomackFetch<AudiomackSearchResults>(`/artist/${slug}/uploads/page/${page}`);
  },

  getPlaylists(slug: string, genre?: string) {
    const params: Record<string, string> = {};
    if (genre) params.genre = genre;
    return audiomackFetch<{ results: AudiomackPlaylist[] }>(`/artist/${slug}/playlists`, {
      params,
    });
  },

  getFollowing(slug: string) {
    return audiomackFetch<{ results: AudiomackArtist[] }>(`/artist/${slug}/following`);
  },
};

// --- Search API Methods ---
export const searchApi = {
  search(query: string, autosuggest = false) {
    const params: Record<string, string> = { q: query };
    if (autosuggest) params.autosuggest = 'true';
    return audiomackFetch<AudiomackSearchResults>(`/search/all`, {
      params,
      revalidate: 0,
    });
  },
};

// --- Playlist API Methods ---
export const playlistApi = {
  getPlaylist(slug: string) {
    return audiomackFetch<{ results: AudiomackPlaylist }>(`/playlist/${slug}`);
  },

  getTracks(slug: string) {
    return audiomackFetch<{ results: AudiomackMusic[] }>(`/playlist/${slug}/tracks`);
  },

  getTrending(page = 1) {
    return audiomackFetch<AudiomackSearchResults>(`/playlist/trending/page/${page}`);
  },
};

// --- Chart API Methods ---
export const chartApi = {
  getWeeklyPlaylists() {
    return audiomackFetch<AudiomackSearchResults>(`/chart/playlists/weekly`);
  },

  getGenreCharts(genre: string, period: string = 'weekly') {
    return audiomackFetch<AudiomackSearchResults>(`/chart/${genre}/playlists/${period}`);
  },
};
