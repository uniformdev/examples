import { InputSelect, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

export interface MyAlgorithmVariantMatchCriteria {
  dayOfWeek: number | undefined;
}

const PersonalizationCriteria: NextPage = () => {
  const { value, setValue, isReadOnly } = useMeshLocation<
    'personalizationCriteria',
    MyAlgorithmVariantMatchCriteria
  >('personalizationCriteria');

  // implements an imaginary personalization criteria algorithm that uses a day of the week
  // to determine which variation to show.

  // NOTE: to make this actually get evaluated, you must also register the named algorithm with the Context SDK
  // instance that runs on your server/edge/client so that it evaluates the criteria. This only registers UI!
  // See the personalization/dayOfWeekPersonalizationAlgorithm.ts file for a matching algorithm implementation.

  // IMPORTANT: it is very possible to receive criteria that DO NOT LOOK LIKE THE EXPECTED TYPE,
  // for example if an author changes the algorithm on the whole container - you might receive some other algorithm's idea
  // of criteria. Always validate the criteria shape before using it and design a fallback strategy if it does not look valid.
  // Clean up any properties you don't expect before setting the value, as well.
  const dayOfWeekString =
    value && 'dayOfWeek' in value && typeof value.dayOfWeek === 'number' ? value.dayOfWeek.toString(10) : '';

  return (
    <>
      <InputSelect
        label="Day of week to select this variation"
        options={[
          { label: 'Select a day', value: '' },
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
          { label: 'Tuesday', value: '2' },
          { label: 'Wednesday', value: '3' },
          { label: 'Thursday', value: '4' },
          { label: 'Friday', value: '5' },
          { label: 'Saturday', value: '6' },
        ]}
        value={dayOfWeekString}
        onChange={(e) =>
          setValue(() => ({
            newValue: {
              dayOfWeek: e.target.value ? parseInt(e.target.value) : undefined,
            },
          }))
        }
        disabled={isReadOnly}
      />
    </>
  );
};

export default PersonalizationCriteria;
