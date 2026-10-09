import { CLIP_DURATION, type MusicTrack } from "@/components/admin/dashboard/MusicsControl";
import type { PostMusic } from "@/types/Posts";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80";

/** The song chosen in the story music picker -> what a post stores. */
export function trackToPostMusic(track: MusicTrack, startTime: number): PostMusic {
  return {
    music_id: track.trackId,
    title: track.trackName,
    artist: track.artistName,
    audio_url: track.previewUrl || "",
    cover_url: track.artworkUrl100 || null,
    start_time: Math.max(0, Math.round(startTime * 10) / 10),
    duration: CLIP_DURATION,
  };
}

/** A song saved on a post -> the shape the music picker understands (for editing). */
export function postMusicToTrack(music: PostMusic): MusicTrack {
  return {
    trackId: music.music_id ?? 0,
    trackName: music.title,
    artistName: music.artist || "",
    artworkUrl100: music.cover_url || FALLBACK_COVER,
    previewUrl: music.audio_url,
    trackTimeMillis: Math.max(180, music.start_time + music.duration) * 1000,
  };
}