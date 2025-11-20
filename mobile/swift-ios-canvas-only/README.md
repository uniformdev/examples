# SwiftWithUniformExample

This is a sample iOS iphone app, which pulls the component parameters from Uniform composition. This is a Canvas-only solution, without Uniform personalization. It connects to Uniform global API direcrtly without SDK. If you want personalization, other framework examples or with using Uniform SDK, please check this KB article:
https://docs.uniform.app/docs/knowledge-base/enabling-uniform-for-mobile-applications

## Installation

### Installing npm packages in UniformDataAndCLI

To install the required npm packages for the Uniform CLI:

1. Navigate to the UniformDataAndCLI directory:
   ```bash
   cd UniformDataAndCLI
   ```

2. Install the npm packages:
   ```bash
   npm install
   ```

This will install the needed Uniform packages and all its dependencies as specified in the `package.json` file.

### Pushing Uniform content into your project

1. Make sure you have an empty Uniform project handy and get the API key (read-write) and project id
2. Create `.env` inside the UniformDataAndCLI directory and add the values there
```bash
UNIFORM_API_KEY=uf17...
UNIFORM_PROJECT_ID=aabb5...
```
3. Run this command in CMD from within the UniformDataAndCLI directory:
```bash
npm run uniform:push
```
Now your Uniform project should be up to date with same content as shown in the video. 

## Run the app

1. Set the Uniform project id and API key in the SwiftWithUniformExample/UniformService.swift file
2. Run the app

It will pull the latest composition from Uniform global API on build. It won't update it when composition is published on Uniform, you will need to restart the app. 

## General details

### Mapping component parameters
The component parameters coming from Uniform are mapped manually to the views in the code. Please check the `UniformService.swift` and `UniformModels.swift` files for details. 

### Versioning
Uniform project map can be used for content versioning. Here is an example structure:
- Root
  - v1
    - Home
      - Product details view
  - v2
    - Home
      - New product view


Now you can request `/v1/home` or `/v2/home` to retrieve a corresponding composition. For versioning the components, you may add additional component patterns like `Carousel pattern v2`. While this versioning mechanism help you distininguish content, you must be careful with component and parameter types, because changing these may result in a breaking change for existing versions. If an entirely new component is required, you should add it as a new component type rather than a component pattern for an exisiting component
