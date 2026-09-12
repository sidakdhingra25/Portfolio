import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) {
    return NextResponse.json({ isPlaying: false });
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  
  try {
    // Note: We accept a low-severity race condition here where concurrent requests
    // might trigger multiple refresh token calls simultaneously if the cache is cold.
    if (!cachedToken || Date.now() > tokenExpiry) {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token,
        }),
        cache: 'no-store',
      });

      if (!tokenResponse.ok) {
        return NextResponse.json({ isPlaying: false });
      }

      const data = await tokenResponse.json();
      cachedToken = data.access_token;
      // Subtract 60 seconds as a buffer for the expiry time
      tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    }

    // 2. Fetch currently playing track
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${cachedToken}`,
      },
      cache: 'no-store',
    });

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json();

    if (!song.item) {
      return NextResponse.json({ isPlaying: false });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((a: { name: string }) => a.name).join(', ');
    const albumArt = song.item.album.images[0]?.url;
    const songUrl = song.item.external_urls.spotify;

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      albumArt,
      songUrl,
    });
  } catch (error) {
    console.error('Error fetching Spotify now playing:', error);
    return NextResponse.json({ isPlaying: false });
  }
}
