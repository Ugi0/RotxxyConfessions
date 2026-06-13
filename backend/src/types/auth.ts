export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

export type HelixUsersResponse = {
  data: TwitchUser[];
}

export interface TwitchTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: "bearer";
}