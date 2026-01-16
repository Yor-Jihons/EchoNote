// src/api/ElectronApiClient.ts
import { IInterprocessCommunication } from '../@types/global';

/**
 * 本番環境（Electron）で動作するAPIの実装。
 * 全てのメソッドは preload.ts で露出された window.interprocessCommunication を呼び出します。
 */
export const ElectronApiClient: IInterprocessCommunication = {
    initI18nData: (resources) => window.interprocessCommunication.initI18nData(resources),
    getSystemLocale: () => window.interprocessCommunication.getSystemLocale(),
    fetchChats: ( query: string ) => window.interprocessCommunication.fetchChats(query),
    deleteChat: ( id: number ) => window.interprocessCommunication.deleteChat(id),
    addChat: ( chatName: string, aiType: string, description: string ) => window.interprocessCommunication.addChat(chatName, aiType, description),
    addMessage: ( chatId: number, orderInChat: number, senderId:number, messageText: string ) => window.interprocessCommunication.addMessage(chatId, orderInChat, senderId, messageText),
    showMessageBox: ( message: string, buttons: string[] ) => window.interprocessCommunication.showMessageBox(message, buttons),
    updateMessage: ( messageId: number, newText: string ) => window.interprocessCommunication.updateMessage(messageId, newText),
    updateSummary: ( summaryId: number, newText: string ) => window.interprocessCommunication.updateSummary(summaryId, newText),
    sendMessageUpdated: () => window.interprocessCommunication.sendMessageUpdated(),
    onUpdateChatList: ( callback: () => void ) => window.interprocessCommunication.onUpdateChatList(callback),
    removeUpdateChatListListener: ( callback: () => void ) => window.interprocessCommunication.removeUpdateChatListListener(callback),
    fetchChatInfo: ( chatId: number ) => window.interprocessCommunication.fetchChatInfo(chatId),
    writeTextOnClipboard: ( text: string ) => window.interprocessCommunication.writeTextOnClipboard(text),
    createMdFile: ( chatId: number ) => window.interprocessCommunication.createMdFile(chatId),

    getUsers: () => window.interprocessCommunication.getUsers(),
    addUser: (name, email) => window.interprocessCommunication.addUser(name, email),
};
