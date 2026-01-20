import ChatListItem from "../types/ChatListItem";
import MessageListItem from "../types/MessageListItem";
import SummaryListItem from "../types/SummaryListItem";
import IPCResult from "../types/IPCResult";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IInterprocessCommunication {
  initI18nData: ( resources: any ) => void;
  getSystemLocale: () => Promise<string>;
  fetchChats: ( query: string ) => Promise<ChatListItem[]>;
  deleteChat: (id: number) => void;
  addChat: ( chatName: string, aiType: string, description: string ) => Promise<IPCResult<{ chat: ChatListItem, summary: SummaryListItem }>>;
  addMessage: ( chatId: number, orderInChat: number, senderId:number, messageText: string ) => Promise<IPCResult<MessageListItem>>;
  updateSummary: ( summaryId: number, newText: string ) => Promise<IPCResult<SummaryListItem>>;
  showMessageBox: ( message: string, buttons: string[] ) => Promise<number>; // Returns index of the button which the user selected.
  updateMessage: ( messageId: number, newText: string ) => Promise<IPCResult<MessageListItem>>;
  sendMessageUpdated: () => void;
  onUpdateChatList: ( callback: () => void ) => void;
  removeUpdateChatListListener: ( callback: () => void ) => void;
  fetchChatInfo: ( chatId: number ) => Promise<{success: boolean, value: any, errMessage?: string}>;
  writeTextOnClipboard: ( text: string ) => void;
  createMdFile: ( chatId: number ) => void;

  getUsers: () => Promise<any[]>;
  addUser: (name: string, email: string) => Promise<{ success: boolean, changes?: number, error?: string }>;
}

declare global {
  interface Window {
    interprocessCommunication: IInterprocessCommunication;
  }
}
