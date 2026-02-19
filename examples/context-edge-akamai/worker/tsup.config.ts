/* eslint-disable no-var */
import type { Options } from 'tsup'

export var tsup: Options = {
  clean: true,
  format: ['esm'],
  entry: ['src/main.ts'],
  splitting: false,
  external: ['http-request', 'create-response', 'streams', 'cookies', 'encoding'],
  noExternal: [/@uniformdev/],
  publicDir: './public',
  outExtension() {
    return {
      js: `.js`
    }
  }
}

