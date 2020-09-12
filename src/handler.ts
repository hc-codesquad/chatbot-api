import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  parseBotRequest,
  sendDefaultErrorMessage,
  sendDefaultMessage,
} from './botRequest';
import { ChatRequest, ChatResponse } from './types/chat';

const chatbot: APIGatewayProxyHandler = async (event) => {
  let response: ChatResponse;

  try {
    const body = JSON.parse(event.body);

    const chatRequest: ChatRequest = parseBotRequest(body);

    const { chatId, text } = chatRequest;

    console.log('ChatID: ', chatId, 'text: ', text);

    if (!text) {
      response = sendDefaultMessage();
    } else {
      response = {
        message: {
          text:
            'Ok, vou procurar aqui as melhores sugestões para você, só um minuto',
        },
      };
    }
  } catch (e) {
    console.error('Bot error', e);

    response = sendDefaultErrorMessage();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response, null, 2),
  };
};

export { chatbot };