import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

export type { Session, User } from 'better-auth';

export const auth = betterAuth({

  // Base URL for your application
  // This can be dynamic if you need to support multiple environments
  // https://better-auth.com/docs/guides/dynamic-base-url
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
