import { Button, TabButton, TabButtonGroup, TabContent, Tabs } from '@uniformdev/design-system';
import {
  Callout,
  createLocationValidator,
  DataSourceEditor,
  DataSourceLocationValue,
  useMeshLocation,
} from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import { HowToEditRequests } from '../../reference-lib/HowToEditRequests';
import { HowToUseDialogs } from '../../reference-lib/HowToUseDialogs';

/*
 * Data Source UI demonstration
 * This location is rendered when editing a Data Source connected to the Data Connector
 * registered in the integration's manifest JSON.
 */

// HTTP Fallback: note that if the data source location is removed from the mesh integration manifest,
// the UI from the standard 'HTTP Request' data connector will be used in its place automatically.
// This enables integration developers to produce fewer UIs if only looking to customize part of a data connector.

// Secrets: query string and header values, as well as any variable values on a data source are encrypted secrets.
// Only users with manage data source or admin permissions may decrypt secrets. All others can use them via delegation
// when fetching data types, without seeing the secret values.

/*
 * Data Source name proposal: if you would like to propose a default name for new data sources,
 * setting the special `custom.proposedName` property will signal to the UI that you are providing a custom
 * default name. Note that this only applies when creating new data sources; as soon as it has been saved once, the proposed name
 * is ignored, and the existing name is always used.

  useEffect(() => {
    setValue((prev) => ({
      newValue: { ...prev, custom: { ...prev.custom, proposedName: 'My Custom Proposed Name' } },
    }));
  }, [setValue]);
 */

const DataSource: NextPage = () => {
  const { setValue } = useMeshLocation('dataSource');
  // In most cases some of the attributes of the location are not user-editable
  // we can use an effect to ensure that those attributes are always set up correctly
  useEffect(() => {
    setValue((currentValue) => ({
      newValue: {
        ...currentValue,
        baseUrl: 'https://pokeapi.co/api/v2',
        custom: {
          proposedName: 'PokéAPI',
        },
      },
    }));
  }, [setValue]);
  // to perform custom validation, one can intercept setValue calls
  const setValidatedValue = createLocationValidator(setValue, (newValue, currentResult) => {
    if (newValue.baseUrl.startsWith('ftp://')) {
      return {
        isValid: false,
        validationMessage:
          'createLocationValidator example: ftp protocol is not allowed. It is not 1996 any more.',
      };
    }
    setValue((currentValue) => ({
      newValue: { ...currentValue, baseUrl: newValue.baseUrl },
    }));
    return currentResult ?? { isValid: true };
  });

  return (
    <DataSourceEditor onChange={setValidatedValue}>
      <div>
        <Callout type="tip">
          Dev tip: The URL is being set each time the editor loads with an effect, to simulate a UI where the
          URL is fixed to a specific API and cannot be edited. Remove the effect code before changing the URL
          below, or it will revert on each load.
        </Callout>

        <HowToEditRequests />

        <HowToUseDialogs namedDialogName="dceDialog" />
      </div>
    </DataSourceEditor>
  );
};

/**
 * To support unpublished content, you need to save the data source with the unpublished data variant.
 *
 * So regular data source data looks like this:
 *
 * {
 *   baseUrl: 'https://pokeapi.co/api/v2',
 *   custom: {
 *     secret: 'secret',
 *     proposedName: 'PokéAPI',
 *   },
 *   headers: [
 *     { key: 'Authorization', value: 'Bearer secret' },
 *   ],
 * }
 *
 * And with unpublished content it will look like this:
 *
 * {
 *   baseUrl: 'https://pokeapi.co/api/v2',
 *   custom: {
 *     secret: 'secret',
 *     previewSecret: 'preview-secret',
 *   },
 *   headers: [
 *     { key: 'Authorization', value: 'Bearer secret' },
 *   ],
 *   variants: {
 *     unpublished: {
 *       baseUrl: 'https://preview.pokeapi.co/api/v2',
 *       headers: [
 *         { key: 'Authorization', value: 'Bearer preview-secret' },
 *       ],
 *     },
 *   },
 * }
 *
 * You need to provide all headers, parameters and variables inthe variant again,
 * because they are not inherited from the standard data source.
 *
 * You can find more details inside TypeScript types for DataSourceLocationValue
 * import { DataSourceLocationValue } from '@uniformdev/mesh-sdk';
 *
 *
 *
 */
