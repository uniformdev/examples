import { createRootRoute, Outlet } from "@tanstack/react-router";
import { isPreviewMode, PreviewProvider } from "@repo/uniform-preview/react";
import manifest from '../contextManifest.json'
import { Context, enableContextDevTools, ManifestV2 } from "@uniformdev/context"
import { UniformContext } from "@uniformdev/context-react"
import { APP_ID } from "../constants.ts"

const context = new Context({
  defaultConsent: true,
  manifest: manifest as ManifestV2,
  plugins: [enableContextDevTools()],
});

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent () {
  // Are we in preview mode within this app's Uniform project?
  // Uniform preview urls should be configured to include an app=app_id query string
  const isMFEPreview = isPreviewMode(APP_ID);

  console.log('SUBAPP[__root]', { isMFEPreview });

  // There can only be a single Uniform Context for a page
  // and that is controlled by the host unless we are editing
  // inside this app's Uniform project canvas editor
  return isMFEPreview ? (
    <UniformContext context={context}>
      <PreviewProvider>
        <RootComponentInner/>
      </PreviewProvider>
    </UniformContext>
  ) : (
    <PreviewProvider>
      <RootComponentInner/>
    </PreviewProvider>
  );
}

function RootComponentInner () {
  return (
    <Outlet/>
  );
}
