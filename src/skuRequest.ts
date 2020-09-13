import { ProductSuggestion, Sku } from './types/product';

async function getSkuId(sku):Sku {
  const url = `https://hiringcoders13.myvtex.com/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;

  const response = await fetch(url, {
    headers: {
      "x-vtex-api-apptoken": "SLLNRWDRPRHLMPRJZFLFOGNGLFNQUNKYAIZHMEXHUZOUFGGBOZZZRFBLYFBLINXBHJKEQJWUIEKPSSAFZMBVNLGUGNIHCLYHCMNWVCLECEQNVMTFFVMWLBOWDQXCAPSX",
      "x-vtex-api-appkey": "vtexappkey-hiringcoders13-FCQFKD"
    }
  })
  const skuItem = await response.json()
  return { id: skuItem.id, name: skuItem.nameComplete, url: skuItem.DetailUrl, imageUrl: skuItem.ImageUrl };
}


export async function getSkuProduct(sku): Promise<ProductSuggestion> {

  const sku1: Sku = getSkuId(sku) 

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