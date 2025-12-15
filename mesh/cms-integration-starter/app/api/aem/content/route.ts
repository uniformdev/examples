import { NextRequest, NextResponse } from 'next/server';
import {
  fullPageContent,
  componentDataMap,
  quickLinksCarouselData,
  editorialCardsData,
  popularCategoriesData,
  sustainabilitySectionData,
  productCategoryGridData,
  interestCategoriesData,
  valuePropositionsData,
} from '../../../../data/aem-content';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=60, s-maxage=60',
};

// Helper to check if a value matches the search term
function matchesSearch(value: unknown, searchTerm: string): boolean {
  if (typeof value === 'string') {
    return value.toLowerCase().includes(searchTerm.toLowerCase());
  }
  if (Array.isArray(value)) {
    return value.some((item) => matchesSearch(item, searchTerm));
  }
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some((v) => matchesSearch(v, searchTerm));
  }
  return false;
}

// Filter component data by search term
function filterBySearch(data: unknown, searchTerm: string): boolean {
  return matchesSearch(data, searchTerm);
}

/**
 * Mock AEM Content Services API
 * 
 * Simulates AEM Content Fragments / Content Services JSON Exporter format
 * 
 * Usage:
 * - GET /api/aem/content              - Full page content
 * - GET /api/aem/content?component=herobanner  - Single component data
 * - GET /api/aem/content?component=herobanner&index=0 - Component with index for arrays
 * - GET /api/aem/content?path=/home   - Content by path (returns full page)
 * - GET /api/aem/content?search=keyword - Search across all components
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const component = searchParams.get('component');
    const index = searchParams.get('index');
    const path = searchParams.get('path');
    const search = searchParams.get('search');

    // If a specific component is requested
    if (component) {
      const componentKey = component.toLowerCase();
      const componentData = componentDataMap[componentKey];

      if (!componentData) {
        return NextResponse.json(
          { 
            error: 'Component not found',
            availableComponents: Object.keys(componentDataMap),
          },
          { status: 404, headers: corsHeaders }
        );
      }

      // Handle index for components with child arrays
      if (index !== null) {
        const indexNum = parseInt(index, 10);
        
        // Get items array based on component type
        let items: unknown[] | undefined;
        
        switch (componentKey) {
          case 'quicklinkscarousel':
            items = quickLinksCarouselData.items;
            break;
          case 'editorialcards':
            items = editorialCardsData.cards;
            break;
          case 'popularcategories':
            items = popularCategoriesData.cards;
            break;
          case 'sustainabilitysection':
            items = sustainabilitySectionData.cards;
            break;
          case 'productcategorygrid':
            items = productCategoryGridData.categories;
            break;
          case 'interestcategories':
            items = interestCategoriesData.cards;
            break;
          case 'valuepropositions':
            items = valuePropositionsData.propositions;
            break;
        }

        if (items && !isNaN(indexNum) && indexNum >= 0 && indexNum < items.length) {
          return NextResponse.json(items[indexNum], { headers: corsHeaders });
        }

        if (items) {
          return NextResponse.json(
            { 
              error: 'Index out of bounds',
              availableIndices: items.length,
            },
            { status: 404, headers: corsHeaders }
          );
        }
      }

      return NextResponse.json(componentData, { headers: corsHeaders });
    }

    // If search is specified, search across all components
    if (search) {
      const results: Record<string, unknown> = {};
      
      for (const [key, data] of Object.entries(componentDataMap)) {
        if (filterBySearch(data, search)) {
          results[key] = data;
        }
      }

      // Return as :items format for consistency
      return NextResponse.json(
        {
          ':path': '/content/logitech/en-us/search',
          ':type': 'logitech/components/searchresults',
          'jcr:title': `Search Results: ${search}`,
          ':items': results,
        },
        { headers: corsHeaders }
      );
    }

    // If path is specified, return full page (we only have /home for now)
    if (path) {
      // Normalize path
      const normalizedPath = path === '/' || path === '/home' ? '/content/logitech/en-us/home' : path;
      
      if (normalizedPath === '/content/logitech/en-us/home' || normalizedPath === '/home' || normalizedPath === '/') {
        return NextResponse.json(fullPageContent, { headers: corsHeaders });
      }

      return NextResponse.json(
        { 
          error: 'Path not found',
          requestedPath: path,
          availablePaths: ['/home', '/', '/content/logitech/en-us/home'],
        },
        { status: 404, headers: corsHeaders }
      );
    }

    // Return full page content by default
    return NextResponse.json(fullPageContent, { headers: corsHeaders });
  } catch (error) {
    console.error('[alex] Error in AEM content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

