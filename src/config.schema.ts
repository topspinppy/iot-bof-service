export interface ConfigSchema {
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_TOKEN_SECRET_KEY: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  JWT_REFRESH_TOKEN_SECRET_KEY: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
  AUTH_ORIGIN: string;
}
