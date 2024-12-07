import { ResolveComponentResultWithType } from "@/uniform/models";

export const HeaderComponent = () => {
  return <>Header</>;
};

export const headerMapping: ResolveComponentResultWithType = {
  type: "header",
  component: HeaderComponent,
};
