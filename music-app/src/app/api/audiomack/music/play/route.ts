import { NextRequest, NextResponse } from 'next/server';
import { musicApi } from '@/lib/audiomack/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Music ID is required' }, { status: 400 });
  }

  try {
    const streamingUrl = await musicApi.getStreamingUrl(id);
    return NextResponse.json(streamingUrl);
  } catch (error) {
    console.error('Error fetching streaming URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch streaming URL' },
      { status: 500 }
    );
  }
}
