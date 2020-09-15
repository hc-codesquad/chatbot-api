import { getItem } from './resources/db/getItem';
import { putItem } from './resources/db/putItem';
import { ProductSuggestion } from './types/product';

export async function getSuggestionBySkuId(skuId: string): Promise<ProductSuggestion> {
  const chat = await getItem({
    TableName: process.env.DYNAMODB_PRODUCT_SUGGESTIONS_TABLE,
    Key: {
      skuId,
    },
  });

  return chat;
}

export function putSuggestion(suggestion: ProductSuggestion): Promise<any> {
  return putItem({
    TableName: process.env.DYNAMODB_PRODUCT_SUGGESTIONS_TABLE,
    Item: suggestion,
  });
}
