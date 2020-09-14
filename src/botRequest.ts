import shortid from 'shortid';
import { generateChatId } from './chatUtils';
import { ChatRequest, ChatResponse } from './types/chat';

export function parseBotRequest(body: { text?: string, chatId?: string, sku?: string }): ChatRequest {
  return {
    text: body?.text || '',
    chatId: body?.chatId || shortid.generate(),
    sku: body?.sku || ''
  };
}

export function sendDefaultMessage(): ChatResponse {
  return {
    chatId: generateChatId(),
    message: {
      text: 'Olá, eu sou seu atendente virtual, em que posso ajudá-lo?',
    },
  };
}

export function sendDefaultErrorMessage(): ChatResponse {
  return {
    message: {
      text: 'Desculpa, não entendi o que você falou, poderia tentar de outra forma?',
    },
  };
}