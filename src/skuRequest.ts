import { ProductSuggestion, Sku } from './types/product';


export function getSkuProduct(sku): ProductSuggestion {
  const sku1: Sku = { id: sku, name: 'Camisa', url: "http://camisa", imageUrl: "http//" }

  const products = {
    number: 1,
    skus: [sku1]
  }

  return {
    skuId: products.number,
    suggestions: products.skus,
    createdAt: new Date(),
    ttl: 3000
  };
}