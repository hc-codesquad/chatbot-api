import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const chatbot: APIGatewayProxyHandler = async (_context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Olá, eu sou seu atendente virtual, em que posso ajudá-lo?'
    }, null, 2),
  };
}
