import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';

import {
  parseBotRequest,
  sendDefaultErrorMessage,
  sendDefaultMessage,
} from './botRequest';
import { parseBillingAddress, parseBuyerRequest, parseCardRequest, parseExpirationRequest, parseItemsRequest, parseMiniCartRequest, parsePaymentRequest, parseShippingaddressRequest, cardValidation } from './paymentRequest'
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
  const result = cardValidation(paymentRequest, card.number);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(result, null, 2),
  };
}
const paymentsSettlements: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body);
  const set = {
    "paymentId": body.paymentId,
    "settleId": "2EA354989E7E4BBC9F9D7B66674C2574",
    "value": body.value,
    "code": null,
    "message": "Sucessfully settled",
    "requestId": body.requestId
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(set, null, 2),
  };
}

const paymentsRefunds: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body);
  const refund = {
    "paymentId": body.paymentId,
    "refundId": null,
    "value": 0,
    "code": "refund-manually",
    "message": "Refund has failed due to an internal error",
    "requestId": body.requestId
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(refund, null, 2),
  };
}

const paymentsCancellations: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body);
  const cancel = {
    "paymentId": body.paymentId,
    "cancellationId": null,
    "code": "cancel-manually",
    "message": "Sucessfully cancelled",
    "requestId": body.requestId
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(cancel, null, 2),
  };
}

export { chatbot, paymentMethods, payments, paymentsSettlements, paymentsRefunds, paymentsCancellations };