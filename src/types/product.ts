export interface Sku {
  id: number;
  name: string;
  url: string;
  imageUrl?: string;
}

export interface ProductSuggestion {
  skuId: number;
  suggestions: Sku[];
  createdAt: Date;
  ttl: number;
}
