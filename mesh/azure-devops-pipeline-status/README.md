# Azure DevOps Pipeline Status checker

If you are using Azure DevOps pipelines during content operations, for example to build a static app on Uniform composition publish, you may want to check the status of the running pipeline. To configure in UI, you need to know the pipeline number and have the bearer token. The credentials are stored in the browser local storage. The request to the Azure DevOps API is also coming from the same browser where Uniform is open. 

## How to install

1. (Optional, if you want to add some modifications)
1. Go to Team level and add a new custom iuntegration
1. Copy the mesh-manifest.json content and use it for the new integration. If you deployed your app, replace all hostnames with yours
1. Install this integration into your projects


Now you should see a new button when editing a composition, which will open a drawer.