import { LogMessages } from "@uniformdev/context";

/** Defines full error messages for each error code in messages.ts */
export const messageContent: LogMessages = {
    // CONTEXT
    1: () => ['context', 'initializing Uniform Context'],
    2: (update: unknown) => ['context', 'received update()', update],
    3: (scores: unknown) => ['context', 'new score vector', scores],
    4: (quirks: unknown) => ['context', 'updated quirks', quirks],
    5: (enrichment: { cat: unknown }) => ['context', 'ignored enrichment update for unknown enrichment category', enrichment.cat],

    104: (isControl: any) => [
        'context',
        isControl
            ? 'Visitor assigned to personalization control group'
            : 'Visitor assigned to personalization experiment group',
    ],
    110: ({ dim, cap, score }: { dim: string; cap: number; score: number }) => ['storage', `${dim} score ${score} exceeded cap ${cap}. Rounded down.`],
    120: () => ['storage', 'visitor data expired and was cleared'],
    130: (data: any) => [
        'storage',
        'server to client transition score data was loaded; it will persist until the next update event occurs',
        data,
    ],
    131: () => ['storage', 'server to client transition data was discarded'],
    140: (decayMessage: any) => ['storage', `score decay was applied: ${decayMessage}`],

    // SIGNAL EVAL
    200: () => ['signals', 'evaluating signals'],
    201: (signal: { id: string; dur: string }) => ['signals', `evaluating signal ${signal.id} (${signal.dur})`],
    202: (group: { op?: '&' | '|' }) => ['signals', group.op === '|' ? 'OR' : 'AND'],
    203: ({ criteria, result, explanation }: { criteria: { type: string }, result: { result: boolean, changed: boolean }, explanation: string }) => [
        'signals',
        `${criteria.type}: ${explanation} is ${result.result} [${result.changed ? 'CHANGED' : 'unchanged'}]`,
    ],
    204: (result: { result: boolean; changed: boolean }) => [
        'signals',
        `group result: ${result.result} [${result.changed ? 'CHANGED' : 'unchanged'}]`,
    ],

    // PERSONALIZATION
    300: (placement: { name: string }) => ['personalization', `executing personalization '${placement.name}'`],
    301: ({ id, op }: { id: string; op?: string }) => ['personalization', `testing variation ${id} (${op === '|' ? 'OR' : 'AND'})`],
    302: ({ matched, description }: { matched: boolean; description: string }) => ['personalization', `${description} is ${matched}`],
    303: (selected: boolean) => ['personalization', selected ? 'selected variation' : 'did not select variation'],

    // TESTING
    400: (name: string) => ['testing', `executing A/B test '${name}'`],
    401: (testName: string) => ['testing', `${testName} is not registered in the manifest; it will not be run.`],
    402: ({ missingVariant, variants }: { missingVariant: string; variants: string[] }) => [
        'testing',
        `test variation '${missingVariant}' previously assigned to the visitor for this test no longer exists as a variant. It will be removed. This may indicate changing test variations after publishing a test, which will make results invalid. Known variants: ${variants.join(
            ', '
        )}`,
    ],
    403: (variant: any) => ['testing', `assigned new test variant '${variant}'`],
    404: (variant: any) => ['testing', `displaying variation '${variant}'`],

    101: (commands) => ['storage', 'received update commands', commands],
    102: (data) => ['storage', 'data was updated', data],
    103: (fromAllDevices) => [
        'storage',
        `deleting visitor data ${fromAllDevices ? 'from all devices' : 'from this device'}`,
    ],
    700: () => [
        'gtag',
        'gtag is not defined, skipping analytics event emission. Ensure you have added the gtag script to your page.',
    ],
    701: () => ['gtag', 'enabled gtag event signal redirection'],
};
