'use client';

import { useState } from "react";

import {
  Button,
  Heading,
  Input,
  useMeshLocation,
} from "@uniformdev/mesh-sdk-react";
import { VerticalRhythm } from "@uniformdev/design-system";


import { IntegrationSettings } from "../../lib";

export default function Settings() {
  const { value, setValue } = useMeshLocation<
    "settings",
    IntegrationSettings | undefined
  >();

  const [settings, setSettings] = useState(value ?? {});

  const updateSettings = (update: Partial<IntegrationSettings>) => {
    setSettings((prev) => ({ ...prev, ...update }));
  };

  return (
    <div>
      <Heading level={3}>Integration settings</Heading>
      <VerticalRhythm>
        <Input
          id="targetProjectId"
          name="targetProjectId"
          label="Target Project ID"
          autoComplete="off"
          value={settings.targetProjectId ?? ""}
          onChange={(e) => {
            updateSettings({ targetProjectId: e.currentTarget.value ?? "" });
          }}
        />
        <Button type="submit" onClick={() => setValue(() => ({ newValue: settings }))}>
          Save
        </Button>
      </VerticalRhythm>
    </div>
  );
};