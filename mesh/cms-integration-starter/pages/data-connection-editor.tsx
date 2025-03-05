import React, { FC, useCallback, useEffect, useMemo } from "react";
import {
  useMeshLocation,
  DataSourceLocationValue,
  Input,
  ValidationResult,
} from "@uniformdev/mesh-sdk-react";
import { VerticalRhythm } from "@uniformdev/design-system";
import {
  API_BASE_URL,
  DEFAULT_API_KEY,
  HEADER_API_KEY,
} from "../lib/constants";

export type DataSourceConfig = {
  apiUrl: string;
  apiKey: string;
};

const TRUE_VALIDATION_RESULT: ValidationResult = { isValid: true };

// This component is used to configure the data source connection for the integration.
// It is shown when the user navigates to the Data Types page in the Uniform UI,
// and adds a new data source of the CMS Mesh Integration type.

const DataConnectionEditor: FC = () => {
  const { value, setValue } = useMeshLocation<"dataSource">();

  const { apiUrl, apiKey } = useMemo(() => {
    const config = value.custom as DataSourceConfig;
    return {
      apiUrl: config?.apiUrl?.length > 0 ? config.apiUrl : API_BASE_URL,
      apiKey: config?.apiKey?.length > 0 ? config.apiKey : DEFAULT_API_KEY,
    };
  }, [value.custom]);

  const handleUpdate = useCallback(
    (updates?: Partial<DataSourceConfig>) => {
      setValue((current) => {
        const currentConfig = current.custom as DataSourceConfig;
        const newConfig = { ...currentConfig, ...updates };

        // Update the data source location value with the new configuration
        // The configuration examples includes the:
        // - API URL as the base URL for all data types of the data source
        // - API Key as the authentication header for all data types of the data source, stored securely
        // - Custom configuration object for additional settings, such as the API URL
        // - Custom public configuration object example for settings that should be exposed to the user
        // - Variants configuration object for additional data source configurations
        //  (e.g., for preview or unpublished data)
        const newValue: DataSourceLocationValue = {
          ...current,
          baseUrl: newConfig.apiUrl || API_BASE_URL,
          headers: [{ key: HEADER_API_KEY, value: newConfig.apiKey }],
          custom: newConfig,
          customPublic: { apiUrl: newConfig.apiUrl }, // don't expose the API key
          variants: {
            unpublished: {
              baseUrl: newConfig.apiUrl || API_BASE_URL,
              headers: [{ key: HEADER_API_KEY, value: newConfig.apiKey }],
              parameters: [
                {
                  key: "state",
                  value: "preview",
                },
              ],
            },
          },
        };

        return { newValue, options: TRUE_VALIDATION_RESULT };
      });
    },
    [setValue]
  );

  useEffect(() => {
    if (!value.custom || !(value.custom as DataSourceConfig).apiUrl) {
      handleUpdate({ apiUrl: API_BASE_URL, apiKey: DEFAULT_API_KEY });
    }
  }, [handleUpdate, value.custom]);

  return (
    <VerticalRhythm>
      <Input
        id="apiUrl"
        name="apiUrl"
        label="API URL"
        placeholder={API_BASE_URL}
        value={apiUrl}
        onChange={(e) => handleUpdate({ apiUrl: e.currentTarget.value })}
        caption={`The base URL of the API (default: ${API_BASE_URL}).`}
      />
      <Input
        id="apiKey"
        name="apiKey"
        label="API Key"
        placeholder={DEFAULT_API_KEY}
        value={apiKey}
        onChange={(e) => handleUpdate({ apiKey: e.currentTarget.value })}
        caption="The API key to use for authentication."
      />
    </VerticalRhythm>
  );
};

export default DataConnectionEditor;
