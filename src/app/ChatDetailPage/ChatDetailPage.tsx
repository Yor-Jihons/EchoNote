import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatInfo from '../../types/ChatInfo';
import ChatListItem from '../../types/ChatListItem';
import MessageListItem from '../../types/MessageListItem';
import SummaryListItem from '../../types/SummaryListItem';

function ChatDetailPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const [chatInfo, setChatInfo] = useState<ChatInfo>();

  const fetchChatInfo = async () => {
    const data = await window.interprocessCommunication.fetchChatInfo( Number( chatId ) );

    const ret = data.value as ChatInfo;

    const retChat: ChatListItem = ret.chat;
    const retMessages: MessageListItem[] = ret.messages;
    const retSummary: SummaryListItem = ret.summary;
    setChatInfo( { chat: retChat, messages: retMessages, summary: retSummary } as ChatInfo );
  };

  useEffect(() => {
    fetchChatInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  /*
    The data which I need:
      * chat
        * id
        * chat_name
        * ai_type
        * created_at
        * upadated_at
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

  if ( !chatInfo ) {
    return <div>チャットが見つかりません。</div>;
  }

  return (
    <div>
      {/*
      <h2>チャット詳細ページ</h2>
      <p>ID: {user.id}</p>
      <p>名前: {user.name}</p>
      <p>メールアドレス: {user.email}</p>
      <Link to="/users">一覧に戻る</Link>
      */}
    </div>
  );
}

export default ChatDetailPage;
