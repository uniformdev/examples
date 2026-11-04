import { ComponentProps } from "@uniformdev/next-app-router/component";
import type { WithParentComponent } from "@/lib/uniform/dataClient";
import { ParentLabel } from "./parentLabel";

export const FooterComponent = ({
  parameters,
}: ComponentProps<WithParentComponent>) => {
  // TODO: implement your footer component here
  return <ParentLabel parent={parameters.parentComponent} />;
};
