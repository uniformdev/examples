import { FC } from "react";
import {
  ComponentProps,
  UniformSlot,
} from "@uniformdev/canvas-next-rsc/component";
import BaseContainer, { SpaceType } from "@/components/ui/Container";
import { ViewPort } from "@/utils/types";
import { ResolveComponentResultWithType } from "@/uniform/models";

export type ContainerParameters = {
  displayName?: string;
  spacing?: SpaceType | ViewPort<SpaceType>;
  fluidContent?: boolean;
  fullHeight?: boolean;
};
export enum ContainerSlots {
  ContainerContent = "containerContent",
}

export type ContainerProps = ComponentProps<
  ContainerParameters,
  ContainerSlots
>;

const Container: FC<ContainerProps> = ({
  displayName,
  slots,
  component,
  context,
  spacing,
  fluidContent,
  fullHeight,
}) => (
  <BaseContainer
    {...{
      title: displayName,
      spacing,
      fluidContent,
      fullHeight,
    }}
  >
    <UniformSlot
      data={component}
      context={context}
      slot={slots.containerContent}
    />
  </BaseContainer>
);

export const containerMapping: ResolveComponentResultWithType = {
  type: "container",
  component: Container,
};

export default Container;
