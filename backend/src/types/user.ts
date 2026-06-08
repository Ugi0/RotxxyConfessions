export type User = {
  id: number;
  sessionId: string;
  twitchId: string;
  username: string;
  role: "user" | "moderator" | "streamer";
  createdAt: Date;
};