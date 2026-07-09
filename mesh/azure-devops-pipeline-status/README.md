# Azure DevOps Pipeline Status checker

If you are using Azure DevOps pipelines during content operations, for example to build a static app on Uniform composition publish, you may want to check the status of the running pipeline. To configure in UI, you need to know the pipeline number and have the bearer token. The credentials are stored in the browser local storage. The request to the Azure DevOps API is also coming from the same browser where Uniform is open. 

## How to install

1. (Optional, if you want to add some modifications)
1. Go to Team level and add a new custom iuntegration
1. Copy the mesh-manifest.json content and use it for the new integration. If you deployed your app, replace all hostnames with yours
1. Install this integration into your projects


Now you should see a new button when editing a composition, which will open a drawer.

## Pending changes (next deploy)

When paired with an incremental/partial static redeploy setup, the panel can
also show **what the next deploy will rebuild**. Set the optional **Pending
changes function URL** in the config form to the revalidation Function's
read-only endpoint, e.g.:

```
https://<function-app>.azurewebsites.net/api/pending?code=<host-key>
```

The panel then renders a second table listing the relative URLs of the pages
queued for the next deploy. Each page is a link that navigates to the Uniform
content to edit, using the Mesh SDK (`router.navigatePlatform`) scoped to the
current project (read from the location `metadata.projectId`):

- compositions → `/dashboards/canvas/edit/<compositionId>`
- entries → `/dashboards/canvas/entries/<entryId>`

The per-route source (`composition` / `entry` id) comes from the `/api/pending`
response `items`; routes without an identifiable single source are listed as
plain text. The URL is stored in the same browser local storage as the other
settings.

### CORS

The request is made from the browser, from the **mesh app's own origin** (the
iframe document is served from your integration host — *not* `uniform.app`). So
the Function App's CORS must allow that exact origin: `http://localhost:9000`
while developing locally, and your deployed integration host in production.

```bash
RG=<rg>; FN=<function-app>
# local mesh dev server (next dev -p 9000):
az functionapp cors add -g $RG -n $FN --allowed-origins http://localhost:9000
# deployed integration host (whatever the mesh-manifest.json points to):
az functionapp cors add -g $RG -n $FN --allowed-origins https://<your-deployed-mesh-host>
# verify:
az functionapp cors show -g $RG -n $FN --query allowedOrigins -o tsv
```

Use the exact origin (scheme + host + port, no path/trailing slash). Don't mix
`*` with specific origins. No credentials are needed — auth is the `?code=`
query param.

This field is optional; leave it blank to show only the pipeline status.