const MultiVariantDataSource: NextPage = () => {
  const { setValue } = useMeshLocation('dataSource');

  // In most cases some of the attributes of the location are not user-editable
  // we can use an effect to ensure that those attributes are always set up correctly
  useEffect(() => {
    setValue((currentValue) => ({
      newValue: {
        ...currentValue,
        baseUrl: 'https://pokeapi.co/api/v2',
        custom: {
          proposedName: 'PokéAPI',
        },
        variants: {
          unpublished: {
            baseUrl: 'https://pokeapi.co/api/v2',
          },
        },
      },
    }));
  }, [setValue]);

  // to perform custom validation, one can intercept setValue calls
  const setValidatedStandardValue = createLocationValidator(setValue, (newValue, currentResult) => {
    if (newValue.baseUrl.startsWith('ftp://')) {
      return {
        isValid: false,
        validationMessage:
          'createLocationValidator example: ftp protocol is not allowed. It is not 1996 any more.',
      };
    }
    setValue((currentValue) => ({
      newValue: { ...currentValue, baseUrl: newValue.baseUrl },
    }));
    return currentResult ?? { isValid: true };
  });

  const setValidateUnpublishedData = createLocationValidator<DataSourceLocationValue>(
    setValue,
    (newValue, currentResult) => {
      if (!newValue.variants?.unpublished?.headers?.find((header) => header.key === 'Authorization')?.value) {
        return {
          isValid: false,
          validationMessage:
            'createLocationValidator example: Unpublished data requires Authorization Token to be present in headers.',
        };
      }
      setValue((currentValue) => ({
        newValue: { ...currentValue, baseUrl: newValue.baseUrl },
      }));
      return currentResult ?? { isValid: true };
    }
  );

  return (
    <Tabs>
      <TabButtonGroup aria-label="Data Source editor form with alternatives if available">
        <TabButton id="standard">Standard</TabButton>
        <TabButton id="unpublished">Unpublished content</TabButton>
      </TabButtonGroup>
      <TabContent id="standard">
        <DataSourceEditor onChange={setValidatedStandardValue}>
          <div>
            <Callout type="tip">
              Dev tip: The URL is being set each time the editor loads with an effect, to simulate a UI where
              the URL is fixed to a specific API and cannot be edited. Remove the effect code before changing
              the URL below, or it will revert on each load.
            </Callout>

            <HowToEditRequests />

            <HowToUseDialogs namedDialogName="dceDialog" />
          </div>
        </DataSourceEditor>
      </TabContent>
      <TabContent id="unpublished">
        <DataSourceEditor onChange={setValidateUnpublishedData}>
          <Callout type="tip">
            Usually unpublished data only differs from standard data in the URL or headers. So you can provide
            only the differences here as inputs
          </Callout>
          <Button
            buttonType="secondary"
            onClick={() =>
              setValue((prev) => {
                return {
                  newValue: {
                    ...prev,
                    variants: {
                      unpublished: {
                        ...prev.variants?.unpublished,
                        headers: [
                          ...(prev.variants?.unpublished?.headers ?? []),
                          { key: 'Authorization', value: 'Bearer secret' },
                        ],
                      } as any,
                    },
                  },
                };
              })
            }
          >
            Set unpublished data Autorization header
          </Button>
        </DataSourceEditor>
      </TabContent>
    </Tabs>
  );
};

export default function DataSourcePage() {
  const { metadata } = useMeshLocation('dataSource');

  // To enable unpublished content support, set the supportsUnpublishedData flag to true in the metadata
  // Then you will see a switcher on Data Source editor page that will enable Unpublished Content configuration for given data connector
  return metadata.enableUnpublishedMode ? <MultiVariantDataSource /> : <DataSource />;
}
