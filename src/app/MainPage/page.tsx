//import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import '../../App.css';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface ChatListItem{
  id: number;
  chat_name: string;
}

function MainPage() {
  const [chatItems, setChatItems] = React.useState<ChatListItem[]>( [] );

  useEffect( () => {
    const items: ChatListItem[] = [
      {id: 1, chat_name: "チャット1" },
      {id: 2, chat_name: "チャット2" },
      {id: 3, chat_name: "チャット3" }
    ];
    setChatItems( items );
  }, [] );

  const searchtextbox_change = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    console.log( event.currentTarget.value );
  }

  const chatAdditionButton_click = () => {
    console.log( "追加処理" );
  }

  const chatListItem_click = ( event: React.MouseEvent<HTMLAnchorElement> ) => {
    console.log( "選択: " + event.currentTarget.dataset.id );
  }

  const chatDeleteButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) => {
    // TODO: データベースから取り出す方向性にする
    const selectedIndex = Number( event.currentTarget.dataset.id );
    const tmp = chatItems.filter( (item) => item.id !== selectedIndex );
    setChatItems( tmp );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={10} minSize={1}>
          <div className="panel-content">
            <input type="text" onChange={searchtextbox_change} placeholder='検索時はここにキーワードを入力してください。' />
            <button onClick={chatAdditionButton_click}>チャットの追加</button>
            <ul>
              {chatItems.map( (chatItem, idx) => {
                return <li className='chat_list_item' key={idx}>
                  <a href="#" data-id={chatItem.id} onClick={chatListItem_click}>{chatItem.chat_name}</a>
                  <button className="delete-button" data-id={chatItem.id} onClick={chatDeleteButton_click}>削除</button>
                </li>;
              })}
            </ul>
          </div>
        </Panel>

        <PanelResizeHandle style={{ width: "5px", background: "#ccc" }} />

        <Panel defaultSize={90} minSize={1}>
          <div className="panel-content">
            <h2>右パネル</h2>
            <p>ここにコンテンツが入ります。</p>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default MainPage;
