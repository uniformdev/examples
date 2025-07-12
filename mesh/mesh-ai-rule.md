---
description: 
globs: 
alwaysApply: true
---

# Uniform Mesh Integrations - AI Development Rules

## Overview

Uniform Mesh is a framework that enables extending the Uniform user interface with custom web applications. These integrations run as web applications hosted on URLs that the developer defines and communicate with the Uniform dashboard through iframe messaging.

## Core Architecture

### Integration Structure
- **Web Application**: Provides UI incorporated into Uniform dashboard and implements external system interaction logic
- **Manifest**: JSON configuration that tells Uniform how to incorporate the integration (mesh-manifest.json)
- **Locations**: Specific areas in the Uniform UI where custom interfaces are rendered

### Technology Stack Requirements
- **Framework**: Next.js with page router (recommended)
- **SDK**: `@uniformdev/mesh-sdk-react` (required for React-based integrations)
- **Design System**: `@uniformdev/design-system` (required for consistent UI)
- **Uniform CLI**: `@uniformdev/cli` (required CLI package to work with integrations - register it within a team and install it within a given project)
- **Language**: TypeScript (strongly recommended)

## Manifest Configuration

### Base Manifest Structure
```json
{
  "type": "your-integration-type",
  "displayName": "Your Integration Name",
  "baseLocationUrl": "http://localhost:9000",
  "logoIconUrl": "https://example.com/logo.png",
  "badgeIconUrl": "https://example.com/badge.png",
  "category": "content|ai|analytics|commerce",
  "scopes": ["user:read"],
  "locations": {
    // Location definitions
  }
}
```

### Required Fields
- `type`: Unique identifier for the integration
- `displayName`: Human-readable name shown in Uniform UI
- `baseLocationUrl`: Base URL where the integration is hosted
- `locations`: Object defining available integration points

## Location Types and Implementation Patterns

### 1. Settings Location
Used for integration-wide configuration accessible from Project Settings > Integrations.

**Manifest Configuration:**
```json
"settings": {
  "url": "/settings",
  "locations": {
    "settingsDialog": {
      "url": "/settings-dialog"
    }
  }
}
```

**Implementation Pattern:**
```tsx
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';
import { Input, Button } from '@uniformdev/design-system';

const Settings = () => {
  const { value, setValue } = useMeshLocation<'settings', { apiKey: string }>('settings');
  const [apiKey, setApiKey] = useState(value?.apiKey ?? '');

  const handleSave = () => {
    setValue((previous) => ({ 
      newValue: { ...previous, apiKey } 
    }));
  };

  return (
    <div>
      <Input 
        label="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.currentTarget.value)}
      />
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
};
```

### 2. Data Connectors
Enable integration with external data sources for content mapping.

**Manifest Configuration:**
```json
"dataConnectors": [
  {
    "type": "your-connector-type",
    "displayName": "Your Data Connector",
    "dataArchetypes": {
      "default": {
        "displayName": "Single Item",
        "dataEditorUrl": "/data-editor",
        "typeEditorUrl": "/type-editor"
      }
    },
    "dataSourceEditorUrl": "/data-source-editor"
  }
]
```

#### Data Source Editor
Configures connection settings for the external system.

**Implementation Pattern:**
```tsx
import { useMeshLocation, DataSourceLocationValue } from '@uniformdev/mesh-sdk-react';

type DataSourceConfig = {
  apiUrl: string;
  apiKey: string;
};

const DataSourceEditor = () => {
  const { value, setValue } = useMeshLocation<'dataSource'>();
  const config = value.custom as DataSourceConfig;

  const handleUpdate = (updates: Partial<DataSourceConfig>) => {
    setValue((current) => {
      const newConfig = { ...config, ...updates };
      const newValue: DataSourceLocationValue = {
        ...current,
        baseUrl: newConfig.apiUrl,
        headers: [{ key: 'Authorization', value: `Bearer ${newConfig.apiKey}` }],
        custom: newConfig,
        variants: {
          preview: {
            baseUrl: newConfig.apiUrl,
            parameters: [{ key: 'preview', value: 'true' }]
          }
        }
      };
      return { newValue, options: { isValid: true } };
    });
  };

  return (
    <div>
      <Input 
        label="API URL"
        value={config?.apiUrl || ''}
        onChange={(e) => handleUpdate({ apiUrl: e.currentTarget.value })}
      />
      <Input 
        label="API Key"
        value={config?.apiKey || ''}
        onChange={(e) => handleUpdate({ apiKey: e.currentTarget.value })}
      />
    </div>
  );
};
```

