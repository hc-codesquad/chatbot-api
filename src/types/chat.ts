import { ProductSuggestion } from './product';
import { Intent } from './flow';

export interface ChatContext {
  skuId?: number;
  suggestions?: ProductSuggestion;
  wantSuggestions?: boolean;
  currentIntent?: Intent | undefined;
  [propName: string]: unknown;
}

export interface Chat {
  id: string;
  context: ChatContext;
}

export interface ChatRequest {
  chatId?: string;
  text?: string;
  sku?: string;
}

export interface ChatButton {
  text: string;
  value: string;
}

export interface ChatResponse {
  chatId: string;
  message?: {
    text?: string;
    buttons?: ChatButton[];
  };
  suggestions?: ProductSuggestion;
}
