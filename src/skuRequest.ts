import { ProductSuggestion, Sku } from './types/product';

async function getSkuId(sku): Sku {
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

async function listAllSkus(): Promise<[]> {
  const url = `https://hiringcoders13.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitids?page=1&pagesize=50`
  const listSkus = await fetch(url, {
    headers: {
      "x-vtex-api-apptoken": "SLLNRWDRPRHLMPRJZFLFOGNGLFNQUNKYAIZHMEXHUZOUFGGBOZZZRFBLYFBLINXBHJKEQJWUIEKPSSAFZMBVNLGUGNIHCLYHCMNWVCLECEQNVMTFFVMWLBOWDQXCAPSX",
      "x-vtex-api-appkey": "vtexappkey-hiringcoders13-FCQFKD"
    }
  })

  const response = await listSkus.json()
  return response;
}

export async function getSkuProduct(sku): Promise<ProductSuggestion> {

  const skuRecebido: Sku = getSkuId(sku);
  let skusSimilares = []
  console.log(await listAllSkus());
  const arraySkusSimilares = await listAllSkus().map(id => {
    if (id != skuRecebido.id) {
      skusSimilares.push(await getSkuId(id))
    }); 

  const products = {
    number: 1,
    skus: skusSimilares
  }

  return {
    skuId: products.number,
    suggestions: products.skus,
    createdAt: new Date(),
    ttl: 3000
  };
}