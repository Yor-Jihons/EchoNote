import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ChatInfo from '../../types/ChatInfo';
import styles from "./chatdetailpage.module.css";
import ChatListItem from '../../types/ChatListItem';
import MessageListItem from '../../types/MessageListItem';
import SummaryListItem from '../../types/SummaryListItem';
import AutoMessageFlexBoxItem from '../../components/AutoMessageFlexBox/AutoMessageFlexBox';
import SummaryDrawer from '../../components/SummaryDrawer/SummaryDrawer';

const defaultMessage: MessageListItem = {
  id: 0,
  chat_id: 0,
  order_in_chat: 0,
  sender_id: 1,
  message_txt: "",
  created_at: "",
  updated_at: ""
};

function ChatDetailPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const [showContinueAsMeButton, setShowContinueAsMeButton] = useState<boolean>( false );
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>( null );
  const [summary, setSummary] = useState<SummaryListItem | null>( null );
  const markdownInputRef = useRef<HTMLTextAreaElement>( null );
  const [isSummaryDrawerOpen, setIsSummaryDrawerOpen] = useState<boolean>( false );

  const fetchChatInfo = async ( id: number ) => {
    const data = await window.interprocessCommunication.fetchChatInfo( id );

    const ret = data.value as ChatInfo;

    const retChat: ChatListItem = ret.chat;
    const retMessages: MessageListItem[] = ret.messages.sort( (a, b) => a.order_in_chat - b.order_in_chat ) || [];
    const retSummary: SummaryListItem = ret.summary;
    setChatInfo( { id: ret.id, chat: retChat, messages: retMessages } as ChatInfo );
    setSummary( retSummary );
  };

  const addMessage = async ( chatId: number, orderInChat: number, senderId: number, messageText: string ) => {
    if( !chatInfo ) return;

    const ret = await window.interprocessCommunication.addMessage( chatId, orderInChat, senderId, messageText );
    if( !ret.success ){
      window.interprocessCommunication.showMessageBox( "登録できませんでした。", [] );
      return;
    }

    const tmpMessageList: MessageListItem[]|undefined = chatInfo?.messages;

    if( tmpMessageList === undefined ) return;

    tmpMessageList.push( ret.value );

    const sortedMessages: MessageListItem[] = tmpMessageList.sort( (a, b) => a.order_in_chat - b.order_in_chat );

    setChatInfo( {id: chatInfo?.id, chat: chatInfo?.chat, messages: sortedMessages, summary: chatInfo?.summary } );

    window.interprocessCommunication.sendMessageUpdated();
  }

  const additionButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    if( !chatInfo ) return;
    if( !markdownInputRef.current ) return;

    if( markdownInputRef.current?.value === "" ){
      window.interprocessCommunication.showMessageBox( "メッセージを入力してください。", [] );
      return;
    }

    const messageType: string = event.currentTarget.dataset.id!;

    let senderId: number = 0;
    const latestMessage = chatInfo.messages[ chatInfo.messages.length - 1 ] || defaultMessage;

    const me = 1;
    const ai = 2;

    if( messageType === "ME" ){
      senderId = me;
    }else if( latestMessage.sender_id === me ){
      senderId = ai;
    }else{
      senderId = me;
    }

    const text = markdownInputRef.current.value;
    markdownInputRef.current.value = "";

    addMessage( latestMessage.chat_id, latestMessage.order_in_chat + 1, senderId, text );
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
    if( chatInfo?.messages.length === 0 ){
      return;
    }
    setShowContinueAsMeButton( chatInfo?.messages[ chatInfo.messages.length - 1 ].sender_id === 1 ? true : false );
  }, [ chatInfo ] );

  const editButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) =>{
    console.log( event.currentTarget.dataset.id );
  }

  const toggleDrawer = () => {
    setIsSummaryDrawerOpen( (prevState) => !prevState );
  }

  if ( !chatInfo ) {
    return <div>チャットが見つかりません。</div>;
  }

  const summaryText_input = ( newText: string ) => {
    const createNewSummary = ( prev: SummaryListItem ) => {
      return {
        ...prev, summary_txt: newText
      } as SummaryListItem;
    }

    // TODO: updateメッセージを送る

    setSummary( (prevSummary) => createNewSummary( prevSummary! ) );
  }

  return (
    <div className={styles.chat_detail_page_flexbox}>
      <header className={styles.chat_detail_page_flexbox_flexbox}>
        <h2>{chatInfo.chat.chat_name}</h2>
        <p>ID: {chatInfo.id}</p>
        <p>AI: {chatInfo.chat.ai_type || "---"}</p>
        <p>作成日時: {chatInfo.chat.created_at}</p>
      </header>

      <button onClick={toggleDrawer} className={styles.summary_button}>まとめを見る</button>
      <SummaryDrawer summary={summary!} isSummaryDrawerOpen={isSummaryDrawerOpen} onInput={summaryText_input} onClose={toggleDrawer} />

      <div className={styles.message_area}>
        {chatInfo.messages.length !== 0 && chatInfo.messages.map( (message, idx) => {
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
