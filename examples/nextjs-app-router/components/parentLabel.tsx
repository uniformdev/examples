import type { ComponentParameter } from "@uniformdev/next-app-router/component";
import type { ParentComponentData } from "@/lib/uniform/dataClient";

/** Shows the parent info added by CustomDataClient (`parameters.parentComponent` / `parameters.parentSlotName`). */
export const ParentLabel = ({
  parent,
  slot,
}: {
  parent: ComponentParameter<ParentComponentData> | undefined;
  slot?: ComponentParameter<string> | undefined;
}) => {
  const value = parent?.value;
  return (
    <p className="text-xs text-neutral-500">
      Parent: {value ? `${value.name} (${value.type}, ${value.id})` : "none"}
      {" · "}Slot: {slot?.value ?? "none"}
    </p>
  );
};
