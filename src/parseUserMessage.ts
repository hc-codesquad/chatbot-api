import { Intent, Slot } from './types/flow';
import { Chat, ChatResponse } from './types/chat';
import ProductSuggestionBySku from './intents/ProductSuggestionBySku';

const availableIntents: Intent[] = [new ProductSuggestionBySku()];

function searchIntent(text: string, chat: Chat): Intent | null {
  if (chat.context?.currentIntent) {
    return chat.context?.currentIntent;
  }

  return (
    availableIntents.find(intent => intent.tryToResolve(text, chat)) || null
  );
}

export async function parseUserMessage(
  text: string,
  chat: Chat,
): Promise<null | { chat: Chat; response: ChatResponse }> {
  let intentFounded:
    | Intent
    | { intent: Intent; slot?: Slot; response: ChatResponse } = searchIntent(text, chat);

  while (intentFounded instanceof Intent) {
    intentFounded = await intentFounded.nextAction();
  }

  console.log('intent founded: ', intentFounded);

  if (!intentFounded) {
    return null;
  }

  const changedChat: Chat = { ...chat };

  if (intentFounded.intent instanceof Intent) {
    changedChat.context.currentIntent = intentFounded.intent;
  }
  if (intentFounded?.slot) {
    changedChat.context.currentIntentSlot = intentFounded.slot;
  }

  return {
    chat: changedChat,
    response: intentFounded.response,
  };
}
