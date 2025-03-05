import { Button, Input, useMeshLocation } from "@uniformdev/mesh-sdk-react";
import {
  Callout,
  HorizontalRhythm,
  InputSelect,
  LoadingIndicator,
  LoadingOverlay,
  VerticalRhythm,
} from "@uniformdev/design-system";

import {
  IntegrationSettings,
  copyComposition,
  isExpectedWorkflow,
} from "../lib";
import { useGetCompositionWorkflow } from "../hooks";
import { useState } from "react";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";

type Message = {
  type: "success" | "error";
  title?: string;
  text: string;
};

export default function EditorTools() {
  const { value, metadata } = useMeshLocation<"canvasEditorTools">();

  const [resultMessage, setResultMessage] = useState<Message>();
  const [stateInput, setStateInput] = useState<string>("published");

  const settings = (metadata.settings as IntegrationSettings) ?? {};

  const { entityType, rootEntity } = value;

  const sourceProjectId = metadata.projectId;
  const targetProjectId = settings.targetProjectId;
  const compositionId = rootEntity._id;

  // const state = metadata.state;
  const state =
    stateInput === "published" ? CANVAS_PUBLISHED_STATE : CANVAS_DRAFT_STATE;

  // right now we don't have workflow-related metadata, so let's fetch it from API
  const { value: compositionWorkflow, loading: isCompositionWorkflowLoading } =
    useGetCompositionWorkflow({
      projectId: sourceProjectId,
      compositionId: compositionId,
      state: state,
    });

  // defensive code:
  // we configured only `editorTools.composition` in the manifest
  if (entityType !== "composition") {
    return null;
  }

  if (!targetProjectId) {
    return (
      <Callout type="error">
        Integration is not configured. Target Project ID. Head to the integration settings to set it up.
      </Callout>
    );
  }

  const onCopy = async () => {
    setResultMessage(undefined);

    const success = await copyComposition({
      targetProjectId,
      sourceProjectId,
      compositionId,
      state: state,
    });

    if (success) {
      setResultMessage({
        type: "success",
        text: "Composition has been copied",
      });
    } else {
      setResultMessage({ type: "error", text: "Could not copy composition" });
    }
  };

  const allowToCopy =
    !isCompositionWorkflowLoading &&
    compositionWorkflow &&
    isExpectedWorkflow(compositionWorkflow);

  return (
    <div>
      <VerticalRhythm>
        <Input
          name="targetProjectId"
          label="Target Project ID"
          value={settings.targetProjectId ?? ""}
          disabled
        />
        <InputSelect
          name="state"
          label="State to copy"
          options={[
            {
              label: "Published",
              value: "published",
            },
            {
              label: "Draft",
              value: "draft",
            },
          ]}
          value={stateInput ?? "published"}
          onChange={(e) => setStateInput(e.currentTarget.value ?? "draft")}
        />
        <HorizontalRhythm align="center">
          <Button type="submit" onClick={onCopy} disabled={!allowToCopy}>
            Copy composition
          </Button>
          {isCompositionWorkflowLoading && <LoadingIndicator />}
        </HorizontalRhythm>

        {!isCompositionWorkflowLoading &&
        (!compositionWorkflow || !isExpectedWorkflow(compositionWorkflow)) ? (
          <Callout type="caution">Invalid composition workflow stage</Callout>
        ) : null}

        {resultMessage ? (
          <Callout title={resultMessage?.title} type={resultMessage.type}>
            {resultMessage.text}
          </Callout>
        ) : null}

        <p>Location Metadata:</p>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>

        <p>Location Value:</p>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </VerticalRhythm>
    </div>
  );
}
