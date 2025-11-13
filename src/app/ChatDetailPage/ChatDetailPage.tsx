import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ChatInfo from '../../types/ChatInfo';
import styles from "./chatdetailpage.module.css";
import ChatListItem from '../../types/ChatListItem';
import MessageListItem from '../../types/MessageListItem';
import SummaryListItem from '../../types/SummaryListItem';
import AutoMessageFlexBoxItem from '../../components/AutoMessageFlexBox/AutoMessageFlexBox';
import SummaryDrawer from '../../components/SummaryDrawer/SummaryDrawer';
import InfoDialog from '../../components/InfoDialog/InfoDialog';

const defaultMessage: MessageListItem = {
  id: 0,
  chat_id: 1,
  order_in_chat: 0,
  sender_id: 0,
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
  const [isInfoDialogShow, setIsInfoDialogShow] = useState<boolean>( false );

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

    setChatInfo( {id: chatInfo?.id, chat: chatInfo?.chat, messages: sortedMessages, summary: null! } );

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

    addMessage( chatInfo.id, latestMessage.order_in_chat + 1, senderId, text );
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

  const copyButton_click = ( text: string ) =>{
    window.interprocessCommunication.writeTextOnClipboard( text );
  }

  const toggleInfoDialogShow = () => {
    setIsInfoDialogShow( (prevState) => !prevState );
  }

  const toggleDrawer = () => {
    setIsSummaryDrawerOpen( (prevState) => !prevState );
  }

  if ( !chatInfo ) {
    return <div>チャットが見つかりません。</div>;
  }

  const summaryText_input = ( newText: string ) => {
    const updateSummary = async ( id: number, newText: string ) => {
      const ret = await window.interprocessCommunication.updateSummary( id!, newText );
      setSummary( ret.value );
    }

    const id = summary?.id;
    updateSummary( id!, newText );
  }

  const messageSubmitButton_click = async ( messageId: number, newText: string ) => {
    await window.interprocessCommunication.updateMessage( messageId, newText );
    window.interprocessCommunication.sendMessageUpdated();
  }

  return (
    <div className={styles.chat_detail_page_flexbox}>
      <header className={styles.chat_detail_page_flexbox_flexbox}>
        <h2>{chatInfo.chat.chat_name}</h2>
      </header>

      <div>
        <button onClick={toggleInfoDialogShow} className={styles.info_button}>情報を見る</button>
        <button onClick={toggleDrawer} className={styles.summary_button}>まとめを見る</button>
      </div>
      <SummaryDrawer summary={summary!} isSummaryDrawerOpen={isSummaryDrawerOpen} onInput={summaryText_input} onClose={toggleDrawer} />
      <InfoDialog chatInfo={chatInfo} isInfoDialogShow={isInfoDialogShow} onClose={toggleInfoDialogShow} />

      <div className={styles.message_area}>
        {chatInfo.messages.length !== 0 && chatInfo.messages.map( (message, idx) => {
          return <AutoMessageFlexBoxItem index={idx} copyButton_click={copyButton_click}
            submitButton_click={messageSubmitButton_click}
            message={message} key={chatId! + "-" + idx} />
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
