export interface AkeneoProduct {
  identifier: string;
  enabled: boolean;
  family: string | null;
  categories: string[];
  groups: string[];
  parent: string | null;
  values: {
    [attributeCode: string]: Array<{
      locale?: string | null;
      scope?: string | null;
      data: any;
    }>;
  };
  associations: {
    [associationType: string]: {
      products?: string[];
      product_models?: string[];
      groups?: string[];
    };
  };
  quantified_associations: {
    [associationType: string]: {
      products?: Array<{
        identifier: string;
        quantity: number;
      }>;
      product_models?: Array<{
        identifier: string;
        quantity: number;
      }>;
    };
  };
  created: string;
  updated: string;
  metadata?: {
    workflow_status?: string;
  };
}

export interface AkeneoProductsResponse {
  _links: {
    self: {
      href: string;
    };
    first: {
      href: string;
    };
    previous?: {
      href: string;
    };
    next?: {
      href: string;
    };
  };
  current_page: number;
  _embedded: {
    items: AkeneoProduct[];
  };
}

// Simplified product interface for UI display
export interface Product {
  identifier: string;
  title: string;
  description?: string;
  family?: string;
  enabled: boolean;
  categories: string[];
  imageUrl?: string;
}