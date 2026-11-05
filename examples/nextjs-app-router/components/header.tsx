import { ComponentProps } from "@uniformdev/next-app-router/component";
import type {
  WithParentComponent,
  WithParentSlotName,
} from "@/lib/uniform/dataClient";
import { ParentLabel } from "./parentLabel";

export const HeaderComponent = ({
  parameters,
}: ComponentProps<WithParentComponent & WithParentSlotName>) => {
  // TODO: implement your header component here
  return (
    <ParentLabel
      parent={parameters.parentComponent}
      slot={parameters.parentSlotName}
    />
  );
};
