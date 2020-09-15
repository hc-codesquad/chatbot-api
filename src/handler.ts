import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  parseBotRequest,
  sendDefaultErrorMessage,
  sendDefaultMessage,
} from './botRequest';
import { generateChatId, getChatById, putChat } from './chatUtils';
import { parseUserMessage } from './parseUserMessage';
import { Chat, ChatRequest, ChatResponse } from './types/chat';

const chatbot: APIGatewayProxyHandler = async (event) => {
  let response: ChatResponse;
  let chatId: string;
  let text: string;

  try {
    const body = JSON.parse(event.body);

    const chatRequest: ChatRequest = parseBotRequest(body);

    chatId = chatRequest?.chatId;
    text = chatRequest?.text;

    console.log('ChatID: ', chatId, 'text: ', text);
  } catch (e) {
    console.error('Error when parsing bot request', e);

    if (!chatId) {
      chatId = generateChatId();
    }
  }

  try {
    let chat = await getChatById(chatId);

    if (!chat) {
      chat = {
        id: chatId,
        context: {},
      };
    }

    if (!text) {
      response = sendDefaultMessage();
    } else {
      const parse = await parseUserMessage(text, chat);

      console.log('parseUserMessage', parse);

      if (parse) {
        // @TODO grava chat no DB
        await putChat(chat);

        response = parse.response;
      } else {
        response = {
          chatId,
          message: {
            text:
              'Ok, vou procurar aqui as melhores sugestões para você, só um minuto',
          },
        };
      }
    }
  } catch (e) {
    console.error('Bot error', e);

    response = sendDefaultErrorMessage(chatId);
  }

  response.chatId = chatId;

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(response, null, 2),
  };
};

export { chatbot };