#### Data Type Editor
Configures how data is retrieved and processed.

**Implementation Pattern:**
```tsx
import { useMeshLocation, DataTypeLocationValue } from '@uniformdev/mesh-sdk-react';

const DataTypeEditor = () => {
  const { setValue, value } = useMeshLocation('dataType');
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    setValue((prev: DataTypeLocationValue) => ({
      newValue: {
        ...prev,
        path: '/api/items/${itemId}',
        parameters: [
          {
            key: 'fields',
            value: selectedFields.join(','),
            omitIfEmpty: true
          }
        ],
        custom: { fields: selectedFields }
      }
    }));
  }, [selectedFields]);

  return (
    <ScrollableList label="Fields to include">
      {AVAILABLE_FIELDS.map(field => (
        <ScrollableListItem
          key={field}
          buttonText={field}
          active={selectedFields.includes(field)}
          onClick={() => toggleField(field)}
        />
      ))}
    </ScrollableList>
  );
};
```

#### Data Resource Editor
Enables users to select specific data items.

**Implementation Pattern:**
```tsx
import { 
  useMeshLocation,
  ObjectSearchProvider,
  ObjectSearchContainer,
  ObjectSearchListItem 
} from '@uniformdev/mesh-sdk-react';

const DataResourceEditor = () => {
  const { setValue, getDataResource, metadata } = useMeshLocation<'dataResource'>();
  const [items, setItems] = useState([]);

  const fetchItems = async (query?: string) => {
    const path = query ? `/api/items?search=${query}` : '/api/items';
    const data = await getDataResource({ path });
    setItems(data);
  };

  const handleSelection = (selectedItem: any) => {
    setValue(() => ({
      newValue: { itemId: selectedItem.id }
    }));
  };

  return (
    <ObjectSearchProvider>
      <ObjectSearchContainer
        label="Select Item"
        searchFilters={
          <InputKeywordSearch 
            onSearchTextChanged={fetchItems}
          />
        }
        resultList={items.map(item => (
          <ObjectSearchListItem
            key={item.id}
            id={item.id}
            title={item.title}
            onClick={() => handleSelection(item)}
          />
        ))}
      />
    </ObjectSearchProvider>
  );
};
```

### 3. Canvas Parameter Types
Custom parameter editors for Canvas components.

**Manifest Configuration:**
```json
"canvas": {
  "parameterTypes": [
    {
      "type": "custom-text",
      "editorUrl": "/parameter-editor",
      "displayName": "Custom Text Parameter",
      "configureUrl": "/parameter-config",
      "renderableInPropertyPanel": true
    }
  ]
}
```

**Implementation Pattern:**
```tsx
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';

const ParameterEditor = () => {
  const { value, setValue, metadata, isReadOnly } = useMeshLocation<'paramType', string>('paramType');

  return (
    <Input
      label={metadata.parameterDefinition.name}
      value={value ?? ''}
      onChange={(e) => setValue(() => ({ newValue: e.target.value }))}
      disabled={isReadOnly}
    />
  );
};
```

### 4. Asset Library Integration
Extends Uniform's asset management with external asset providers.

**Manifest Configuration:**
```json
"assetLibrary": {
  "assetLibraryUrl": "/asset-library",
  "assetParameterUrl": "/asset-parameter"
}
```

**Implementation Pattern:**
```tsx
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';

const AssetLibrary = () => {
  const { metadata } = useMeshLocation('assetLibrary');
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssets = async (query: string) => {
    const response = await fetch(`/api/assets?q=${query}`);
    const data = await response.json();
    setAssets(data.results);
  };

  const handleAssetSelect = (asset: any) => {
    // Transform external asset to Uniform format
    const uniformAsset = {
      url: asset.src.large,
      title: asset.alt,
      description: asset.photographer,
      // Additional metadata
    };
    
    // Asset selection logic handled by Uniform
  };

  return (
    <div>
      <SearchBar 
        onSearch={fetchAssets}
        placeholder="Search assets..."
      />
      <AssetGrid>
        {assets.map(asset => (
          <AssetGridItem
            key={asset.id}
            asset={asset}
            onSelect={() => handleAssetSelect(asset)}
          />
        ))}
      </AssetGrid>
    </div>
  );
};
```

### 5. Editor Tools
Add custom tools to Canvas and Entry editors.

**Manifest Configuration:**
```json
"canvas": {
  "editorTools": {
    "composition": {
      "url": "/canvas-tools"
    },
    "componentPattern": {
      "url": "/component-tools"
    },
    "entry": {
      "url": "/entry-tools"
    }
  }
}
```

