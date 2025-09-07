import ChatListItem from "../types/ChatListItem";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IInterprocessCommunication {
  initI18nData: ( resources: any ) => void;
  getSystemLocale: () => Promise<string>;
  fetchChats: ( query: string ) => Promise<ChatListItem[]>;
  deleteChat: (id: number) => void;
  addChat: ( chatName: string, aiType: string ) => Promise<{success: boolean, value: ChatListItem, errMessage?: string}>;

  getUsers: () => Promise<any[]>;
  addUser: (name: string, email: string) => Promise<{ success: boolean, changes?: number, error?: string }>;
}

declare global {
  interface Window {
    interprocessCommunication: IInterprocessCommunication;
  }
}
