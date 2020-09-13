import { ProductSuggestion, Sku } from './types/product';


export async function getSkuProduct(sku): Promise<ProductSuggestion> {

  const url = `https://hiringcoders13.myvtex.com/api/catalog_system/pvt/sku/stockkeepingunitbyid/${sku}`;

  const response = await fetch(url, {
    headers: {
      "x-vtex-api-apptoken": "SLLNRWDRPRHLMPRJZFLFOGNGLFNQUNKYAIZHMEXHUZOUFGGBOZZZRFBLYFBLINXBHJKEQJWUIEKPSSAFZMBVNLGUGNIHCLYHCMNWVCLECEQNVMTFFVMWLBOWDQXCAPSX",
      "x-vtex-api-appkey": "vtexappkey-hiringcoders13-FCQFKD"
    }
  })

  const skuItem = await response.json();

  const sku1: Sku = { id: skuItem.id, name: skuItem.nameComplete, url: skuItem.DetailUrl, imageUrl: skuItem.ImageUrl }

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