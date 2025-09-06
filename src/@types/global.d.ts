import ChatListItem from "../types/ChatListItem";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IInterprocessCommunication {
  initI18nData: ( resources: any ) => void;
  getSystemLocale: () => Promise<string>;
  fetchChats: ( query: string ) => Promise<ChatListItem[]>;

  getUsers: () => Promise<any[]>;
  addUser: (name: string, email: string) => Promise<{ success: boolean, changes?: number, error?: string }>;
}

declare global {
  interface Window {
    interprocessCommunication: IInterprocessCommunication;
  }
}
