import { lazy, Suspense } from "react"
import loadRemote from "../utils/loadRemote.ts"
import { UniformText } from "@uniformdev/canvas-react"

const SubAppBanner = lazy(
  async () => {
    return loadRemote('subapp/SubAppBanner')
  },
)

export function FederatedModuleComponent() {
  return (
    <div>
      <Suspense fallback="Loading ...">
        <SubAppBanner
          title={
            <UniformText
              parameterId="title"
              as="span"
              placeholder="Hero title goes here"
            />
          }
        />
      </Suspense>
    </div>
  )
}
