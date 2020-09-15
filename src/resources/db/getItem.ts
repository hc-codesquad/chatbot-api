import { ddbClient } from './ddb';

export async function getItem(params) {
  const result = await ddbClient.get(params).promise();
  return result.Item;
}
