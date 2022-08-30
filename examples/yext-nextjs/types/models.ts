export interface Product {
  brand: string;
  savedFilters?: string[] | null;
  price: Price;
  primaryPhoto: PrimaryPhoto;
  richTextDescription: string;
  sku: string;
  name: string;
  meta: Meta;
}
export interface Price {
  value: string;
  currencyCode: string;
}
export interface PrimaryPhoto {
  image: Image;
}
export interface Image {
  url: string;
  width: number;
  height: number;
  sourceUrl: string;
  thumbnails?: ThumbnailsEntity[] | null;
}
export interface ThumbnailsEntity {
  url: string;
  width: number;
  height: number;
}
export interface Meta {
  accountId: string;
  uid: string;
  id: string;
  timestamp: string;
  folderId: string;
  language: string;
  countryCode: string;
  entityType: string;
}
