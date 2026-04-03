'use client';

import Link from 'next/link';

interface GenrePillProps {
  genre: string;
}

export default function GenrePill({ genre }: GenrePillProps) {
  const isActive = genre === 'all';
  
  return (
    <Link
      href={genre === 'all' ? '/' : `/genre/${genre}`}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {genre.charAt(0).toUpperCase() + genre.slice(1)}
    </Link>
  );
}
