import React from "react";
import { Input } from "@uniformdev/design-system";
import { useUniformMeshLocation } from "@uniformdev/mesh-sdk-react";

export default function MonsterListParameterConfig() {
  const { value, setValue } = useUniformMeshLocation();
  async function onChangeFilter(e) {
    await setValue({ filter: e.target.value });
  }
  return (
    <div>
      <div>
        <Input
          caption="This filtering is very basic. Only enter one word &amp; no wildcards."
          id="url"
          label="Filter"
          placeholder="Enter a value to include monsters with a matching name"
          type="text"
          value={value?.filter}
          onChange={onChangeFilter}
        />
      </div>
    </div>
  );
}
