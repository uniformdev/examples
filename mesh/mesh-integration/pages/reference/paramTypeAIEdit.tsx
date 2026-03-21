import { Callout, Label, useMeshLocation } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import React from 'react';

import { ColourPickerConfig } from './paramTypeAIEditConfig';

type ColourPickerValue = { color: string };

/** A simple color picker parameter type to demonstrate AI editing of custom parameter types */
const ParamTypeColourPicker: NextPage = () => {
  const { value, setValue, metadata, isReadOnly } = useMeshLocation<'paramType', ColourPickerValue>(
    'paramType'
  );

  const handleColorChange = (selectedColor: string) => {
    setValue(() => ({ newValue: { color: selectedColor } }));
  };

  const configValue = metadata.parameterConfiguration as ColourPickerConfig | undefined;

  return (
    <div>
      {configValue?.colorOptions && configValue.colorOptions.length > 0 ? (
        <div>
          <Label>Select a color:</Label>
          <select
            value={value?.color ?? ''}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={isReadOnly}
          >
            <option value="">Choose a color...</option>
            {configValue.colorOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label} ({option.value})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <Callout type="info">
          No color options configured. Please configure color options in the parameter type configuration.
        </Callout>
      )}
    </div>
  );
};

export default ParamTypeColourPicker;
