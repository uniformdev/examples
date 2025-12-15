import React, { useCallback, useEffect, useMemo } from "react";
import {
  useMeshLocation,
  DataSourceLocationValue,
  Input,
  ValidationResult,
} from "@uniformdev/mesh-sdk-react";
import { VerticalRhythm, Caption, Callout } from "@uniformdev/design-system";

export type AemDataSourceConfig = {
  aemHost: string;
};

// Default AEM host for the mock API
const DEFAULT_AEM_HOST = "https://aem-mesh-app.vercel.app";

/**
 * Normalize URL to ensure it matches Uniform's requirements:
 * - Must start with https://
 * - Must not end with /
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  // Remove trailing slash
  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

/**
 * Validate the AEM host URL
 */
function validateAemHost(aemHost: string): ValidationResult {
  if (!aemHost || aemHost.trim() === "") {
    return { isValid: false, validationMessage: "AEM Host URL is required" };
  }

  const normalized = normalizeUrl(aemHost);

  if (!normalized.startsWith("https://")) {
    return {
      isValid: false,
      validationMessage: "URL must start with https://",
    };
  }

  // Check if the URL is valid
  try {
    new URL(normalized);
  } catch {
    return { isValid: false, validationMessage: "Invalid URL format" };
  }

  return { isValid: true };
}

/**
 * AEM Data Source Editor
 * Configures the connection settings for the AEM Content Fragments integration
 */
const AemDataSourceEditor: React.FC = () => {
  const { value, setValue } = useMeshLocation<"dataSource">();

  const { aemHost } = useMemo(() => {
    const config = value.custom as AemDataSourceConfig;
    return {
      aemHost: config?.aemHost ?? DEFAULT_AEM_HOST,
    };
  }, [value.custom]);

  const validation = useMemo(() => validateAemHost(aemHost), [aemHost]);

  const handleUpdate = useCallback(
    (updates?: Partial<AemDataSourceConfig>) => {
      setValue((current) => {
        const currentConfig = current.custom as AemDataSourceConfig;
        const newConfig = { ...currentConfig, ...updates };

        const hostUrl = normalizeUrl(newConfig.aemHost || DEFAULT_AEM_HOST);
        const baseUrl = hostUrl;
        const validationResult = validateAemHost(newConfig.aemHost);

        const newValue: DataSourceLocationValue = {
          ...current,
          baseUrl,
          custom: newConfig,
          customPublic: { aemHost: hostUrl },
        };

        return { newValue, options: validationResult };
      });
    },
    [setValue]
  );

  // Always ensure the baseUrl is correctly set (without the API path)
  // This fixes any previously saved data sources that had the wrong baseUrl
  useEffect(() => {
    const config = value.custom as AemDataSourceConfig;
    const currentHost = config?.aemHost || DEFAULT_AEM_HOST;
    const expectedBaseUrl = normalizeUrl(currentHost);
    
    // If baseUrl includes the API path or is wrong, fix it
    if (!value.baseUrl || value.baseUrl !== expectedBaseUrl) {
      handleUpdate({ aemHost: currentHost });
    }
  }, [handleUpdate, value.custom, value.baseUrl]);

  return (
    <VerticalRhythm>
      <Input
        id="aemHost"
        name="aemHost"
        label="AEM Host URL"
        placeholder={DEFAULT_AEM_HOST}
        value={aemHost}
        onChange={(e) => handleUpdate({ aemHost: e.currentTarget.value })}
      />
      <Caption>
        The base URL of your AEM instance (must be HTTPS). Example:{" "}
        {DEFAULT_AEM_HOST}
      </Caption>
      {!validation.isValid && validation.validationMessage && (
        <Callout type="error">{validation.validationMessage}</Callout>
      )}
    </VerticalRhythm>
  );
};

export default AemDataSourceEditor;

