import { ProductSuggestion } from './product';

export interface ChatContext {
  skuId?: number;
  suggestions?: ProductSuggestion;
  wantSuggestions?: boolean;
  [propName: string]: unknown;
}

export interface Chat {
  id: string;
  context: ChatContext;
}

export interface ChatRequest {
  chatId?: string;
  text?: string;
  sku:string;

}

export interface ChatButton {
  text: string;
  value: string;
}

export interface ChatResponse {
  message?: {
    text?: string;
    buttons?: ChatButton[];
  };
  suggestions?: ProductSuggestion;
}
