import React from "react"
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react"
import { resolveRenderer } from "../components"
import { UniformContext } from "@uniformdev/context-react"
import { createUniformContext } from "../lib/uniform/uniformContext"

const clientContext = createUniformContext()

export default function Page(props) {
  const { pageContext } = props
  return (
    <UniformContext context={clientContext}>
      <UniformComposition
        data={pageContext.composition}
        resolveRenderer={resolveRenderer}
      >
        <UniformSlot name="header" />
        <UniformSlot name="content" />
        <UniformSlot name="footer" />
      </UniformComposition>
    </UniformContext>
  )
}
