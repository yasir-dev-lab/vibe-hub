import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import AudioPlayer from '@/components/audio/AudioPlayer';

export const metadata: Metadata = {
  title: 'VibeHub - Music Streaming',
  description: 'Discover and stream music from Audiomack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black pb-24">
        <Header />
        <main>{children}</main>
        <AudioPlayer />
      </body>
    </html>
  );
}
