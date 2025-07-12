# Jira Integration for Uniform

A sample Uniform Mesh integration that extends the Uniform Canvas editor with Jira functionality, allowing content creators to track and manage composition reviews through Jira issues and comments.

## Overview

This integration demonstrates how to build a custom Uniform Mesh integration that connects Uniform compositions with Jira for review workflows. It provides editor tools that display Jira issue comments directly within the Uniform Canvas editor interface.

## Features

- **Canvas Editor Tools**: Custom tools that display within the Uniform Canvas editor
- **Jira Comments Display**: View Jira issue comments associated with Uniform compositions
- **Automatic Issue Creation**: Create Jira issues when compositions enter review workflow
- **Real-time Comment Sync**: Fetch and display comments from linked Jira issues
- **Custom Field Mapping**: Link compositions to Jira issues using custom fields

## Architecture

### Core Components

- **Canvas Editor Tools** (`pages/canvas-editor-tools.tsx`): Main interface displayed within Uniform Canvas editor
- **Jira Comments Component** (`components/JiraComments.tsx`): Renders Jira comments with user avatars and timestamps
- **API Routes**:
  - `pages/api/get-issue-comments.ts`: Fetches comments for a composition's linked Jira issue
  - `pages/api/create-jira-issue.ts`: Creates new Jira issues for composition reviews
- **Utilities** (`utils/jira.ts`): Core Jira API interaction functions

### Integration Flow

1. When a composition enters review workflow, a webhook triggers Jira issue creation
2. The issue is linked to the composition via a custom field containing the composition ID
3. Editor tools in the Canvas display comments from the linked Jira issue
4. Comments are fetched in real-time when the editor tools are opened

## Setup

### Prerequisites

- Node.js 18+
- Jira Cloud instance with API access
- Uniform project with Mesh integration capabilities

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Jira Configuration
JIRA_BASE_URL=https://your-domain.atlassian.net
ATLASSIAN_EMAIL=your-email@domain.com
ATLASSIAN_ACCESS_TOKEN=your_api_token
ATLASSIAN_PROJECT_KEY=YOUR_PROJECT_KEY

# Custom Field IDs
JIRA_CUSTOM_FIELD_ID=customfield_10038
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Register the integration with your Uniform team:
   ```bash
   npm run register-to-team
   ```

4. Install the integration to your Uniform project:
   ```bash
   npm run install-to-project
   ```

## Configuration

### Jira Setup

1. Create custom fields in your Jira project:
   - External ID field (to store composition ID)
   - Preview URL field (optional, for composition preview links)

2. Generate an API token in Atlassian Account Settings

3. Configure the custom field IDs in your environment variables

### Uniform Configuration

The integration is configured via `mesh-manifest.json`:

```json
{
  "type": "jira",
  "displayName": "Jira",
  "baseLocationUrl": "http://localhost:9000",
  "locations": {
    "canvas": {
      "editorTools": {
        "composition": {
          "url": "/canvas-editor-tools"
        }
      }
    }
  }
}
```

## Usage

1. **Viewing Comments**: Open any composition in the Uniform Canvas editor. If there's a linked Jira issue, comments will appear in the editor tools panel.

2. **Creating Issues**: Set up webhooks to trigger issue creation when compositions enter review states.

3. **Managing Reviews**: Use Jira's native commenting and workflow features to manage composition reviews.

## API Reference

### GET `/api/get-issue-comments`

Fetches comments for a composition's linked Jira issue.

**Parameters:**
- `compositionId` (query): The Uniform composition ID

**Response:**
- Array of Jira comment objects with author, content, and timestamp information

### POST `/api/create-jira-issue`

Creates a new Jira issue for composition review.

**Body:**
- Uniform webhook payload containing composition and initiator information

**Response:**
- Created Jira issue object

## Development

### Project Structure

```
├── components/
│   └── JiraComments.tsx          # Comment display component
├── pages/
│   ├── api/
│   │   ├── create-jira-issue.ts   # Issue creation endpoint
│   │   └── get-issue-comments.ts  # Comment fetching endpoint
│   ├── canvas-editor-tools.tsx    # Main editor tools interface
│   └── index.tsx                  # Integration settings page
├── types/
│   └── jira.ts                    # TypeScript type definitions
├── utils/
│   └── jira.ts                    # Jira API utilities
└── mesh-manifest.json             # Integration configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run register-to-team` - Register integration with Uniform team
- `npm run install-to-project` - Install integration to Uniform project

## Customization

This integration can be extended to support:

- Additional Jira issue types and workflows
- Custom comment formatting and rich text support
- Issue creation from within the Canvas editor
- Integration with other Atlassian products
- Advanced filtering and search capabilities

## Contributing

This is a sample integration provided for educational purposes. Feel free to fork and modify for your specific use case.
