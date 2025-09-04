import React, { useEffect, useState } from "react";
import ChatListItem from "../../types/ChatListItem";

const LeftSide = () => {
    const [chatItems, setChatItems] = useState<ChatListItem[]>( [] );

    useEffect( () => {
        const items: ChatListItem[] = [
            { id: 1, chat_name: "チャット1" },
            { id: 2, chat_name: "チャット2" },
            { id: 3, chat_name: "チャット3" },
            { id: 4, chat_name: "チャット4" }
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
        <React.Fragment>
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
        </React.Fragment>
    );
}

export default LeftSide;