**Implementation Pattern:**
```tsx
import { useMeshLocation } from '@uniformdev/mesh-sdk-react';

const CanvasEditorTools = () => {
  const { value, metadata } = useMeshLocation('canvasEditorTools');
  const compositionId = value.rootEntity._id;

  const handleAction = async () => {
    // Perform custom action on composition
    const response = await fetch('/api/custom-action', {
      method: 'POST',
      body: JSON.stringify({ compositionId }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      // Show success feedback
    }
  };

  return (
    <div>
      <h3>Custom Tools</h3>
      <Button onClick={handleAction}>
        Perform Custom Action
      </Button>
    </div>
  );
};
```

### 6. Project Tools
Add custom tools to project navigation.

**Manifest Configuration:**
```json
"projectTools": [
  {
    "id": "analytics-tool",
    "name": "Analytics Dashboard",
    "url": "/analytics",
    "iconUrl": "/analytics-icon.svg"
  }
]
```

## Development Patterns and Best Practices

> **⚠️ IMPORTANT**: After creating your integration, you MUST register it with Uniform before you can use it. See the "Installation and Deployment" section for detailed steps.

### Required package
Make sure to always install **Uniform CLI**: `@uniformdev/cli` as a developer dependency as it is required CLI package to work with integrations - register it within a team and install it within a given project.

### Environment Setup
```bash
# Create new integration
npx @uniformdev/cli@latest new-integration

# Install dependencies
npm install @uniformdev/mesh-sdk-react @uniformdev/design-system @uniformdev/cli

# Set required environment variables for registration
UNIFORM_API_KEY=your_api_key
UNIFORM_TEAM_ID=your_team_id
UNIFORM_PROJECT_ID=your_project_id

# After development, register integration (see Installation and Deployment section)
npm run register-to-team
npm run install-to-project
```

### Validation Pattern
```tsx
import { ValidationResult } from '@uniformdev/mesh-sdk-react';

const useValidation = (value: string): ValidationResult => {
  return useMemo(() => {
    if (!value || value.trim().length === 0) {
      return { isValid: false, validationMessage: 'Value is required' };
    }
    
    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return { isValid: false, validationMessage: 'Invalid URL format' };
    }
  }, [value]);
};

// Usage in component
const { value, setValue } = useMeshLocation('dataSource');
const validation = useValidation(value.baseUrl);

setValue((current) => ({
  newValue: { ...current, baseUrl: newValue },
  options: validation
}));
```

### Dialog Management
```tsx
import { useOpenDialog, useCloseDialog } from '@uniformdev/mesh-sdk-react';

const ComponentWithDialog = () => {
  const openDialog = useOpenDialog();
  const closeDialog = useCloseDialog();

  const handleOpenDialog = () => {
    openDialog({
      location: 'namedDialog',
      size: 'medium',
      title: 'Custom Dialog'
    });
  };

  return (
    <Button onClick={handleOpenDialog}>
      Open Dialog
    </Button>
  );
};
```

### Error Handling Pattern
```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { Callout } from '@uniformdev/design-system';

const ErrorFallback = ({ error }: { error: Error }) => (
  <Callout type="error" title="Integration Error">
    {error.message}
  </Callout>
);

const IntegrationComponent = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <YourComponent />
  </ErrorBoundary>
);
```

## Custom Edgehancers (Advanced)

Custom edgehancers enable server-side JavaScript execution at the edge for advanced data processing.

### Prerequisites
- Feature must be enabled for your team (contact Uniform)
- Team Admin API key required for deployment

### Hook Types

#### Pre-Request Hook
Modifies HTTP requests before caching.

```typescript
// edgehancer/preRequest.ts
import { PreRequestContext } from '@uniformdev/mesh-sdk';

export default function preRequest(context: PreRequestContext) {
  const { requests } = context;
  
  return requests.map(request => ({
    ...request,
    headers: {
      ...request.headers,
      'Custom-Header': 'value'
    }
  }));
}
```

#### Request Hook
Replaces default HTTP fetch logic.

```typescript
// edgehancer/request.ts
import { RequestContext } from '@uniformdev/mesh-sdk';

export default async function request(context: RequestContext) {
  const { requests } = context;
  
  const responses = await Promise.all(
    requests.map(async (req) => {
      const response = await fetch(req.url, {
        headers: req.headers,
        method: req.method,
        body: req.body
      });
      
      const data = await response.json();
      
      // Transform response data
      return {
        ...data,
        processedAt: new Date().toISOString()
      };
    })
  );
  
  return responses;
}
```

