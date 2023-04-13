import React from "react";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";
import { UniformContext } from "@uniformdev/context-react";
import { createUniformContext } from "../lib/uniformContext";
import Container from "../components/Container";

// IMPORTANT: importing all canvas registered components here
import "../components/canvasComponents";

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
          contextualEditingEnhancer={contextualEditingEnhancer}
        >
          <UniformSlot name="content" />
        </UniformComposition>
      </Container>
    </UniformContext>
  );
}
