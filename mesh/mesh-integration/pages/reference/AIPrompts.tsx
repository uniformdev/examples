import { Label, Textarea, useMeshLocation } from "@uniformdev/mesh-sdk-react";
import type { NextPage } from "next";
import React, { ChangeEvent } from "react";

const AIPrompts: NextPage = () => {
  const { value, setValue, metadata } = useMeshLocation<"aiGenerate", string>();

  const handleResultChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    await setValue(() => ({ newValue: e.target.value ?? "" }));
  };

  return (
    <>
      <Label>Metadata</Label>
      <pre>{JSON.stringify(metadata)}</pre>

      <Textarea
        name="result"
        label="Input a prompt result"
        value={value ?? ""}
        onChange={handleResultChange}
        rows={5}
      />
    </>
  );
};
export default AIPrompts;
