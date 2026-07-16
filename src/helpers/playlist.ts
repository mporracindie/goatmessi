export type PlaylistGoal = {
  goalNumber: string;
  date: string;
};

const PLAYLIST_KEY = 'goatmessi.playlist';
const PLAYLIST_RETURN_KEY = 'goatmessi.playlistReturn';

export const savePlaylist = (goals: PlaylistGoal[], returnUrl: string) => {
  sessionStorage.setItem(PLAYLIST_KEY, JSON.stringify(goals));
  sessionStorage.setItem(PLAYLIST_RETURN_KEY, returnUrl);
};

export const loadPlaylist = (): PlaylistGoal[] | null => {
  try {
    const raw = sessionStorage.getItem(PLAYLIST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlaylistGoal[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.filter((goal) => goal?.goalNumber && goal?.date);
  } catch {
    return null;
  }
};

export const loadPlaylistReturnUrl = (): string => {
  return sessionStorage.getItem(PLAYLIST_RETURN_KEY) || '/';
};

export const clearPlaylist = () => {
  sessionStorage.removeItem(PLAYLIST_KEY);
  sessionStorage.removeItem(PLAYLIST_RETURN_KEY);
};
