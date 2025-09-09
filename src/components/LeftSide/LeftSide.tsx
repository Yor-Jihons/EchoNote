import React, { useEffect, useState } from "react";
import ChatListItem from "../../types/ChatListItem";
import { Link, useNavigate } from "react-router-dom";
import styles from "./leftside.module.css";
import AdditionDialog from "../AdditionDialog/AdditionDialog";

const LeftSide = () => {
    const navigate = useNavigate();
    const [chatItems, setChatItems] = useState<ChatListItem[]>( [] );
    const [query, setQuery] = useState<string>( "" );
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>( false );

    const fetchChats = async ( query: string ) => {
        const items = await window.interprocessCommunication.fetchChats( query );
        const ret = [ ...items ].sort( (a, b) => {
            return a.updated_at > b.updated_at ? 1 : -1;
        });
        setChatItems( ret );
    };

    useEffect(() => {
        const handleUpdate = () => {
            console.log('左パネル: 更新命令を受け取りました！');
            fetchChats(query); // 最新のデータを再取得してステートを更新
        };

        // Adds the event listener.
        window.interprocessCommunication.onUpdateChatList( handleUpdate );

        // Clean-up function.
        return () => {
            window.interprocessCommunication.removeUpdateChatListListener( handleUpdate );
        };
    }, [ query ] );

    useEffect(() => {
        fetchChats( query );
    }, [ query ] );

    const handleDialogClose = () => {
        setIsDialogOpen( false );
    };

    const handleDialogSubmit = async ( chatName: string, aiType: string ) => {
        const newItem = await window.interprocessCommunication.addChat( chatName, aiType );
        if( !newItem.success ){
            setIsDialogOpen( false );
            window.interprocessCommunication.showMessageBox( newItem.errMessage! );
            return;
        }

        const v: ChatListItem = newItem.value;
        if( v.chat_name.indexOf( query ) !== -1 ) setChatItems( [ v, ...chatItems ] );

        setIsDialogOpen( false );

        navigate( "/chats/" + newItem.value.id );

        window.interprocessCommunication.showMessageBox( "登録完了しました。" );
    }

    const searchtextbox_input = ( event: React.FormEvent<HTMLInputElement> ) => {
        const q: string = event.currentTarget.value;
        setQuery( q );
    }

    const chatAdditionButton_click = () => {
        setIsDialogOpen( true );
    }

    const chatDeleteButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        const selectedIndex = Number( event.currentTarget.dataset.id );
        window.interprocessCommunication.deleteChat( selectedIndex );
        const tmp = chatItems.filter( (item) => item.id !== selectedIndex );
        setChatItems( tmp );
        navigate( "/" );

        window.interprocessCommunication.showMessageBox( "削除しました。" );
    }

    const chatRenameButton_click = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        // TODO: Implement here.
        console.log( event.currentTarget.value );
    }

    return (
        <React.Fragment>
            <AdditionDialog isOpen={isDialogOpen} onSubmit={handleDialogSubmit} onClose={handleDialogClose} />

            <button onClick={chatAdditionButton_click} className={styles.chat_addition_button}>チャットの追加</button>
            <input type="text" onInput={searchtextbox_input} placeholder='検索時はここにキーワードを入力してください。' className={styles.search_textbox} />
            <ul>
                {chatItems.map( (chatItem, idx) => {
                    return <li className={styles.chat_list_item} key={idx}>
                        <Link to={`/chats/${chatItem.id}`} data-id={chatItem.id} className={styles.link_as_anchor}>
                            {chatItem.chat_name}
                        </Link>
                        <button className={styles.rename_button} data-id={chatItem.id} onClick={chatRenameButton_click} title="チャット名の編集">編集</button>
                        <button className={styles.delete_button} data-id={chatItem.id} onClick={chatDeleteButton_click} title="チャットの削除">削除</button>
                    </li>;
                })}
            </ul>
        </React.Fragment>
    );
}

export default LeftSide;
