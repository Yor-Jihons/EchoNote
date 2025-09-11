import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ChatInfo from '../../types/ChatInfo';
import styles from "./chatdetailpage.module.css";
import ChatListItem from '../../types/ChatListItem';
import MessageListItem from '../../types/MessageListItem';
import SummaryListItem from '../../types/SummaryListItem';
import AutoMessageFlexBoxItem from '../../components/AutoMessageFlexBox/AutoMessageFlexBox';

function ChatDetailPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const [showContinueAsMeButton, setShowContinueAsMeButton] = useState<boolean>( false );
  const [chatInfo, setChatInfo] = useState<ChatInfo>();
  const markdownInputRef = useRef<HTMLTextAreaElement>( null );

  const fetchChatInfo = async ( id: number ) => {
    const data = await window.interprocessCommunication.fetchChatInfo( id );

    const ret = data.value as ChatInfo;

    const retChat: ChatListItem = ret.chat;
    const retMessages: MessageListItem[] = ret.messages.sort( (a, b) => { return a.order_in_chat > b.order_in_chat ? 1 : -1; });
    const retSummary: SummaryListItem = ret.summary;
    setChatInfo( { id: ret.id, chat: retChat, messages: retMessages, summary: retSummary } as ChatInfo );
  };

  const additionButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    console.log( markdownInputRef.current?.dataset.id || "?" );
    console.log( "type = " + event.currentTarget.dataset.id );
  }

  useEffect(() => {
    const numericChatId = Number(chatId);
    if( !isNaN( numericChatId ) ){
      fetchChatInfo( numericChatId );
    }

    if( markdownInputRef.current ){
      markdownInputRef.current.value = "";
    }
  }, [ chatId ] );

  useEffect(() => {
    console.log( "HIT!" );
    setShowContinueAsMeButton( chatInfo?.messages[ chatInfo.messages.length - 1 ].sender_id === 1 ? true : false );
  }, [ chatInfo ] );

  /*
    The data which I need:
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
        {chatInfo.messages.map( (message, idx) => {
          return <AutoMessageFlexBoxItem index={idx} editButton_click={editButton_click} message={message} key={idx} />
        })}
      </div>
      <div className={styles.input_area}>
        <textarea className={styles.markdown_input} ref={markdownInputRef}></textarea>
        <p>
          <button onClick={additionButton_click} data-id="AUTO">送信</button>
          {showContinueAsMeButton && (
            <button onClick={additionButton_click} data-id="ME">私からのメッセージを続ける</button>
          )}
        </p>
      </div>

    </div>
  );
}

export default ChatDetailPage;
