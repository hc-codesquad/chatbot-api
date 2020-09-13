import { Chat, ChatResponse } from '../types/chat';
import { Intent } from '../types/flow';
import { findSimilarProduct } from '../getSuggestions';

class ProductSuggestionBySku extends Intent {
  readonly id = 1;

  readonly name = 'ProductSuggestionBySku';

  slots = [
    {
      name: 'SKU',
      question: 'Para qual produto gostaria de encontrar similares?',
      value: undefined,
      filled: false,
    },
  ];

  readonly utterances = [
    {
      name: '',
      matched: false,
      handler: (text: string): boolean => {
        const founded = text.match(/(\$\{([0-9]+)\})/gi);
        if (founded) {
          const slot = this.slots.find(s => s.name === 'SKU');
          slot.value = founded[0].replace(/[^0-9]/gi, '');
          slot.filled = true;

          return true;
        }
        return false;
      },
    },
  ];

  finish(): ChatResponse {
    const similarProducts = findSimilarProduct(this.slots[0].value);
    if (similarProducts) {
      return {
        suggestions: similarProducts,
      };
    }

    return {
      message: {
        text:
          'Não encontramos nenhum produto similar, gostaria de procurar algum outro produto?',
      },
    };
  }
}

export default ProductSuggestionBySku;
