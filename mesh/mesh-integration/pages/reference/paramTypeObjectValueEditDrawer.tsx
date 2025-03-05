import { bindVariablesToObject } from '@uniformdev/canvas';
import { ParameterDrawerHeader, VerticalRhythm } from '@uniformdev/design-system';
import {
  Button,
  InputSelect,
  InputVariables,
  MenuItem,
  ParameterConnectionIndicator,
  ParameterConnectOptions,
  ParamTypeDynamicDataProvider,
  useMeshLocation,
  useUniformMeshSdk,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

/**
 * This param type has a complex object value, with two properties that can be independently connected to Uniform's dynamic tokens.
 * The param editing is done in a dialog, an appropriate pattern for larger editing experiences.
 */
type ParamTypeObjectValue = {
  value1?: string;
  value2?: string;
};
const ParamTypeSupportingObjectValueWithDynamicTokens: NextPage = () => {
  const sdk = useUniformMeshSdk();
  const {
    value,
    setValue,
    isReadOnly,
    dialogContext,
    metadata: { connectedData },
  } = useMeshLocation<'paramType', ParamTypeObjectValue>('paramType');

  const openEditorDialog = () => {
    sdk.openCurrentLocationDialog({ options: { disableCloseDialogOnSetValue: true } });
  };

  const updateValue = (newValue: Partial<ParamTypeObjectValue>) => {
    setValue((current) => ({ newValue: { ...current, ...newValue } }));
  };

  if (dialogContext) {
    // rendering the param editor in a drawer dialog - show the details editor
    // NOTE: normally, you would want to split this into its own component. Not done here to keep the example self-contained.
    return (
      <ParamTypeDynamicDataProvider>
        <VerticalRhythm>
          <ParameterDrawerHeader title="Configure object parameter" />

          <InputVariables<ParameterConnectOptions>
            label="Edit Value 1"
            value={value?.value1 ?? ''}
            onChange={(newValue) => updateValue({ value1: newValue })}
            disabled={isReadOnly}
            showAddVariableMenuOption="Insert dynamic token"
            enableEditingVariables
            getEditorContext={() => ({ connectsTo: ['string'] })}
          />

          <InputVariables<ParameterConnectOptions>
            label="Edit Value 2"
            value={value?.value2 ?? ''}
            onChange={(newValue) => updateValue({ value2: newValue })}
            disabled={isReadOnly}
            showAddVariableMenuOption="Insert dynamic token"
            enableEditingVariables
            getEditorContext={() => ({ connectsTo: ['string'] })}
            inputWhenNoVariables={
              // this property of the value is shown as a dropdown list unless variables are inserted
              <InputSelect
                label="Select a value"
                showLabel={false}
                options={[{ label: 'Select...', value: '' }, { label: 'Hello' }, { label: 'World' }]}
                value={value?.value2}
                onChange={(e) => updateValue({ value2: e.currentTarget.value })}
              />
            }
          />

          <Button
            onClick={() => {
              // returnDialogValue will close the editor dialog and sync the value up to the main location that opened the dialog
              dialogContext.returnDialogValue(value);
            }}
          >
            Finish
          </Button>
        </VerticalRhythm>
      </ParamTypeDynamicDataProvider>
    );
  }

  const { result: valueWithDynamicTokensBound } = bindVariablesToObject({
    value,
    variables: connectedData,
  });

  return (
    <ParamTypeDynamicDataProvider>
      <ParameterConnectionIndicator
        value={value}
        menuOptions={<MenuItem onClick={openEditorDialog}>Edit Value</MenuItem>}
      >
        <VerticalRhythm gap="sm">
          <ShowCurrentValue
            title="Value 1"
            value={value?.value1}
            boundValue={valueWithDynamicTokensBound?.value1}
          />
          <ShowCurrentValue
            title="Value 2"
            value={value?.value2}
            boundValue={valueWithDynamicTokensBound?.value2}
          />

          <Button onClick={openEditorDialog}>Edit Value</Button>
        </VerticalRhythm>
      </ParameterConnectionIndicator>
    </ParamTypeDynamicDataProvider>
  );
};

function ShowCurrentValue({
  title,
  value,
  boundValue,
}: {
  title: string;
  value: string | undefined;
  boundValue: string | undefined;
}) {
  if (!value) {
    return null;
  }

  const isBound = value !== boundValue;
  return (
    <div>
      <strong>{title}</strong>
      <div>
        {boundValue ? (
          <div>
            {isBound ? 'Bound value' : 'Value'}: <code>{boundValue}</code>
          </div>
        ) : null}
        {value && isBound ? (
          <div>
            Raw value: <code>{value}</code>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ParamTypeSupportingObjectValueWithDynamicTokens;
