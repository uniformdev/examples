# Uniform Mesh Integration Starter Kit

This is an example of a Uniform Mesh Integration application that extends the Uniform dashboard.

## Basic Usage

> Using `npx @uniformdev/cli@latest new-integration` will perform all of these steps for you!
> If you'd like to set it up manually using CLI commands, or via the Uniform dashboard, keep reading.

### Manual installation via CLI
- We assume you already have a Uniform team and Uniform project set up. You will need the team ID and project ID, as well as a _team admin_ level API key in order to use the CLI to deploy the integration.
- Copy the `.env.example` file to `.env` and fill in your team admin API key, team ID, and project ID
- `npm run register-to-team` will deploy the `mesh-manifest.json` to your team, registering it for use in projects on the team
- `npm run install-to-project` will enable the integration on your project


### Manual Installation via Uniform dashboard
- Create the integration definition on your Uniform Team, under Settings -> Custom Integrations. Paste `mesh-manifest.json` here, editing the `type` and `displayName` as you wish.
- Install the integration on a Uniform Project. Go to the Project -> Integrations, then install the custom integration from the list.

### After manually installing
- Play with the locations that come with the manifest:
  - Add the parameter type to a Component, or as a field to a Content Type. Integration parameters have a config location for their definition, as well as an editor location when editing content using the parameter type.
  - Go to the integration settings page in the Project -> Integrations section
  - Add a data source and data type defined by the integration in the Data Types section

## Advanced Usage

This project also contains reference material showing the full configurations and patterns possible with integrations. Refer to `mesh-manifest.reference.json` and `/pages/reference`, which provides a good starting point to copy from when implementing new locations.

To activate all reference locations in a 'reference integration', copy the contents of `mesh-manifest-reference.json` into an integration definition on your Uniform Team, under Settings -> Custom Integrations. This manifest file shows the full configuration possible in the integration manifest, and wires up the reference locations in `/pages/reference` to illustrate more advanced usage.

## Custom Edgehancers

Integration authors may write ESM JS code that is run to provide dynamic behaviour when fetching data resources defined by their integrations. Custom edgehancer code runs in a v8 sandbox at the edge and is highly performant.

> NOTE: custom edgehancers are only available to select customers, please contact Uniform if you are interested in using them

This project contains some example code for custom edgehancers in the `edgehancer` folder, which pairs with scripts to manage the deployment of the custom edgehancer in `package.json` (`deploy-edgehancer` and `remove-edgehancer`).

### Getting started with custom edgehancers

* Configure your .env file as outlined under `Manual installation via CLI` above. You will need a team admin level API key for this.
* Execute `npm run deploy-edgehancer`. This will:
  - Transpile and bundle the edgehancers from their TypeScript source (see `edgehancer/tsup.config.ts`)
  - Deploy the bundle to the `default` archetype of the `playground` data connector (as configured in `mesh-manifest.json` by default). This means that the custom code will run for any data resource that uses the target archetype.
  - There are two available hook points (the `deploy-edgehancer` script deploys an example of both): `preRequest` which may alter the HTTP request for a data resource but does not execute it (pre-caching), and `request` which replaces the default logic to make the fetch for a data resource and place it into cache. Much more detail is available in the source code for each example hook.

### Removing custom edgehancers

Run `npm run remove-edgehancer` to tear down the custom edgehancer if you would like to remove it from an archetype. The default edgehancer code will take over instead.

### Custom edgehancer tips and tricks

* **Limits:** Your custom edgehancers are allowed up to 100ms of CPU time to execute. This is purely CPU time, not wall time, and awaiting HTTP requests does not count against CPU time. Pre-request edgehancers may not make HTTP requests. Request edgehancers may make up to 2 * dataResourceBatchSizeProvided HTTP requests.
* **Breaking changes:** Deploying custom edgehancers that make breaking changes to API response formats where authors are already using those data types will result in breaking dynamic tokens in the authors' content. We strongly recommend a full unit test battery on your custom edgehancers to prevent this. Example unit tests are provided for the sample hooks.
* **Batching:** all hooks are provided with an array of all data resources of the registered archetype that need to be handled if more than one exists. For example a composition might reference 4 'singleEntry' data resources; in that case the hook receives an array of all 4. This can be used to facilitate batched requests (see `edgehancer/requestBatched.ts`). Note that response arrays must be in the same order as they were provided.
* **Testing:** The _test data type_ function on the Uniform dashboard is the fastest way to test a custom edgehancer at runtime.
* **Debugging:** Custom edgehancers do not capture console statements. For debugging, you can return warnings or errors to debug. If a hook throws an unhandled exception, that will be caught and added as an error to all affected data resources automatically.