### Deployment
```bash
# Deploy edgehancer
npm run deploy-edgehancer

# Remove edgehancer
npm run remove-edgehancer
```

## Installation and Deployment

> **⚠️ CRITICAL NEXT STEP**: After bootstrapping your integration, you MUST complete the registration and installation process below before you can use your integration in Uniform.

### Required Environment Variables

Before using CLI registration commands, you must set these environment variables:

```bash
# Required for CLI registration and installation
UNIFORM_API_KEY=your_api_key_here
UNIFORM_TEAM_ID=your_team_id_here  
UNIFORM_PROJECT_ID=your_project_id_here
```

### Development Setup and Registration

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Register Integration to Team** (Required First Step)
   ```bash
   # Register the integration definition to your Uniform team
   npm run register-to-team
   ```

3. **Install Integration to Project** (Required Second Step)
   ```bash
   # Install the integration to your specific project
   npm run install-to-project
   ```

### Available npm Scripts

Your integration project includes these essential scripts:

```json
{
  "register-to-team": "uniform integration definition register ./mesh-manifest.json",
  "unregister-from-team": "uniform integration definition remove your-integration-type",
  "install-to-project": "uniform integration install your-integration-type",
  "uninstall-from-project": "uniform integration uninstall your-integration-type"
}
```

### Alternative: Manual Registration via Uniform UI

If you prefer not to use CLI or don't have the environment variables set up:

1. **Add Custom Integration**
   - Go to your Uniform team settings
   - Navigate to "Integrations" section
   - Click "Add Custom Integration"
   - Upload your `mesh-manifest.json` file

2. **Install to Project**
   - Go to your project settings
   - Navigate to "Integrations" section
   - Find your custom integration
   - Click "Install" and configure as needed

### Production Deployment

1. **Deploy to Hosting Provider**
   - Deploy to Vercel, Netlify, or your preferred hosting
   - Ensure your integration is accessible via HTTPS

2. **Update Manifest for Production**
   - Update `baseLocationUrl` in manifest to production URL
   - Re-register the updated manifest:
     ```bash
     npm run register-to-team
     ```

3. **Test Integration**
   - Verify all locations work in production
   - Test integration functionality in Uniform dashboard

## Security Considerations

### API Key Management
- Store sensitive data in integration settings, not in custom public config
- Use `headers` array in data source configuration for authentication
- Never expose API keys in client-side code

### HTTPS Requirements
- All production integrations must use HTTPS
- Local development can use HTTP (localhost only)

### CORS Configuration
- Mesh integration URLs must be accessible to https://uniform.app
- Configure appropriate CORS headers for API endpoints

## Testing Strategies

### Unit Testing Edgehancers
```typescript
// edgehancer/request.test.ts
import { describe, it, expect } from 'vitest';
import request from './request';

describe('request edgehancer', () => {
  it('should transform response data', async () => {
    const mockContext = {
      requests: [{ url: 'https://api.example.com/data' }]
    };
    
    const result = await request(mockContext);
    expect(result[0]).toHaveProperty('processedAt');
  });
});
```

### Integration Testing
- Use "Test Data Type" function in Uniform dashboard
- Test with various data configurations
- Verify error handling and edge cases

## Common Integration Patterns

### CMS Integration
- Data source for API connection configuration
- Content type archetype for different content models
- Field selection in type editor
- Content picker in data editor

### Asset Library Integration
- Search and filter functionality
- Asset transformation to Uniform format
- Metadata preservation
- Download/hotlinking considerations

### Analytics Integration
- Project tool for dashboard embedding
- API proxy for secure data access
- Real-time data updates
- Chart and visualization components

### Custom Parameter Integration
- Specialized input components
- Dynamic token support
- Validation and constraints
- Configuration options

## Required Dependencies

```json
{
  "dependencies": {
    "@uniformdev/mesh-sdk-react": "latest",
    "@uniformdev/design-system": "latest",
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

## File Structure Template

```
your-mesh-integration/
├── pages/
│   ├── _app.tsx
│   ├── settings.tsx
│   ├── data-source-editor.tsx
│   ├── data-type-editor.tsx
│   ├── data-resource-editor.tsx
│   └── parameter-editor.tsx
├── components/
│   └── [custom-components].tsx
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   └── api-client.ts
├── edgehancer/ (optional)
│   ├── preRequest.ts
│   ├── request.ts
│   └── *.test.ts
├── mesh-manifest.json
├── package.json
└── tsconfig.json
```

This documentation provides the complete foundation for building Uniform Mesh integrations. Always refer to the latest Uniform documentation and SDK for any updates to the API or best practices.
