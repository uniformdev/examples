# Akeneo PIM Integration for Uniform Mesh

This repository provides a Uniform Mesh integration for connecting Akeneo PIM to the Uniform platform. This integration allows content authors to select and use product data from Akeneo PIM directly within Uniform compositions.

---

## Features

- **Akeneo PIM Integration**: Connect directly to your Akeneo PIM instance using REST API
- **Dual Archetype Support**: Choose between single product selection or multiple product selection
- **Bearer Token Authentication**: Secure authentication using Akeneo's bearer token system
- **Product Search & Filtering**: Search products by identifier, family, categories, or enabled status
- **Rich Product Display**: View product details including title, identifier, family, categories, and enabled status
- **Pagination Support**: Handle large product catalogs with built-in pagination
- **Uniform Mesh SDK Integration**: Fully compatible with Uniform's Mesh SDK

---

## Configuration

### Akeneo PIM API Setup

Before using this integration, you'll need:

1. **Akeneo PIM API URL**: Your Akeneo PIM REST API base URL (e.g., `https://your-instance.akeneo.cloud/api/rest/v1`)
2. **Bearer Token**: A valid bearer token for authentication with Akeneo PIM API

### Setting up the Integration in Uniform

1. Go to the **Uniform Dashboard**
2. Navigate to **Settings** and click **Custom Integrations**
3. Scroll down and click on **Add Integration**
4. Use one of the following manifest files:
   - **Local development**: [mesh-manifest.local.json](./mesh-manifest.local.json)
   - **Production deployment**: [mesh-manifest.vercel.json](./mesh-manifest.vercel.json)
5. Save the integration

### Configuring Data Types

After installing the integration:

1. Navigate to **Experience > Data Types**
2. Click **Add data type**
3. Select **Akeneo PIM** as the data source type
4. Configure your connection:
   - **Akeneo PIM API URL**: Your Akeneo instance API URL
   - **Bearer Token**: Your authentication token
5. Choose an archetype:
   - **Single Product**: Select one product at a time
   - **Multiple Products**: Select multiple products with advanced filtering

---

## Archetypes

### Single Product

- Ideal for hero sections, featured products, or single product displays
- Simple product selection interface
- Configurable search criteria (identifier, family, enabled status, categories)

### Multiple Products

- Perfect for product lists, carousels, or category pages
- Multi-select interface with checkboxes
- Advanced filtering options
- Pagination support for large catalogs
- Search functionality
- Configurable result limits

---

## Development

### Prerequisites

- **Node.js**: LTS version recommended
- **Uniform Account**: Access to a Uniform project
- **Akeneo PIM Instance**: Access to an Akeneo PIM instance with API credentials

### Running Locally

1. Clone this repository:

```bash
git clone [repository-url]
cd akeneo-pim-mesh-integration
```

2. Install dependencies:

```bash
npm install
```

3. Start the local development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:4063
```

The local version will be available for testing with your Uniform project.

---

## Deployment

### Deploy to Vercel

1. Fork or clone this repository
2. Push to your GitHub account
3. Connect the repository to [Vercel](https://vercel.com/)
4. Deploy the project
5. Update the `baseLocationUrl` in `mesh-manifest.vercel.json` with your Vercel deployment URL
6. Re-register the integration in Uniform with the updated manifest

---

## API Integration

This integration connects to the Akeneo PIM REST API using the following patterns:

### Authentication
- Uses Bearer token authentication
- Token is securely stored in Uniform's data source configuration
- All API requests include the Authorization header

### Endpoints Used
- `GET /api/rest/v1/products`: Fetch products with pagination and filtering
- Supports query parameters for search, pagination, and filtering

### Data Transformation
The integration transforms Akeneo's product data structure into a simplified format for easier use in Uniform:

```typescript
interface Product {
  identifier: string;
  title: string;
  description?: string;
  family?: string;
  enabled: boolean;
  categories: string[];
  imageUrl?: string;
}
```

---

## Usage

### Integration Locations

The integration provides the following locations:

- **Settings**: Configuration instructions at `/settings`
- **Data Connection Editor**: Configure Akeneo API connection at `/data-connection-editor`
- **Single Product Type Editor**: Configure single product data type at `/data-types/single-product-type-editor`
- **Single Product Data Editor**: Select single products at `/data-types/single-product-data-editor`
- **Multi Product Type Editor**: Configure multi product data type at `/data-types/multi-product-type-editor`
- **Multi Product Data Editor**: Select multiple products at `/data-types/multi-product-data-editor`

### Using in Compositions

Once configured, you can use Akeneo product data in your Uniform compositions:

1. Add a data type using the Akeneo PIM integration
2. Configure the connection and archetype
3. In your composition, bind component parameters to the data type
4. Authors can select products directly in the Uniform editor

---

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your bearer token is correct and has not expired
2. **Network Issues**: Ensure your Akeneo PIM instance is accessible from Uniform's servers
3. **No Products Found**: Check that your Akeneo instance has products and they are enabled
4. **Slow Loading**: Consider reducing the default product limit in the multi-product archetype

### API Rate Limits

Akeneo PIM has rate limiting. If you encounter issues:
- Reduce the frequency of API calls
- Implement caching in your frontend application
- Contact Akeneo support for rate limit increases if needed

---

## Resources

- [Uniform Documentation](https://docs.uniform.app/)
- [Mesh SDK Documentation](https://docs.uniform.app/docs/mesh-sdk)
- [Akeneo PIM API Documentation](https://api.akeneo.com/)
- [Vercel Documentation](https://vercel.com/docs)