import React, { useEffect, useState } from "react";
import ChatListItem from "../../types/ChatListItem";
import { Link } from "react-router-dom";
import AdditionDialog from "../AdditionDialog/AdditionDialog";

const LeftSide = () => {
    const [chatItems, setChatItems] = useState<ChatListItem[]>( [] );
    const [query, setQuery] = useState<string>( "" );
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>( false );

    const handleDialogClose = () => {
        setIsDialogOpen( false );
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDialogSubmit = async (_chatName: string, _aiType: string) => {
        console.log("OK");
    }

    useEffect(() => {
        const fetchChats = async ( query: string ) => {
            const items = await window.interprocessCommunication.fetchChats( query );
            setChatItems( items );
        };
        fetchChats( query );
    }, [ query ] );

    const searchtextbox_input = ( event: React.FormEvent<HTMLInputElement> ) => {
        const q: string = event.currentTarget.value;
        setQuery( q );
    }

    const chatAdditionButton_click = () => {
        console.log( "追加処理" );
        setIsDialogOpen( true );
    }

    const chatDeleteButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        const selectedIndex = Number( event.currentTarget.dataset.id );
        window.interprocessCommunication.deleteChat( selectedIndex );
        const tmp = chatItems.filter( (item) => item.id !== selectedIndex );
        setChatItems( tmp );
    }
    return (
        <React.Fragment>
            <AdditionDialog isOpen={isDialogOpen} onSubmit={handleDialogSubmit} onClose={handleDialogClose} />

            <input type="text" onInput={searchtextbox_input} placeholder='検索時はここにキーワードを入力してください。' />
            <button onClick={chatAdditionButton_click}>チャットの追加</button>
            <ul>
                {chatItems.map( (chatItem, idx) => {
                    return <li className='chat_list_item' key={idx}>
                        <Link to={`/chats/${chatItem.id}`} data-id={chatItem.id}>
                            {chatItem.chat_name}
                        </Link>
                        <button className="delete-button" data-id={chatItem.id} onClick={chatDeleteButton_click}>削除</button>
                    </li>;
                })}
            </ul>
        </React.Fragment>
    );
}

export default LeftSide;
