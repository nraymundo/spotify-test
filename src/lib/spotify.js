import * as SecureStore from "expo-secure-store";

export const CLIENT_ID = "622441cd35fa43e383c923ce4d76f026";

const TOKEN_KEY = "spotify_refresh_token";

export const saveRefreshToken = (token) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getRefreshToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const clearRefreshToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

export async function refreshAccessToken(refreshToken) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }).toString(),
  });
  if (!res.ok) throw new Error(`token refresh failed: ${res.status}`);
  const data = await res.json();
  // Spotify sometimes rotates the refresh token
  if (data.refresh_token) await saveRefreshToken(data.refresh_token);
  return data.access_token;
}
