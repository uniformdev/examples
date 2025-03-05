
# CMS integration starter for Uniform Mesh

This repository provides a template integration for connecting a CMS to the Uniform platform using the Mesh SDK. It serves as a starting point for developers to implement their own CMS integrations, leveraging the flexibility and scalability of Uniform's Mesh capabilities.

---

## Features

- **Customizable CMS Integration**: Use this template to build a tailored integration for any CMS.
- **Support for Published and Unpublished Data**: Fetch both published and unpblished content from the CMS.
- **Single Entry Selector**: Enable users to easily browse and select individual CMS entries.
- **Mocked API Support**: Simulate API interactions for local development.
- **Uniform Mesh SDK Integration**: Fully compatible with Uniform's Mesh SDK for seamless integration.

---

## Configuration

To set up the integration in Uniform:

1. Go to the **Uniform Dashboard**.
2. Navigate to **Settings** and click **Custom Integrations**.
3. Scroll down and click on **Add Integration**.
5. Use one of the following manifest copies:
 - **Local version**: [mesh-manifest.local.json](./mesh-manifest.local.json)
 - **Vercel version**: [mesh-manifest.vercel.json](./mesh-manifest.vercel.json)
6. Save the integration, and you're ready to use it!

---

## Development

### Prerequisites

- **Node.js**: Ensure you have Node.js LTS installed.
- **Uniform Account**: Access to a Uniform project for testing and deployment.

### Running Locally

1. Clone this repository:

```git clone [https://github.com/uniformdev/cms-integration-template]https://github.com/uniformdev/cms-integration-template)```
```cd cms-integration-template```

2. Install dependencies:

```npm install```

3. Start the local development server:

```npm run dev```

4. Open your browser and navigate to:

[http://localhost:4063](http://localhost:4063)

5. The local version of the integration will be available for testing.

--- 
## Deployment

### Deploy to Vercel

1. Fork or clone this repository.
2. Push the repository to your own GitHub account.
3. Connect the repository to [Vercel](https://vercel.com/).
4. Deploy the project using Vercel's interface or CLI:

Once deployed, use the generated Vercel URL in the `Mesh App Manifest` field to set up the integration in Uniform.

--- 
## API Endpoints

The mocked API provides the following endpoints:

- `GET /api/mocked-cms`: Fetches a list of entries.
- `GET /api/mocked-cms/content-types`: Retrieves available content types.
- Supports preview mode via the `state=preview` query parameter.

--- 
## Usage

### Integration Locations

The integration provides the following locations:

- **Settings**: Accessible at `/settings` for configuring the integration.
- **Data Connection Editor**: Configure the connection to your CMS at `/data-connection-editor`.
- **Single Entry Editor**: Manage single entry types at `/data-types/single-entry-type-editor` and `/data-types/single-entry-data-editor`.

--- 
## Resources

- [Uniform Documentation](https://docs.uniform.app/)
- [Mesh SDK Documentation](https://docs.uniform.app/docs/mesh-sdk)
- [Vercel Documentation](https://vercel.com/docs)