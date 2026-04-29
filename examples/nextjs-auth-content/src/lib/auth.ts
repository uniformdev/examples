import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { genericOAuth } from 'better-auth/plugins';

export type { Session, User } from 'better-auth';

export const auth = betterAuth({
  // Base URL for your application
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

  // Logging configuration
  logger: {
    level: 'debug',
  },

  // Session configuration using cookies
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '' as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '' as string,
    },
  },

  // Enable plugins for OAuth and cookie handling
  plugins: [
    // nextCookies plugin for automatic cookie handling in server actions
    nextCookies(), // This must be the last plugin
  ],
});
