import React from "react";
import { useMeshLocation, LoadingOverlay } from "@uniformdev/mesh-sdk-react";

import { EntrySelector } from "../../components/entry-selector";
import { useAsync } from "react-use";
import { ErrorCallout } from "../../components/error-callout";
import { IntegrationTypeConfig } from "./single-entry-type-editor";
import { DEFAULT_CONTENT_TYPE } from "../../lib/constants";
import { Entry } from "../../types/entry";

// This component is used to select a single entry from the CMS Mesh Integration data source.
// It is shown when the user is prompted to select a single entry from the data source.

const SingleEntryDataEditorPage: React.FC = () => {
  const { value, metadata, setValue, getDataResource } =
    useMeshLocation<"dataResource">();

  const custom = metadata.dataType as unknown as IntegrationTypeConfig;
  const contentType = custom?.custom?.contentType || DEFAULT_CONTENT_TYPE;

  const id = value?.id;

  const {
    value: entryList = [],
    loading: loadingEntry,
    error: entryError,
  } = useAsync(async () => {
    const response = await getDataResource<Entry[]>({
      method: "GET",
      path: "/api/mocked-cms",
      parameters: [{ key: "contentType", value: contentType }],
    });

    return response;
  }, []);

  const selectedIds = id ? [id] : [];

  if (loadingEntry) {
    return <LoadingOverlay isActive />;
  }

  if (entryError) {
    return <ErrorCallout error={entryError.message} />;
  }

  return (
    <EntrySelector
      entryList={entryList || []}
      contentType={contentType}
      selectedIds={selectedIds.map(String)}
      onSelect={(selectedEntry) => {
        setValue((current) => ({
          ...current,
          newValue: {
            id: selectedEntry.id.toString(),
            contentType,
          },
        }));
      }}
    />
  );
};

export default SingleEntryDataEditorPage;
