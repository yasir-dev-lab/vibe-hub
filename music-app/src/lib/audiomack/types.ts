export interface AudiomackMusic {
  id: string;
  title: string;
  artist: string;
  type: 'song' | 'album';
  genre: string;
  image: string;
  url_slug: string;
  streaming_url?: string;
  streaming_url_timeout?: number;
  stream_only: string;
  description: string;
  uploader: AudiomackArtist;
  featuring: string;
  album: string;
  released: string;
  status: string;
  time_ago: string;
  live: boolean;
  repost?: string;
}

export interface AudiomackArtist {
  id: string;
  name: string;
  url_slug: string;
  image: string;
  bio: string;
  hometown: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  label: string;
  genre: string;
  verified?: string;
  followers_count?: number;
  upload_count?: number;
  favorites_count?: number;
  playlists_count?: number;
  following_count?: number;
  feed_count?: number;
}

export interface AudiomackPlaylist {
  id: string;
  title: string;
  url_slug: string;
  genre: string;
  image: string;
  track_count: number;
  artist: AudiomackArtist;
  created: string;
  updated: string;
  private: string;
  type: string;
}

export interface AudiomackSearchResults {
  results: AudiomackMusic[];
  count: number;
}

export interface OAuthToken {
  key: string;
  secret: string;
}
