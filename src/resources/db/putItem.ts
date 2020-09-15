import { ddbClient } from './ddb';

export function putItem(params) {
  return ddbClient.put(params).promise();
}
