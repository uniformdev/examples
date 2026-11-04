import type { ComponentParameter } from "@uniformdev/next-app-router/component";
import type { ParentComponentData } from "@/lib/uniform/dataClient";

/** Shows the parent component added by CustomDataClient (`parameters.parentComponent`). */
export const ParentLabel = ({
  parent,
}: {
  parent: ComponentParameter<ParentComponentData> | undefined;
}) => {
  const value = parent?.value;
  return (
    <p className="text-xs text-neutral-500">
      Parent: {value ? `${value.name} (${value.type}, ${value.id})` : "none"}
    </p>
  );
};
