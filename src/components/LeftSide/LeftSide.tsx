import React, { useEffect, useState } from "react";
import ChatListItem from "../../types/ChatListItem";

const LeftSide = () => {
    const [chatItems, setChatItems] = useState<ChatListItem[]>( [] );
    const [query, setQuery] = useState<string>( "" );

    useEffect(() => {
        const fetchChats = async ( query: string ) => {
            const items = await window.interprocessCommunication.fetchChats( query );
            setChatItems( items );
        };
        fetchChats( query );
        console.log("HIT!");
    }, [ query ] );

    const searchtextbox_input = ( event: React.FormEvent<HTMLInputElement> ) => {
        const q: string = event.currentTarget.value;
        setQuery( q );
    }

    const chatAdditionButton_click = () => {
        console.log( "追加処理" );
    }

    const chatListItem_click = ( event: React.MouseEvent<HTMLAnchorElement> ) => {
        console.log( "選択: " + event.currentTarget.dataset.id );
    }

    const chatDeleteButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        const selectedIndex = Number( event.currentTarget.dataset.id );
        window.interprocessCommunication.deleteChat( selectedIndex );
        const tmp = chatItems.filter( (item) => item.id !== selectedIndex );
        setChatItems( tmp );
    }
    return (
        <React.Fragment>
            <input type="text" onInput={searchtextbox_input} placeholder='検索時はここにキーワードを入力してください。' />
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
