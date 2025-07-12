# Uniform Mesh Integration Overview

## What is Uniform Mesh?

Uniform Mesh is a powerful framework that allows developers to extend the Uniform user interface with custom web applications. These integrations appear as native parts of the Uniform dashboard while running as separate web applications that communicate through iframe messaging.

## Key Benefits

- **Seamless Integration**: Custom functionality appears native within Uniform's interface
- **Flexible Architecture**: Build with any web technology, hosted anywhere accessible to browsers
- **Extensible**: Add custom data connectors, parameter types, asset libraries, and tools
- **Consistent UX**: Use Uniform's design system for cohesive user experience
- **Secure**: Controlled communication through established messaging protocols

## Architecture Overview

### Core Components

1. **Web Application**
   - Next.js application (recommended) with page router
   - Provides custom UI and business logic
   - Communicates with Uniform through React SDK

2. **Manifest File** (`mesh-manifest.json`)
   - JSON configuration defining integration capabilities
   - Specifies locations, URLs, and metadata
   - Registered with Uniform team settings

3. **Location Types**
   - Specific integration points within Uniform's UI
   - Each location has dedicated URL and functionality
   - Supports dialogs and nested interfaces

## Supported Location Types

### 1. Settings Location
- **Purpose**: Integration-wide configuration
- **Access**: Project Settings > Integrations
- **Use Cases**: API keys, connection settings, feature toggles

### 2. Data Connectors
- **Purpose**: Connect external data sources to Uniform
- **Components**:
  - Data Source Editor: Configure connection settings
  - Data Type Editor: Define data structure and fields
  - Data Resource Editor: Select specific data items
- **Use Cases**: CMS content, e-commerce products, external APIs

### 3. Canvas Parameter Types
- **Purpose**: Custom input controls for Canvas components
- **Features**: Custom editors, validation, configuration options
- **Use Cases**: Specialized inputs, custom media selectors, business logic parameters

### 4. Asset Library Integration
- **Purpose**: Extend asset management with external providers
- **Components**:
  - Asset Library: Browse and search external assets
  - Asset Parameter: Select assets within components
- **Use Cases**: Stock photo services, DAM systems, custom media repositories

### 5. Editor Tools
- **Purpose**: Add custom functionality to Canvas and Entry editors
- **Locations**: Composition editor, component patterns, entry editor
- **Use Cases**: Content workflow tools, validation utilities, bulk operations

### 6. Project Tools
- **Purpose**: Add custom tools to project navigation
- **Features**: Dashboard widgets, analytics views, custom reports
- **Use Cases**: Analytics dashboards, content reports, external tool integration

### 7. Personalization Algorithms
- **Purpose**: Custom selection criteria for personalized content
- **Use Cases**: Custom visitor classification, business rule engines

### 8. AI Prompts
- **Purpose**: Custom AI generation workflows
- **Features**: Template prompts, parameter configuration
- **Use Cases**: Content generation, optimization suggestions

## Real-World Examples

### CMS Integration (Content Connector)
```
Examples: WordPress, Contentful, custom CMS
Locations: Data source + type + resource editors
Features: Content selection, field mapping, preview variants
```

### Asset Library Integration
```
Examples: Pexels, Unsplash, internal DAM
Locations: Asset library + parameter editors
Features: Search, filters, metadata preservation
```

### Analytics Integration
```
Examples: Umami, Google Analytics dashboard
Locations: Project tools, dashboard tools
Features: Embedded dashboards, metric visualization
```

### Workflow Tools
```
Examples: Jira integration, approval workflows
Locations: Canvas editor tools
Features: Comment systems, status tracking, notifications
```

### Custom Parameters
```
Examples: Rich text editors, specialized inputs
Locations: Canvas parameter types
Features: Custom validation, dynamic token support
```

## Technology Requirements

### Mandatory
- **Framework**: Next.js with page router (recommended)
- **SDK**: `@uniformdev/mesh-sdk-react`
- **Design System**: `@uniformdev/design-system`
- **Language**: TypeScript (strongly recommended)

### Optional Enhancements
- **Custom Edgehancers**: Server-side JavaScript execution at edge
- **Dialog Management**: Modal interfaces and nested workflows
- **Validation Framework**: Custom validation logic and error handling

## Development Workflow

### Initial Setup
1. Run `npx @uniformdev/cli@latest new-integration`
2. Configure environment variables (API keys, team/project IDs)
3. Develop integration pages and components
4. Test locally on `localhost:9000`

### Registration and Installation
1. Register manifest with Uniform team
2. Install integration on specific projects
3. Configure integration settings
4. Deploy to production hosting

### Production Deployment
1. Deploy to hosting provider (Vercel, Netlify, etc.)
2. Update manifest with production URLs
3. Re-register updated manifest
4. Test production functionality

## Security and Best Practices

### Security
- Use HTTPS for all production integrations
- Store sensitive data in integration settings (not public config)
- Configure appropriate CORS headers
- Validate all user inputs

### Performance
- Implement proper error boundaries
- Use loading states for async operations
- Optimize asset loading and caching
- Minimize bundle size

### UX Consistency
- Follow Uniform's design system guidelines
- Implement proper validation feedback
- Use consistent interaction patterns
- Provide clear error messages

## Common Integration Patterns

### Data Integration Pattern
1. **Data Source**: Configure API connection
2. **Data Type**: Define data structure and fields
3. **Data Resource**: Enable content selection
4. **Optional**: Custom edgehancers for data processing

### UI Extension Pattern
1. **Parameter Types**: Custom input components
2. **Editor Tools**: Workflow and utility functions
3. **Project Tools**: Dashboard and reporting interfaces
4. **Asset Library**: External media integration

### Advanced Pattern
1. **Custom Edgehancers**: Server-side data processing
2. **Personalization**: Custom audience algorithms
3. **AI Integration**: Content generation workflows
4. **Multi-location**: Complex integrations spanning multiple locations

## Limitations and Considerations

### Technical Limits
- Custom edgehancers: 100ms CPU time limit
- Browser compatibility: Must work within iframe context
- Network access: Integration URLs must be accessible to browsers

### Deployment Considerations
- Hosting requirements: Public accessibility to https://uniform.app
- SSL certificates: Required for production deployments
- CORS configuration: Proper headers for cross-origin requests

### Development Constraints
- Framework compatibility: Optimized for React/Next.js
- Communication protocol: Limited to iframe messaging
- UI consistency: Must follow Uniform design system

## Getting Started Checklist

### Prerequisites
- [ ] Uniform team and project access
- [ ] Node.js development environment
- [ ] Understanding of React/Next.js
- [ ] External system API access (if applicable)

### Development Steps
- [ ] Run integration creation command
- [ ] Set up local development environment
- [ ] Implement required location pages
- [ ] Test locally with Uniform dashboard
- [ ] Configure production deployment
- [ ] Register and install integration

### Production Readiness
- [ ] HTTPS deployment configured
- [ ] Error handling implemented
- [ ] Security best practices followed
- [ ] User documentation created
- [ ] Testing completed across use cases

## Support and Resources

### Documentation
- [Uniform Mesh SDK Documentation](https://sdk.uniform.app/mesh-sdk-react)
- [Design System Storybook](https://design.uniform.app/)
- [Integration Examples Repository](https://github.com/uniformdev/examples/tree/main/mesh)

### Tools and Utilities
- Uniform CLI for integration management
- Development examples and templates
- TypeScript definitions and IntelliSense support

This overview provides developers with a comprehensive understanding of Uniform Mesh capabilities and how to leverage them for extending Uniform's functionality with custom integrations.
