import { Chat, ChatResponse } from './chat';

export interface Slot {
  name: string;
  value: unknown;
  question: string;
  filled: boolean;
}

export interface UtteranceHandler {
  (text: string, chat: Chat): boolean;
}

export interface Utterance {
  name: string;
  matched: boolean;
  handler: UtteranceHandler;
}

export abstract class Intent {
  id: number;

  name: string;

  utterances: Utterance[];

  slots?: Slot[];

  isFullfilled: boolean;

  tryToResolve(text: string, chat: Chat): boolean | Utterance {
    const resolved = this.utterances.filter(u => u.handler(text, chat));

    if (resolved.length > 0) {
      if (this.slots?.length) {
        if (this.slots.every(slot => slot.filled)) {
          this.isFullfilled = true;
        }
      } else {
        this.isFullfilled = true;
      }

      return true;
    }

    return false;
  }

  async nextAction(): Promise<
    Intent | { intent: Intent; slot?: Slot; response: ChatResponse }
  > {
    if (!this.isFullfilled) {
      const slot = this.slots.find(s => s.filled !== true);
      if (slot) {
        return {
          intent: this,
          slot,
          response: {
            message: {
              text: slot.question,
            },
          },
        };
      }

      this.isFullfilled = true;
    }

    const response = await this.finish();

    if (response instanceof Intent) {
      return response;
    }

    return {
      intent: this,
      response,
    };
  }

  abstract finish(): Promise<Intent | ChatResponse>;
}