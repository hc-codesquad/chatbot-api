import shortid from 'shortid';
import { ChatRequest, ChatResponse } from './types/chat';

export function parseBotRequest(body: { text?: string, chatId?: string }): ChatRequest {
  return {
    text: body?.text || '',
    chatId: body?.chatId || shortid.generate(),
  };
}

export function sendDefaultMessage(): ChatResponse {
  return {
    message: {
      text: 'Olá, eu sou seu atendente virtual, em que posso ajudá-lo?',
    },
  };
}

export function sendDefaultErrorMessage(): ChatResponse {
  return {
    message: {
      text: 'Descula, não entendi o que você falou, poderia tentar de outra forma?',
    },
  };
}