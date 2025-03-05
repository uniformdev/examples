import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // enables us to use fetch mocking via miniflare
    environment: 'miniflare',
  },
});
