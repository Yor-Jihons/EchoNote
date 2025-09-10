import ChatListItem from "../types/ChatListItem";
import MessageListItem from "../types/MessageListItem";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IInterprocessCommunication {
  initI18nData: ( resources: any ) => void;
  getSystemLocale: () => Promise<string>;
  fetchChats: ( query: string ) => Promise<ChatListItem[]>;
  deleteChat: (id: number) => void;
  addChat: ( chatName: string, aiType: string ) => Promise<{success: boolean, value: ChatListItem, errMessage?: string}>;
  showMessageBox: ( message: string, buttons: string[] ) => Promise<number>; // Returns index of the button which the user selected.
  updateMessage: ( messageId: number, newText: string ) => Promise<{success: boolean, value: MessageListItem, errMessage?: string}>;
  sendMessageUpdated: () => void;
  onUpdateChatList: ( callback: () => void ) => void;
  removeUpdateChatListListener: ( callback: () => void ) => void;
  fetchChatInfo: ( chatId: number ) => Promise<{success: boolean, value: any, errMessage?: string}>;

  getUsers: () => Promise<any[]>;
  addUser: (name: string, email: string) => Promise<{ success: boolean, changes?: number, error?: string }>;
}

declare global {
  interface Window {
    interprocessCommunication: IInterprocessCommunication;
  }
}
