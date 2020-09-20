import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  parseBotRequest,
  sendDefaultErrorMessage,
  sendDefaultMessage,
} from './botRequest';
import { parseBillingAddress, parseBuyerRequest, parseCardRequest, parseExpirationRequest, parseItemsRequest, parseMiniCartRequest, parsePaymentRequest, parseShippingaddressRequest, successApproved } from './paymentRequest'
import { generateChatId, getChatById, putChat } from './chatUtils';
import { parseUserMessage } from './parseUserMessage';
import { Chat, ChatRequest, ChatResponse } from './types/chat';
import { Payment } from './types/payment';

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

const paymentMethods: APIGatewayProxyHandler = async (event) => {
  const methods = {
    "paymentMethods": [
      "Visa",
      "Mastercard",
      "American Express",
      "BankInvoice",
      "Privatelabels",
      "Promissories"
    ]
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(methods, null, 2),
  };
}

const payments: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body);
  const expiration = parseExpirationRequest(body.card.expiration)
  const card = parseCardRequest(body.card, expiration);
  const buyer = parseBuyerRequest(body.miniCart.buyer);
  const shippingAddress = parseShippingaddressRequest(body.miniCart.shippingAddress);
  const billingAddress = parseBillingAddress(body.miniCart.billingAddress);
  const items = parseItemsRequest(body.miniCart.items);
  const miniCart = parseMiniCartRequest(body.miniCart, buyer, shippingAddress, billingAddress, items)
  const paymentRequest: Payment = parsePaymentRequest(body, card, miniCart);
  const approved = successApproved();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ ...paymentRequest, approved }, null, 2),
  };
}

export { chatbot, paymentMethods, payments };
