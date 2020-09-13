import { ChatResponse } from '../types/chat';
import { Intent } from '../types/flow';
import { getSkuProduct } from '../skuRequest';

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
      name: `produto \${SKU}`,
      matched: false,
      handler: (text: string): boolean => {
        const founded = text.match(/(\$\{([0-9]+)\})/gi);
        console.log('ProductSuggestionBySku utterance handler', founded);
        if (founded) {
          const slot = this.slots.find(s => s.name === 'SKU');

          console.log('slot', slot, 'founded value', founded[0].replace(/[^0-9]/gi, ''));

          slot.value = founded[0].replace(/[^0-9]/gi, '');
          slot.filled = true;

          return true;
        }
        return false;
      },
    },
  ];

  async finish(): Promise<ChatResponse> {
    const similarProducts = await getSkuProduct(this.slots[0].value);
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
