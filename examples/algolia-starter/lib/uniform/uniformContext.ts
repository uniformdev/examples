import {
  Context,
  ManifestV2,
  ContextPlugin,
  enableDebugConsoleLogDrain,
  enableContextDevTools,
  ScoreVector,
  LinearDecayOptions,
  DecayFunction,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import { NextPageContext } from "next";
import manifest from "./contextManifest.json";

export default function createUniformContext(
  serverContext?: NextPageContext
): Context {
  // 30 minutes
  const sessionExpirationInSeconds = 1800;
  const secondsInDay = 60 * 60 * 24;
  const expires = sessionExpirationInSeconds / secondsInDay;
  const plugins: ContextPlugin[] = [
    enableContextDevTools(),
    enableDebugConsoleLogDrain("debug"),
  ];
  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
      cookieAttributes: {
        expires,
      },
    }),
    plugins: plugins,
    visitLifespan: sessionExpirationInSeconds * 1000,
    // Example: custom decay override
    decay: customDecay(),
  });
  return context;
}

// example: implement your own decay function
export function customDecay(options?: LinearDecayOptions): DecayFunction {
  /** gracePeriod:
      * The length of time before decay starts, in msec.
      * Default: 1 day (8.64e7)
      */

  /**decayRate:
  * How much the score decays per day (decimal, 0-1).
  * Default: decay over 30 days (1/30)
  *
  * Note: the grace period is not included in this rate,
  * so if the grace period is 1 day and the decay rate is 1/30,
  * it would take 31 days to hit max decay.
  */
  /** decayCap
* The maximum amount of decay that can occur at once (decimal, 0-1)
* Default: 95% (0.95)
*/
  const { gracePeriod = 8.64e7, decayRate = 1 / 30, decayCap = 0.95 } = options ?? {};

  return function linearDecay({ now, lastUpd, scores, sessionScores, onLogMessage }) {
    // brand new data, no decay
    if (typeof lastUpd !== 'number') {
      return false;
    }

    const timeSinceLastUpdate = now - lastUpd;
    const timeSinceGracePeriod = timeSinceLastUpdate - gracePeriod;

    // grace period not elapsed yet
    if (timeSinceGracePeriod <= 0) {
      return false;
    }

    const timeSinceGracePeriodInDays = timeSinceGracePeriod / 8.64e7;
    const decayFactor = 1 - Math.min(decayCap, timeSinceGracePeriodInDays * decayRate);

    if (decayFactor <= 0) {
      return false;
    }

    decayVector(scores, decayFactor);
    decayVector(sessionScores, decayFactor);

    onLogMessage?.(['info', 140, `linear decay factor ${decayFactor.toPrecision(6)}`]);
    return true;
  };
}

function decayVector(vector: ScoreVector, decay: number) {
  for (const key in vector) {
    if (key.startsWith('$')) {
      continue;
    }
    vector[key] *= decay;
  }
}
