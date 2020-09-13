import { ProductSuggestion } from './types/product';

export function findSimilarProduct(sku: number): ProductSuggestion | null {
  if (sku === 1) {
    return {
      skuId: 1,
      suggestions: [
        {
          id: 2,
          name: 'Outro produto',
          url: 'https://minhaloja.com.br/outroproduto',
          imageUrl: 'https://minhaloja.com.br/assets/outroproduto.jpg',
        },
      ],
      createdAt: new Date(),
      ttl: 3600,
    };
  }

  return null;
}
