import { Chat } from './chat';

export interface Slot {
  name: string;
  value: unknown;
}

export interface UtteranceHandler {
  (text: string, chat: Chat): boolean | Slot;
}

export interface Utterance {
  name: string;
  matched: boolean;
  handler: UtteranceHandler;
}

export interface Intent {
  name: string;
  utterances: Utterance[];
  slots?: Slot[];
  tryToResolve: (text: string, chat: Chat) => false | Utterance;
}