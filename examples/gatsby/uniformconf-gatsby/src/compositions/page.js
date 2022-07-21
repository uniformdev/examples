import React from "react"
import { Composition, Slot } from "@uniformdev/canvas-react"
import { resolveRenderer } from "../components"
import { UniformContext } from "@uniformdev/context-react"
import { createUniformContext } from "../lib/uniform/uniformContext"

const clientContext = createUniformContext()

export default function Page(props) {
  const { pageContext } = props
  return (
    <UniformContext context={clientContext}>
      <Composition
        data={pageContext.composition}
        resolveRenderer={resolveRenderer}
      >
        <Slot name="header" />
        <Slot name="content" />
        <Slot name="footer" />
      </Composition>
    </UniformContext>
  )
}
