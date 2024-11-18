import { ResolveComponentResult } from "@uniformdev/canvas-next-rsc/component";

export type ResolveComponentResultWithType = ResolveComponentResult & {
  type: string;
}