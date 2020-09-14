import shortid from 'shortid';

export function generateChatId() {
  return shortid.generate();
}
