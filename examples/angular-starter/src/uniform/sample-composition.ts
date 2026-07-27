import type { RootComponentInstance } from '@uniformdev/canvas';

/**
 * Local demo composition used when no Uniform project credentials are configured.
 * Exercises the full rendering pipeline: a personalized hero (default + developer
 * variant matched on the `dev` signal or `aud_dev` enrichment score), an A/B tested
 * hero, and a static hero.
 */
export const sampleComposition: RootComponentInstance = {
  _id: 'sample-composition',
  _name: 'Local demo home',
  type: 'page',
  parameters: {
    title: { type: 'text', value: 'Local demo home' },
  },
  slots: {
    content: [
      {
        _id: 'pz-hero',
        type: '$personalization',
        parameters: {
          trackingEventName: { type: 'text', value: 'Hero Personalization' },
          count: { type: 'number', value: 1 },
        },
        slots: {
          pz: [
            {
              _id: 'pz-hero-developer',
              type: 'hero',
              parameters: {
                $pzCrit: {
                  type: 'personalizationCriteria',
                  value: {
                    name: 'Developer audience',
                    op: '|',
                    crit: [
                      { l: 'dev', op: '>', r: 0 },
                      { l: 'aud_dev', op: '>', r: 0 },
                    ],
                  },
                },
                title: { type: 'text', value: 'Welcome, developer!' },
                description: {
                  type: 'text',
                  value: 'This hero is personalized for the developer audience.',
                },
              },
            },
            {
              _id: 'pz-hero-default',
              type: 'hero',
              parameters: {
                title: { type: 'text', value: 'Welcome!' },
                description: {
                  type: 'text',
                  value: 'This is the default hero, shown when no audience matches.',
                },
              },
            },
          ],
        },
      },
      {
        _id: 'ab-hero',
        type: '$test',
        parameters: {
          test: { type: 'text', value: 'heroTest' },
        },
        slots: {
          test: [
            {
              _id: 'ab-hero-a',
              type: 'hero',
              parameters: {
                $tstVrnt: { type: 'testVariant', value: { id: 'A', testDistribution: 50 } },
                title: { type: 'text', value: 'A/B hero: variant A' },
                description: { type: 'text', value: 'You were assigned variant A (sticky).' },
              },
            },
            {
              _id: 'ab-hero-b',
              type: 'hero',
              parameters: {
                $tstVrnt: { type: 'testVariant', value: { id: 'B', testDistribution: 50 } },
                title: { type: 'text', value: 'A/B hero: variant B' },
                description: { type: 'text', value: 'You were assigned variant B (sticky).' },
              },
            },
          ],
        },
      },
      {
        _id: 'static-hero',
        type: 'hero',
        parameters: {
          title: { type: 'text', value: 'Static hero' },
          description: {
            type: 'text',
            value: 'This hero is not personalized and renders for everyone.',
          },
        },
      },
    ],
  },
};
