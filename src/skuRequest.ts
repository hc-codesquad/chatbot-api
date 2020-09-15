import fetch from 'node-fetch';
import { getSuggestionBySkuId, putSuggestion } from './productSuggestionsUtils';
import { ProductSuggestion, Sku } from './types/product';
import { putItem } from './resources/db/putItem';

async function getSkuId(sku): Promise<Sku> {
  const url = `${process.env.VTEX_API_BASE_URL}/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;

  const response = await fetch(url, {
    headers: {
      'x-vtex-api-apptoken': process.env.VTEX_API_APP_TOKEN,
      'x-vtex-api-appkey': process.env.VTEX_API_APP_KEY,
    },
  });
  const skuItem = await response.json();
  console.log(putItem(skuItem));
  return {
    id: skuItem.Id,
    name: skuItem.SkuName,
    nameComplete: skuItem.NameComplete,
    url: skuItem.DetailUrl,
    imageUrl: skuItem?.Images[0]?.ImageUrl || skuItem.ImageUrl,
  };
}

async function listAllSkus(): Promise<[]> {
  const url = `${process.env.VTEX_STORE_STABLE_BASE_URL}/api/catalog_system/pvt/sku/stockkeepingunitids?page=1&pagesize=25`
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
  const storedSuggestion = await getSuggestionBySkuId(sku);
  if (storedSuggestion) {
    return storedSuggestion;
  }

  const skuRecebido: Sku = await getSkuId(sku);
  const skus = <number[]>await listAllSkus();

  const similarProducts = await Promise.all(
    skus.map(async id => {
      const currentSku = await getSkuId(id);
      if (id !== skuRecebido.id && currentSku.name === skuRecebido.name) {
        return currentSku;
      }
    }),
  );

  const products = {
    id: sku,
    skus: similarProducts.filter(s => s),
  };

  const suggestion: ProductSuggestion = {
    skuId: products.id,
    suggestions: products.skus,
    createdAt: new Date().toISOString(),
    ttl: 3000,
  };

  await putSuggestion(suggestion);

  return suggestion;
}

export async function addToProductToCart(sku: string, quantity: string): Promise<string> {
  return `${process.env.VTEX_STORE_BETA_BASE_URL}/checkout/cart/add/?sku=${sku}&qty=${quantity}&seller=1&sc=1`;
}

export async function putSkusSuggestions() {
  const skus = <number[]>await listAllSkus();
  skus.forEach(async id => {
    await getSkuProduct(id);
  });
}
