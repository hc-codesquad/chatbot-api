import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  parseBotRequest,
  sendDefaultErrorMessage,
  sendDefaultMessage,
} from './botRequest';
import { parseUserMessage } from './parseUserMessage';
import { Chat, ChatRequest, ChatResponse } from './types/chat';

const chatbot: APIGatewayProxyHandler = async (event) => {
  let response: ChatResponse;

  try {
    const body = JSON.parse(event.body);

    const chatRequest: ChatRequest = parseBotRequest(body);

    const { chatId, text } = chatRequest;

    console.log('ChatID: ', chatId, 'text: ', text);

    const chat: Chat = {
      id: chatId,
      context: {},
    }

    if (!text) {
      response = sendDefaultMessage();
    } else {
      const parse = parseUserMessage(text, chat);

      console.log('parseUserMessage', parse);

      if (parse) {
        // @TODO grava chat no DB
        response = parse.response;
      } else {
        response = {
          message: {
            text:
              'Ok, vou procurar aqui as melhores sugestões para você, só um minuto',
          },
        };
      }
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
