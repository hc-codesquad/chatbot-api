import fetch from 'node-fetch';
import { ProductSuggestion, Sku } from './types/product';

async function getSkuId(sku): Promise<Sku> {
  const url = `${process.env.VTEX_API_BASE_URL}/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;

  const response = await fetch(url, {
    headers: {
      'x-vtex-api-apptoken': process.env.VTEX_API_APP_TOKEN,
      'x-vtex-api-appkey': process.env.VTEX_API_APP_KEY,
    },
  });
  const skuItem = await response.json();
  return {
    id: skuItem.Id,
    name: skuItem.SkuName,
    url: skuItem.DetailUrl,
    imageUrl: skuItem.ImageUrl,
  };
}

async function listAllSkus(): Promise<[]> {
  const url = `${process.env.VTEX_STORE_STABLE_BASE_URL}/api/catalog_system/pvt/sku/stockkeepingunitids?page=1&pagesize=50`
  const listSkus = await fetch(url, {
    headers: {
      'x-vtex-api-apptoken': process.env.VTEX_API_APP_TOKEN,
      'x-vtex-api-appkey': process.env.VTEX_API_APP_KEY,
    },
  });

  const response = await listSkus.json();
  return response;
}

export async function getSkuProduct(sku): Promise<ProductSuggestion> {

  const skuRecebido: Sku = await getSkuId(sku);
  const skus = <number[]>await listAllSkus();

  const similarProducts = await Promise.all(
    skus.map(async id => {
      const sku = await getSkuId(id);
      if (id !== skuRecebido.id && sku.name === skuRecebido.name) {
        return sku;
      }
    }),
  );

  const products = {
    id: 1,
    skus: similarProducts.filter(sku => sku)
  }

  return {
    skuId: products.id,
    suggestions: products.skus,
    createdAt: new Date(),
    ttl: 3000,
  };
}

export async function addToProductToCart(sku: string, quantity: string): Promise<string> {
  return `${process.env.VTEX_STORE_BETA_BASE_URL}/checkout/cart/add/?sku=${sku}&qty=${quantity}&seller=1&sc=1`;
}
