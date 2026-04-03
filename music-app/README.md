# VibeHub - Music Streaming App

A modern music streaming web application built with Next.js 15 and the Audiomack Data API.

## 🎵 Features

- **Music Discovery**: Browse trending, new releases, and curated playlists
- **Search**: Find your favorite artists, songs, and albums with real-time autosuggest
- **Audio Player**: Full-featured music player with play, pause, skip, volume controls, and queue management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern dark UI with gradient backgrounds and glassmorphism effects
- **OAuth 1.0a Authentication**: Secure authentication with Audiomack using OAuth 1.0a three-legged flow
- **Server-Side Rendering**: Fast initial page loads with Next.js Server Components
- **Smooth Animations**: Polished UI transitions powered by Framer Motion

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Audio**: Howler.js + HTML5 Audio API
- **API**: Audiomack Data API (OAuth 1.0a)
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+ and npm/pnpm/yarn
- An Audiomack Developer account (get API keys at https://audiomack.com/data-api)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Audiomack API credentials:
   ```env
   AUDIOMACK_CONSUMER_KEY=your_consumer_key_here
   AUDIOMACK_CONSUMER_SECRET=your_consumer_secret_here
   AUDIOMACK_BASE_URL=https://api.audiomack.com/v1
   AUDIOMACK_OAUTH_CALLBACK=http://localhost:3000/api/audiomack/auth/callback
   ```

4. **Get Audiomack API Keys**
   
   - Visit [Audiomack Data API](https://audiomack.com/data-api)
   - Register for a developer account
   - Create a new application to get your consumer key and secret
   - The app uses OAuth 1.0a three-legged authentication flow:
     1. Obtain a request token
     2. User authorizes the application on Audiomack
     3. Exchange for an access token (valid for 1 year)

## 🏃‍♂️ Running the App

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment on Vercel

This app is configured for easy deployment on Vercel with OAuth-based authentication.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>&env=AUDIOMACK_CONSUMER_KEY,AUDIOMACK_CONSUMER_SECRET,AUDIOMACK_BASE_URL,AUDIOMACK_OAUTH_CALLBACK&project-name=vibe-hub&repo-name=vibe-hub)

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard under **Settings → Environment Variables**:
   - `AUDIOMACK_CONSUMER_KEY` - Your Audiomack OAuth consumer key
   - `AUDIOMACK_CONSUMER_SECRET` - Your Audiomack OAuth consumer secret
   - `AUDIOMACK_BASE_URL` - Set to `https://api.audiomack.com/v1`
   - `AUDIOMACK_OAUTH_CALLBACK` - Set to `https://your-domain.com/api/audiomack/auth/callback`

### Important Notes for Production

- **OAuth Callback URL**: Make sure to update `AUDIOMACK_OAUTH_CALLBACK` to your production domain
- **Access Tokens**: Access tokens are stored in HTTP-only cookies after OAuth authorization
- **Token Expiration**: Access tokens expire after 1 year; users will need to re-authorize
- **HTTPS Required**: OAuth flow requires HTTPS in production (Vercel provides this automatically)

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `AUDIOMACK_CONSUMER_KEY` | Your Audiomack OAuth consumer key | `abc123...` |
| `AUDIOMACK_CONSUMER_SECRET` | Your Audiomack OAuth consumer secret | `xyz789...` |
| `AUDIOMACK_BASE_URL` | Audiomack API base URL | `https://api.audiomack.com/v1` |
| `AUDIOMACK_OAUTH_CALLBACK` | OAuth callback URL | `https://your-domain.com/api/audiomack/auth/callback` |

## 📁 Project Structure

```
music-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page (trending + recent)
│   │   ├── (browse)/           # Browse routes group
│   │   │   ├── trending/       # Trending music page
│   │   │   ├── recent/         # Recent uploads page
│   │   │   └── genre/[slug]/   # Genre-specific pages
│   │   ├── (discover)/         # Discover routes group
│   │   │   ├── search/         # Search results page
│   │   │   └── charts/         # Charts page
│   │   ├── (artist)/           # Artist routes group
│   │   │   └── [slug]/         # Artist profile & uploads
│   │   ├── (music)/            # Music routes group
│   │   │   └── [id]/           # Song/album detail page
│   │   ├── (user)/             # User routes group (auth required)
│   │   │   ├── profile/        # User profile
│   │   │   ├── favorites/      # User favorites
│   │   │   └── playlists/      # User playlists
│   │   └── api/                # API routes
│   │       └── audiomack/      # Audiomack API proxy routes
│   │           ├── auth/       # OAuth authentication routes
│   │           ├── music/      # Music endpoints
│   │           ├── artist/     # Artist endpoints
│   │           └── search/     # Search endpoint
│   ├── components/             # React components
│   │   ├── audio/              # Audio player components
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── VolumeControl.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── music/              # Music display components
│   │   │   ├── TrackCard.tsx
│   │   │   ├── TrackList.tsx
│   │   │   └── GenrePill.tsx
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAudioplayer.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useSearch.ts
│   ├── lib/                    # Utility functions and API client
│   │   └── audiomack/
│   │       ├── client.ts       # API client library
│   │       ├── oauth.ts        # OAuth 1.0a signing utilities
│   │       ├── types.ts        # TypeScript type definitions
│   │       └── store.ts        # Playback state (Zustand)
│   └── providers/              # Context providers
│       ├── AuthProvider.tsx
│       └── PlayerProvider.tsx
├── public/                     # Static assets
├── .env.local.example          # Example environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vercel.json                 # Vercel deployment configuration
```

## 🎨 Key Components

### AudioPlayer
A full-featured music player with:
- Play/Pause controls
- Next/Previous track navigation with shuffle and repeat modes
- Volume control with slider
- Progress bar with seek functionality
- Current track information display
- Queue management
- Just-in-time streaming URL fetching (URLs expire in ~10 seconds)

### Header
Navigation component with:
- Logo and branding
- Search functionality with debounced autosuggest
- User authentication status
- Responsive mobile menu

### SearchBar
Real-time search with:
- Debounced API calls (300ms delay)
- Autosuggest dropdown
- Navigation to search results

## 🔌 API Integration

The app uses the Audiomack Data API with OAuth 1.0a authentication for:

- **Public Endpoints** (no user auth required):
  - Fetching trending music
  - Browsing recent uploads
  - Searching tracks, artists, and albums
  - Viewing artist profiles
  - Getting playlist information

- **Authenticated Endpoints** (requires OAuth access token):
  - Favoriting/unfavoriting tracks
  - Following/unfollowing artists
  - Creating and managing playlists
  - Accessing user profile and feed
  - Managing notifications

### OAuth 1.0a Flow

The app implements the three-legged OAuth 1.0a flow:

1. **Request Token**: App requests a temporary token from Audiomack
2. **User Authorization**: User is redirected to Audiomack to grant permission
3. **Access Token**: App exchanges the authorized request token for a permanent access token (valid 1 year)

Access tokens are stored in HTTP-only cookies for security.

See the [Audiomack API Documentation](https://audiomack.com/data-api/docs) for more details.

## ⚠️ Important Considerations

### Streaming URL Lifecycle
- Streaming URLs from Audiomack expire in approximately 10 seconds
- URLs are fetched just-in-time before playback begins
- Never cache streaming URLs

### Rate Limiting
- Implement rate limiting on API routes (recommended: 60 req/min per IP)
- Use exponential backoff for retry logic on transient errors

### Caching Strategy
- Trending music: 5 minutes
- Recent uploads: 2 minutes
- Artist profiles: 1 hour
- Search results: No cache
- Streaming URLs: No cache

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Audiomack](https://audiomack.com) for providing the music API
- [Next.js](https://nextjs.org) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Howler.js](https://howlerjs.com) for audio handling

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js 15 and Audiomack API
