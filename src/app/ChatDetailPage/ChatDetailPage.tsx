import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatInfo from '../../types/ChatInfo';
import styles from "./chatdetailpage.module.css";
import ChatListItem from '../../types/ChatListItem';
import MessageListItem from '../../types/MessageListItem';
import SummaryListItem from '../../types/SummaryListItem';
import MessageFlexBoxItem from '../../components/MessageFlexItem/MessageFlexBoxItem';

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
        <MessageFlexBoxItem index={0} editButton_click={editButton_click}
          message={{id: 1, chat_id: 0, order_in_chat: 0, sender_id: 0, message_txt: "さんぷる", created_at: "", updated_at: "2025-09-10 17:35" }} />
      </div>

    </div>
  );
}

export default ChatDetailPage;
