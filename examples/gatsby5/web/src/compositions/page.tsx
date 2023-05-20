import React from "react";
import {
  UniformComposition,
  UniformSlot,
  createUniformApiEnhancer,
} from "@uniformdev/canvas-react";
import { UniformContext } from "@uniformdev/context-react";
import { createUniformContext } from "../lib/uniformContext";
import Container from "../components/Container";

// IMPORTANT: importing all canvas registered components here
import "../components/canvasComponents";

const clientContext = createUniformContext();

const enhance = createUniformApiEnhancer({
  apiUrl: "/api/enhance",
});

export default function PageComposition(props: any) {
  const { pageContext } = props;

  const { composition: originalComposition } = pageContext || {};
  return (
    <UniformContext
      context={clientContext}
      outputType={
        process.env.UNIFORM_OUTPUT_MODE
          ? process.env.UNIFORM_OUTPUT_MODE
          : "standard"
      }
    >
      <Container>
        <UniformComposition
          data={originalComposition}
          contextualEditingEnhancer={enhance}
        >
          <UniformSlot name="content" />
        </UniformComposition>
      </Container>
    </UniformContext>
  );
}
