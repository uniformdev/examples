import React from "react";
import {
  UniformComposition,
  UniformSlot,
  // UniformCompositionProps,
} from "@uniformdev/canvas-react";
import { componentResolutionRenderer } from "../components";
import { UniformContext } from "@uniformdev/context-react";
import { createUniformContext } from "../lib/uniformContext";
import Container from "../components/Container";
// import { enhanceComposition } from "../lib/canvas";

const clientContext = createUniformContext();

export default function PageComposition(props: any) {
  const { pageContext, contextualEditingEnhancer } = props;
  const { composition } = pageContext || {};

  return (
    <UniformContext
      context={clientContext}
      outputType={
        process.env.GATSBY_UNIFORM_OUTPUT_MODE
          ? process.env.GATSBY_UNIFORM_OUTPUT_MODE
          : "standard"
      }
    >
      <Container>
        <UniformComposition
          data={composition}
          resolveRenderer={componentResolutionRenderer}
          contextualEditingEnhancer={contextualEditingEnhancer}
        >
          <UniformSlot name="content" />
        </UniformComposition>
      </Container>
    </UniformContext>
  );
}
