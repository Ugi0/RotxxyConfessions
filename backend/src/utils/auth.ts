export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getUserRole(username: string): "user" | "moderator" | "streamer" {
  const streamerUsername = process.env.STREAMER_USERNAME;
  const moderatorUsernames = process.env.MODERATOR_USERNAMES?.split(",").map(u => u.trim()) || [];

  if (username === streamerUsername) {
    return "streamer";
  } else if (moderatorUsernames.includes(username)) {
    return "moderator";
  } else {
    return "user";
  }
}