import { ComponentProps } from "@uniformdev/next-app-router/component";
import type {
  WithParentComponent,
  WithParentSlotName,
} from "@/lib/uniform/dataClient";
import { ParentLabel } from "./parentLabel";

export const FooterComponent = ({
  parameters,
}: ComponentProps<WithParentComponent & WithParentSlotName>) => {
  // TODO: implement your footer component here
  return (
    <ParentLabel
      parent={parameters.parentComponent}
      slot={parameters.parentSlotName}
    />
  );
};
