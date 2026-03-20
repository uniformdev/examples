import { HorizontalRhythm } from '@uniformdev/design-system';
import { Input, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import React from 'react';

export type ColourPickerConfig = { colorOptions?: Array<{ value: string; label: string }> };

const ParamTypeColourPickerConfig: NextPage = () => {
  const { value, setValue, metadata } = useMeshLocation<'paramTypeConfig', ColourPickerConfig>(
    'paramTypeConfig'
  );

  const handleInputChange = (index: number, field: 'label' | 'value', newValue: string) => {
    const newColorOptions = [...(value?.colorOptions || [])];
    newColorOptions[index] = { ...newColorOptions[index], [field]: newValue };

    setValue((previous) => ({
      newValue: { ...previous, colorOptions: newColorOptions },
    }));
  };

  const optionsToRender = (value?.colorOptions || []).concat([{ label: '', value: '' }]);

  return (
    <div>
      <p>Parameter type configuration location (pid: {metadata.projectId})</p>

      <div>
        <p>Configure up to 5 color options:</p>

        {optionsToRender.map((option, index) => (
          <HorizontalRhythm key={index} align="end">
            <Input
              label={`Color ${index + 1}`}
              type="text"
              value={option.label}
              onChange={(e) => handleInputChange(index, 'label', e.target.value)}
              placeholder="e.g. Red"
            />
            <Input
              label={`Color ${index + 1} Hex`}
              showLabel={false}
              type="text"
              value={option.value}
              onChange={(e) => handleInputChange(index, 'value', e.target.value)}
              placeholder="e.g. #ff0000"
            />
          </HorizontalRhythm>
        ))}
      </div>
    </div>
  );
};

export default ParamTypeColourPickerConfig;
