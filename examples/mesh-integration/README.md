# Uniform Mesh Integration Starter Kit

This is an example of a Uniform Mesh Integration application that extends the Uniform dashboard.

## Basic Usage

> Using `npx uniform new-integration` will perform all of these steps for you!
> If you'd like to set it up manually, keep reading.

- Create the integration definition on your Uniform Team, under Settings -> Custom Integrations. Paste `mesh-manifest.json` here, editing the `type` and `displayName` as you wish.
- Install the integration on a Uniform Project. Go to the Project -> Integrations, then install the custom integration from the list.
- Play with the locations that come with the manifest:
  - Add the parameter type from the Canvas Component Library
  - Edit the parameter type on a Canvas Composition on a component that contains the parameter type
  - Go to the integration settings page in the Project -> Integrations section

## Advanced Usage

This project also contains reference material showing the full configurations and patterns possible with integrations. Refer to `mesh-manifest.reference.json` and `/pages/reference`, which provides a good starting point to copy from when implementing new locations.

To activate all reference locations in a 'reference integration', copy the contents of `mesh-manifest-reference.json` into an integration definition on your Uniform Team, under Settings -> Custom Integrations. This manifest file shows the full configuration possible in the integration manifest, and wires up the reference locations in `/pages/reference` to illustrate more advanced usage.
