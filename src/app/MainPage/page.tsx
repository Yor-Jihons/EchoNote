/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ChatListItem from "../../types/ChatListItem";
import { Link, useNavigate } from "react-router-dom";
import styles from "./mainpage.module.css";
import AdditionDialog from "../../components/AdditionDialog/AdditionDialog";
import { useApi } from "../../contexts/ApiContext";

const LeftSide = () => {
    const api = useApi();
    const navigate = useNavigate();
    const [chatItems, setChatItems] = useState<ChatListItem[]>( [] );
    const [query, setQuery] = useState<string>( "" );
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>( false );

    const fetchChats = async ( query: string ) => {
        const items = await api.fetchChats( query );
        const ret = [ ...items ].sort( (a, b) => {
            return a.updated_at > b.updated_at ? 1 : -1;
        });
        setChatItems( ret );
    };

    useEffect(() => {
        const handleUpdate = () => {
            fetchChats(query);
        };

        // Adds the event listener.
        api.onUpdateChatList( handleUpdate );

        // Clean-up function.
        return () => {
            api.removeUpdateChatListListener( handleUpdate );
        };
    }, [ query ] );

    useEffect(() => {
        fetchChats( query );
    }, [ query ] );

    const handleDialogClose = () => {
        setIsDialogOpen( false );
    };

    const handleDialogSubmit = async ( chatName: string, aiType: string, description: string ) => {
        const newItem = await api.addChat( chatName, aiType, description );
        if( !newItem.success ){
            setIsDialogOpen( false );
            await api.showMessageBox( newItem.errMessage!, [] );
            return;
        }

        const v: ChatListItem = newItem.value.chat;
        if( v.chat_name.indexOf( query ) !== -1 ) setChatItems( [ v, ...chatItems ] );

        setIsDialogOpen( false );

        navigate( "/chats/" + newItem.value.chat.id );

        await api.showMessageBox( "登録完了しました。", [] );
    }

    const searchtextbox_input = ( event: React.FormEvent<HTMLInputElement> ) => {
        const q: string = event.currentTarget.value;
        setQuery( q );
    }

    const chatAdditionButton_click = () => {
        setIsDialogOpen( true );
    }

    const chatDeleteButton_click = async ( event: React.MouseEvent<HTMLButtonElement> ) => {
        const selectedChatId = Number( event.currentTarget.dataset.id );
        const ret1 = await api.showMessageBox( "本当に削除しますか?", [ "No(いいえ)", "Yes(はい)" ] );
        if( ret1 === 1 ){
            api.deleteChat( selectedChatId );
            const tmp = chatItems.filter( (item) => item.id !== selectedChatId );
            setChatItems( tmp );
            navigate( "/" );

            api.showMessageBox( "削除しました。", [] );
        }
    }

    const Create = ( chatItem: ChatListItem, idx: number ) =>{
        return (
            <li className={styles.chat_list_item} key={idx}>
            <Link to={`/chats/${chatItem.id}`} data-id={chatItem.id} className={styles.link_as_anchor}>
                    {chatItem.id}: {chatItem.chat_name}
                </Link>
                <button className={styles.delete_button} data-id={chatItem.id}
                    onClick={chatDeleteButton_click} title="チャットの削除">削除</button>
        </li>);
    }

    return (
        <React.Fragment>
            <div className={styles.flexbox1}>
                <AdditionDialog isOpen={isDialogOpen} onSubmit={handleDialogSubmit} onClose={handleDialogClose} />

                <button onClick={chatAdditionButton_click} className={styles.chat_addition_button}>チャットの追加</button>

                <input type="text" onInput={searchtextbox_input} placeholder='チャットを検索'  minLength={2} maxLength={200} className={styles.search_textbox} />

                <div className={styles.chats_area}>
                    <ul>
                        {chatItems.length === 0 ? <p>チャットがまだないか、<br />該当するチャットがありません。</p>
                            : chatItems.map( (chatItem, idx) => {
                            return Create(chatItem, idx);
                        })}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
}

export default LeftSide;
