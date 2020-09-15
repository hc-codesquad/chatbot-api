import shortid from 'shortid';
import { getItem } from './resources/db/getItem'
import { putItem } from './resources/db/putItem';
import { Chat } from './types/chat';

export async function getChatById(chatId: string): Promise<Chat> {
  const chat = await getItem({
    TableName: process.env.DYNAMODB_CHATS_TABLE,
    Key: {
      id: chatId,
    },
  });

  return chat;
}

export function putChat(chat: Chat): Promise<any> {
  return putItem({
    TableName: process.env.DYNAMODB_CHATS_TABLE,
    Item: chat,
  });
}

export function generateChatId() {
  return shortid.generate();
}
