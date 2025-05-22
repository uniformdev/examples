import { Context } from '@uniformdev/context';
import { expect, test } from 'vitest';

import { dayOfWeekPersonalizationPlugin } from './dayOfWeekPersonalizationAlgorithm';

test('it should return a variation for the current day', () => {
  const context = new Context({
    manifest: { project: {} },
    plugins: [dayOfWeekPersonalizationPlugin],
  });

  const variations = [
    {
      id: 'monday',
      pz: { dayOfWeek: 1 }, // Monday
      fields: { content: 'Welcome to Monday.' },
    },
    {
      id: 'tuesday',
      pz: { dayOfWeek: 2 },
      fields: { content: 'Happy Tuesday.' },
    },
    {
      id: 'wednesday',
      pz: { dayOfWeek: 3 },
      fields: { content: 'It is Wednesday.' },
    },
    {
      id: 'thursday',
      pz: { dayOfWeek: 4 },
      fields: { content: 'Thursday is here.' },
    },
    {
      id: 'friday',
      pz: { dayOfWeek: 5 },
      fields: { content: 'Friday has arrived.' },
    },
    {
      id: 'saturday',
      pz: { dayOfWeek: 6 },
      fields: { content: 'Enjoy your Saturday.' },
    },
    {
      id: 'sunday',
      pz: { dayOfWeek: 0 },
      fields: { content: 'Have a peaceful Sunday.' },
    },
  ];

  const result = context.personalize({
    name: 'wat wat',
    algorithm: 'reference-pz',
    variations,
  });

  const currentDayOfWeek = new Date().getDay();
  const expectedVariation = variations.find((v) => v.pz.dayOfWeek === currentDayOfWeek)!;

  expect(result).toEqual<typeof result>({
    variations: [{ ...expectedVariation, control: false }],
    personalized: true,
  });
});
