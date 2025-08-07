import React, { FC, useCallback, useEffect, useMemo } from "react";
import {
  useMeshLocation,
  DataSourceLocationValue,
  Input,
  ValidationResult,
} from "@uniformdev/mesh-sdk-react";
import { VerticalRhythm } from "@uniformdev/design-system";
import {
  API_BASE_PATH,
  HEADER_API_KEY,
} from "../lib/constants";

export type DataSourceConfig = {
  apiUrl: string;
  bearerToken: string;
};

const getValidationResult = (apiUrl: string, bearerToken: string): ValidationResult => {
  if (!apiUrl || !apiUrl.trim()) {
    return { isValid: false, validationMessage: 'Akeneo PIM Base URL is required' };
  }
  
  if (!bearerToken || !bearerToken.trim()) {
    return { isValid: false, validationMessage: 'Bearer Token is required' };
  }
  
  try {
    new URL(apiUrl.trim());
  } catch {
    return { isValid: false, validationMessage: 'Please enter a valid URL format' };
  }
  
  return { isValid: true };
};

// This component is used to configure the data source connection for the integration.
// It is shown when the user navigates to the Data Types page in the Uniform UI,
// and adds a new data source of the CMS Mesh Integration type.

const DataConnectionEditor: FC = () => {
  const { value, setValue } = useMeshLocation<"dataSource">();

  const { apiUrl, bearerToken } = useMemo(() => {
    const config = value.custom as DataSourceConfig;
    return {
      apiUrl: config?.apiUrl || "",
      bearerToken: config?.bearerToken || "",
    };
  }, [value.custom]);

  const handleUpdate = useCallback(
    (updates?: Partial<DataSourceConfig>) => {
      setValue((current) => {
        const currentConfig = current.custom as DataSourceConfig;
        const newConfig = { ...currentConfig, ...updates };

        // Update the data source location value with the new configuration
        // The configuration includes:
        // - API URL as the base URL for all data types of the data source
        // - Bearer Token as the authorization header for all data types of the data source, stored securely
        // - Custom configuration object for additional settings
        // - Custom public configuration object for settings that should be exposed to the user
        // Ensure the Bearer token is properly formatted
        const formatBearerToken = (token: string) => {
          if (!token) return '';
          const cleanToken = token.trim();
          return cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`;
        };

        // Ensure the API URL has the correct path appended
        const formatApiUrl = (url: string) => {
          if (!url) return '';
          const cleanUrl = url.trim().replace(/\/$/, ''); // Remove trailing slash
          return `${cleanUrl}${API_BASE_PATH}`;
        };

        const newValue: DataSourceLocationValue = {
          ...current,
          baseUrl: formatApiUrl(newConfig.apiUrl || ''),
          headers: [{ key: HEADER_API_KEY, value: formatBearerToken(newConfig.bearerToken || '') }],
          custom: newConfig,
          customPublic: { apiUrl: newConfig.apiUrl }, // don't expose the bearer token
        };

        return { 
          newValue, 
          options: getValidationResult(newConfig.apiUrl || '', newConfig.bearerToken || '') 
        };
      });
    },
    [setValue]
  );

  // No default values - users must configure their own credentials

  return (
    <VerticalRhythm>
      <Input
        id="apiUrl"
        name="apiUrl"
        label="Akeneo PIM Base URL"
        placeholder="https://your-akeneo-url.cloud.akeneo.com"
        value={apiUrl}
        onChange={(e) => handleUpdate({ apiUrl: e.currentTarget.value })}
        caption="The base URL of your Akeneo PIM instance (without /api/rest/v1 - this will be added automatically)."
        required
      />
      <Input
        id="bearerToken"
        name="bearerToken"
        label="Bearer Token"
        placeholder="Enter your bearer token"
        value={bearerToken}
        onChange={(e) => handleUpdate({ bearerToken: e.currentTarget.value })}
        caption="The Bearer token to use for authentication with Akeneo PIM API. The 'Bearer ' prefix will be added automatically if not provided."
        type="password"
        required
      />
    </VerticalRhythm>
  );
};

export default DataConnectionEditor;
