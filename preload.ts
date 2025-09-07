import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('interprocessCommunication', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initI18nData: ( resources: any ) => ipcRenderer.send( 'init-i18n-data', resources ),
  getSystemLocale: () => ipcRenderer.invoke( 'get-system-locale' ),
  fetchChats: ( query: string ) => ipcRenderer.invoke( 'fetch-chats', query ),
  deleteChat: ( id: number ) => ipcRenderer.send( 'delete-chat', id ),
  addChat: ( chatName: string, aiType: string ) => ipcRenderer.invoke( 'add-chat', { chatName, aiType } ),

  // IPC通信用のAPIを追加
  getUsers: () => ipcRenderer.invoke('get-users'),
  addUser: (name: string, email: string) => ipcRenderer.invoke('add-user', { name, email }),
});
