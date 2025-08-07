# Product Search Improvements

## Overview

The search functionality for products has been enhanced to use proper server-side full-text search using the Akeneo API, replacing the previous client-side only filtering approach.

## What was Fixed

### Before
- Search input was not working properly (input field was not accepting any input)
- Only client-side filtering was available
- Limited search capability (identifier only in some cases)
- No proper full-text search

### After
- **Fixed search input field** - now properly accepts user input
- **Fixed API key access** - now uses built-in authentication via getDataResource
- **Fixed search syntax errors** - now uses only supported Akeneo API operators
- **Added search debouncing** - waits 500ms after user stops typing before searching
- **Server-side identifier search** using Akeneo API with proper range operators
- **Better performance** for large product catalogs
- **Fallback mechanism** to client-side search if server search fails
- **Proper error handling** with user feedback

## How it Works

### 1. Server-side Search via getDataResource

The server-side search now uses the built-in `getDataResource` function with proper Akeneo API syntax:
- **Leverages existing authentication** - no need to extract API keys manually
- **Uses only supported Akeneo operators** - avoids 422 "operator not supported" errors
- **Full-text search** across multiple product fields:
  - **Description**: Uses `CONTAINS` operator for broad text matching
  - **Name**: Uses `STARTS_WITH` operator for precise name matching  
  - **Short Description**: Uses `CONTAINS` operator for additional coverage
  - All searches use `ecommerce` scope by default
  - Supports `search_locale` parameter for localized search
- **Debounced search** - waits 500ms after user stops typing
- Handles category filtering
- Returns properly transformed product data
- **More secure** - credentials are handled internally by the Mesh SDK

#### Search API Format

The search uses the following Akeneo API syntax:

```
/api/rest/v1/products-uuid?search={"description":[{"operator":"CONTAINS","value":"searchterm","scope":"ecommerce"}],"name":[{"operator":"STARTS_WITH","value":"searchterm","scope":"ecommerce"}]}&search_locale=en_US
```

This searches across multiple fields simultaneously:
- `description` with `CONTAINS` for broad matching
- `name` with `STARTS_WITH` for precise name matching  
- `short_description` with `CONTAINS` for additional coverage
- Uses `search_locale` parameter for localized content

### 2. Enhanced ProductSelector Component

The ProductSelector component now supports:
- **Server-side search toggle**: `enableServerSearch` prop
- **Automatic fallback**: Falls back to client-side search if server search fails
- **Loading states**: Shows spinner during server searches
- **Error handling**: Displays search errors with fallback message
- **Search result caching**: Maintains results between UI interactions
- **Hierarchical category filtering**: Enhanced category support with proper API integration

#### Hierarchical Category Selector

The category selector has been completely redesigned:

- **Fetches full category data** from [Akeneo Categories API](https://api.akeneo.com/api-reference.html#get_categories) with labels and hierarchy
- **Displays user-friendly labels** instead of technical codes
- **Builds proper hierarchy** using parent-child relationships from the API
- **Groups categories** using InputComboBox grouped options:
  - Root categories without children appear as indented ungrouped options
  - Root categories with children appear as expandable groups
  - Child categories appear under their parent groups
- **Filters out "master" categories** automatically (they're hidden from the interface)
- **Maintains filtering functionality** by preserving category codes as values

**API Integration:**
```javascript
// Fetches from /api/rest/v1/categories endpoint
// Returns full category objects with:
{
  code: "category_code",        // Used for filtering
  labels: { en_US: "Display Name" }, // Used for display
  parent: "parent_code",        // Used for hierarchy
  label: "Display Name"         // Resolved display label
}
```

### 3. Updated Data Editors

Both single and multi-product data editors now:
- Enable server-side search by default
- Pass API credentials from data source configuration
- Handle search results properly
- Maintain backward compatibility

## Usage

### For Developers

The server-side search is automatically enabled when:
1. `enableServerSearch={true}` is set on ProductSelector
2. `apiUrl` and `apiKey` are provided (from data source configuration)
3. The `/api/search-products` endpoint is available

### Search Behavior

1. **Text Search**:
   - If `searchCriteria="identifier"`: Searches product identifiers
   - If `searchCriteria="title"`: Searches name and description fields
   - Uses `CONTAINS` operator for partial matches
   - Supports locale-specific search

2. **Category Filtering**:
   - Uses `IN` operator for multiple category selection
   - Combines with text search using AND logic

3. **Fallback Logic**:
   - Attempts server-side search first
   - Falls back to existing client-side logic on failure
   - Shows error messages to users when needed

## Configuration

### Data Source Setup

Ensure your Akeneo data source includes:
- `apiUrl`: Your Akeneo PIM API URL
- `apiKey`: Valid API token with read permissions

### Component Props

```tsx
<ProductSelector
  enableServerSearch={true}
  apiUrl={metadata.dataSource.apiUrl}
  apiKey={metadata.dataSource.apiKey}
  searchCriteria="identifier" // or "title"
  // ... other props
/>
```

## Troubleshooting

### Common Issues and Solutions

**Issue**: Getting 422 "operator not supported" errors
- **Cause**: Using unsupported operators for specific fields
- **Solution**: Now uses text fields (description, name) that support CONTAINS and STARTS_WITH operators

**Issue**: Search returns empty results
- **Cause**: No products match the search criteria in the selected fields
- **Solution**: Search now covers multiple fields (name, description, short_description) for better coverage

**Issue**: Search is too slow
- **Cause**: Making too many API calls without debouncing
- **Solution**: Debouncing is implemented (500ms delay)

### Testing the Search

To test the search functionality:

1. **Text search**: Enter any product name or description text (e.g., "shoes", "blue", "cotton")
2. **Partial matching**: Search works with partial words and phrases
3. **Category filtering**: Select categories to narrow results  
4. **Locale filtering**: Change locales to see localized content

### Example Search Queries

- `"Amazing"` - Finds products with names starting with "Amazing" or descriptions containing "Amazing"
- `"shoes"` - Finds all products mentioning "shoes" in name or description
- `"cotton shirt"` - Finds products with both "cotton" and "shirt" in their content

### Example Category Hierarchy Display

The category selector now displays categories in a hierarchical grouped format:

```
┌─ Ungrouped Categories (indented)
├─ Single Category Item
│
├─ Clothing & Footwear ▼
│  ├─ Workwear
│  ├─ Outerwear  
│  └─ Work Hoodies & Sweatshirts
│
└─ Electronics ▼
   ├─ Computers
   ├─ Mobile Devices
   └─ Accessories
```

Instead of showing technical codes like `master_clothing_footwear_workwear_outerwear_work_hoodies_sweatshirts`, users now see friendly labels like "Work Hoodies & Sweatshirts" grouped under "Clothing & Footwear".

## Performance Benefits

- **Reduced API calls**: Debouncing prevents excessive requests
- **Smart fallback**: Uses server search when beneficial, client search when necessary
- **Better scalability**: Works efficiently with large product catalogs
- **Faster response times**: Proper loading indicators and error handling
- **No more 422 errors**: Only uses supported Akeneo API operators

## Error Handling

The system includes comprehensive error handling:
- Network errors are caught and displayed
- API errors show meaningful messages
- Automatic fallback prevents functionality loss
- Loading states provide user feedback

## Future Enhancements

Potential improvements for future releases:
- Advanced search operators (exact match, regex, etc.)
- Search result highlighting
- Search history and suggestions
- Elasticsearch integration for even better search performance
- Custom attribute search support
