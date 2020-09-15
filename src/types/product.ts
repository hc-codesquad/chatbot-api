export interface Sku {
  id: number;
  name: string;
  nameComplete?: string;
  url: string;
  imageUrl?: string;
}

export interface ProductSuggestion {
  skuId: number;
  suggestions: Sku[];
  createdAt: string;
  ttl: number;
}
