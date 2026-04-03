# VibeHub - Music Streaming App

A modern music streaming web application built with Next.js and the Audiomack API.

## 🎵 Features

- **Music Discovery**: Browse trending, new releases, and curated playlists
- **Search**: Find your favorite artists, songs, and albums
- **Audio Player**: Full-featured music player with play, pause, skip, and volume controls
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Easy on the eyes with a modern dark UI
- **OAuth Authentication**: Secure authentication with Audiomack

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Audio**: Howler.js
- **API**: Audiomack Data API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
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
   - Follow the OAuth flow to obtain access tokens

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

This app is configured for easy deployment on Vercel.

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

4. Set environment variables in Vercel dashboard:
   - `AUDIOMACK_CONSUMER_KEY`
   - `AUDIOMACK_CONSUMER_SECRET`
   - `AUDIOMACK_BASE_URL`
   - `AUDIOMACK_OAUTH_CALLBACK` (update to your production URL)

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUDIOMACK_CONSUMER_KEY` | Your Audiomack API consumer key | `abc123...` |
| `AUDIOMACK_CONSUMER_SECRET` | Your Audiomack API consumer secret | `xyz789...` |
| `AUDIOMACK_BASE_URL` | Audiomack API base URL | `https://api.audiomack.com/v1` |
| `AUDIOMACK_OAUTH_CALLBACK` | OAuth callback URL | `https://your-domain.com/api/audiomack/auth/callback` |

## 📁 Project Structure

```
music-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── AudioPlayer.tsx # Music player component
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API client
│   │   └── audiomack.ts  # Audiomack API integration
│   └── providers/        # Context providers
├── public/               # Static assets
├── .env.local.example    # Example environment variables
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vercel.json           # Vercel deployment configuration
```

## 🎨 Components

### AudioPlayer
A full-featured music player with:
- Play/Pause controls
- Next/Previous track navigation
- Volume control
- Progress bar with seek functionality
- Current track information display

### Header
Navigation component with:
- Logo and branding
- Search functionality
- User authentication status

## 🔌 API Integration

The app uses the Audiomack Data API for:
- Fetching trending music
- Searching tracks, artists, and albums
- Retrieving song metadata and stream URLs
- OAuth authentication

See the [Audiomack API Documentation](https://audiomack.com/data-api/docs) for more details.

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

Built with ❤️ using Next.js and Audiomack API
