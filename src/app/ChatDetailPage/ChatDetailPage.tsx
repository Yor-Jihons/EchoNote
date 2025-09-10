import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatInfo from '../../types/ChatInfo';
import styles from "./chatdetailpage.module.css";
import ChatListItem from '../../types/ChatListItem';
import MessageListItem from '../../types/MessageListItem';
import SummaryListItem from '../../types/SummaryListItem';

function ChatDetailPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const [chatInfo, setChatInfo] = useState<ChatInfo>();

  const fetchChatInfo = async ( id: number ) => {
    const data = await window.interprocessCommunication.fetchChatInfo( id );

    const ret = data.value as ChatInfo;

    const retChat: ChatListItem = ret.chat;
    const retMessages: MessageListItem[] = ret.messages;
    const retSummary: SummaryListItem = ret.summary;
    setChatInfo( { id: ret.id, chat: retChat, messages: retMessages, summary: retSummary } as ChatInfo );
  };

  useEffect(() => {
    const numericChatId = Number(chatId);
    if( !isNaN( numericChatId ) ){
      fetchChatInfo( numericChatId );
    }
  }, [ chatId ] );

  /*
    The data which I need:
      * messages
        * id
        * order_in_chat
        * sender_id
        * message_txt
        * created_at
        * upadated_at
      * summary
        * id
        * summary_txt
        * created_at
        * updated_at
      => { chat, messages, summary }
  */

/*
  const runSample = async ( messageId: number, newText: string ) => {
    // Update the message on the data-base.
    await window.interprocessCommunication.updateMessage( messageId, newText );
    // Send the IPC-message to the main-process. 
    window.interprocessCommunication.sendMessageUpdated();
  }
*/
  //runSample( 30, "Hello?" ); // TODO: Modify here.

  const editButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) =>{
    console.log( event.currentTarget.dataset.id );
  }

  if ( !chatInfo ) {
    return <div>チャットが見つかりません。</div>;
  }

  return (
    <div className={styles.chat_detail_page_flexbox}>
      <header className={styles.chat_detail_page_flexbox_flexbox}>
        <h2>{chatInfo.chat.chat_name}</h2>
        <p>ID: {chatInfo.id}</p>
        <p>AI: {chatInfo.chat.ai_type || "---"}</p>
        <p>作成日時: {chatInfo.chat.created_at}</p>
      </header>

      <div className={styles.message_area}>

        <div className={styles.me_message}>
          <div className={styles.message_header_area}>
            <h3 className={styles.message_header}>Me</h3>
          </div>
          <div className={styles.message_date_area}>
            <p>最終更新日時: 2025-09-10 00:00:00</p>
          </div>
          <div className={styles.message_body}>
            ABCDEFG
          </div>
          <div className={styles.message_button_area}>
            <button data-id={0} onClick={editButton_click}>編集</button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ChatDetailPage;
