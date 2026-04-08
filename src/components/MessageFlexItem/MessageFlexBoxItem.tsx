import React from "react";
import styles from "./messageflexboxitem.module.css";
import MessageListItem from "../../types/MessageListItem";
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface Props {
    index: number;
    senderId: number;
    message: MessageListItem;
    copyButton_click: ( text: string ) => void;
    submitButton_click: ( messageId: number, newText: string ) => void;
}

const MessageFlexBoxItem = ( { index, senderId, message, copyButton_click, submitButton_click }: Props ) => {
    const calcSenderText = ( senderId: number ) => {
        if( senderId === 1 ) return "Me";
    return "AI";
    }

    const senderText = calcSenderText( senderId );

    const style: React.CSSProperties = senderId == 1 ? { background: "rgb(236, 225, 209)", borderColor: "rgb(236, 225, 209)" }
        : { background: "rgb(243, 241, 222)", borderColor: "rgb(243, 241, 222))" };

    const [isEditingMode, setIsEditingMode] = React.useState<boolean>( false );
    const [messageText, setMessageText] = React.useState<string>( message.message_txt );

    React.useEffect( () => {
        setMessageText( message.message_txt );
    }, [ message.message_txt ] );

    const submitButton1_click = () => {
        submitButton_click( message.id, messageText );
        setIsEditingMode( false );
    }

    return (
        <React.Fragment>
            <div className={styles.auto_message}>
                <div className={styles.message_header_area}>
                    <h3 className={styles.message_header}>{senderText}</h3>
                </div>

                {isEditingMode ? <textarea value={messageText} onInput={e => setMessageText( e.currentTarget.value )} className={styles.message_body_input}></textarea>
                    : <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( marked.parse( messageText, { async: false } ) ) }} className={styles.message_body} style={style} />}

                <div className={styles.message_button_area}>
                    {!isEditingMode ? <button onClick={() => setIsEditingMode( true )}>編集</button>
                        : <button onClick={submitButton1_click}>完了</button>}
                    <button data-id={index} onClick={() => copyButton_click( messageText )}>コピー</button>
                    <p className={styles.updated_at_p}>最終更新日時: {message.updated_at}</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MessageFlexBoxItem;
