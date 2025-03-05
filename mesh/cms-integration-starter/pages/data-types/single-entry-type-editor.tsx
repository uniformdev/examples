import React, { useEffect } from "react";
import {
  useMeshLocation,
  DataTypeLocationValue,
} from "@uniformdev/mesh-sdk-react";
import {
  VerticalRhythm,
  InputComboBox,
  Label,
  Caption,
} from "@uniformdev/design-system";
import { DEFAULT_CONTENT_TYPE } from "../../lib/constants";
import { useAsync } from "react-use";

export interface IntegrationTypeConfig {
  custom: {
    contentType: string;
  };
}

interface DataTypeLocationValueExtended extends DataTypeLocationValue {
  ttl?: number;
}

const DEFAULT_VALUE: DataTypeLocationValueExtended = {
  path: "/api/mocked-cms",
  ttl: 30, // default cache time in seconds
  method: "GET",
  variables: {
    id: {
      displayName: "Entry ID",
      type: "number",
      helpText: "The ID of the Entry to fetch",
      default: "1",
    },
    contentType: {
      displayName: "Content Type",
      type: "string",
      helpText: "The content type to retrieve",
      default: DEFAULT_CONTENT_TYPE,
    },
  },
  parameters: [
    {
      key: "id",
      value: "${id}",
    },
    { key: "contentType", value: "${contentType}" },
  ],

  custom: {
    contentType: DEFAULT_CONTENT_TYPE,
  },
};

// This component is used to configure the data type for the integration.
// It is shown when the user adds a new data type to the CMS Mesh Integration data source using the single entry type.
// The user can configure the content type to retrieve from the API.
// The content type is used to filter the data from the API.
// The user can select the content type from a list of available content types.
// It re-uses the base URL and securely stored API key from the data source configuration.

const SingleEntryTypeEditorPage: React.FC = () => {
  const { value, setValue, getDataResource } = useMeshLocation<
    "dataType",
    IntegrationTypeConfig
  >();

  useEffect(() => {
    if (!value?.path) {
      setValue(() => ({
        newValue: {
          ...DEFAULT_VALUE,
        },
      }));
    }
  }, [value, setValue]);

  const handleChange = (contentType: string) => {
    setValue(() => ({
      newValue: {
        ...value,
        custom: {
          contentType: contentType,
        },
      },
    }));
  };

  const { value: contentTypes = [] } = useAsync(async () => {
    const response = await getDataResource<string[]>({
      method: "GET",
      path: "/api/mocked-cms/content-types",
    });

    return response;
  }, []);

  const customSettings = value.custom;
  const contentType =
    (customSettings?.contentType as string) || DEFAULT_CONTENT_TYPE;

  return (
    <VerticalRhythm style={{ minHeight: "300px" }}>
      <Label>Content Type</Label>
      <InputComboBox
        name="contentType"
        id="contentType"
        onChange={(e) => handleChange(e.value)}
        options={contentTypes.map((type) => ({
          value: type,
          label: type.charAt(0).toUpperCase() + type.slice(1),
        }))}
        value={{
          value: contentType,
          label: contentType.charAt(0).toUpperCase() + contentType.slice(1),
        }}
      />
      <Caption>
        The content type to retrieve. This will be used to filter the data from
        the API.
      </Caption>
    </VerticalRhythm>
  );
};

export default SingleEntryTypeEditorPage;
