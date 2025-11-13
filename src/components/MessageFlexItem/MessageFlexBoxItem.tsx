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
    editLabel: string;
    copyLabel: string;
    updatedAtLabel: string;
}

const MessageFlexBoxItem = ( { index, senderId, message, editLabel, copyLabel, copyButton_click, updatedAtLabel, submitButton_click }: Props ) => {
    const calcSenderText = ( senderId: number ) => {
        if( senderId === 1 ) return "Me";
    return "AI";
    }

    const senderText = calcSenderText( senderId );

    const style: React.CSSProperties = senderId == 1 ? { background: "rgb(236, 225, 209)", borderColor: "rgb(236, 225, 209)" }
        : { background: "rgb(243, 241, 222)", borderColor: "rgb(243, 241, 222))" };

    const [isEditingMode, setIsEditingMode] = React.useState<boolean>( false );
    const [messageText, setMessageText] = React.useState<string>( message.message_txt );

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

                {isEditingMode ? <textarea defaultValue={messageText} onInput={e => setMessageText( e.currentTarget.value )} className={styles.message_body_input}></textarea>
                    : <div dangerouslySetInnerHTML={{ __html: marked.parse( DOMPurify.sanitize(  messageText ) ) }} className={styles.message_body} style={style} />}

                <div className={styles.message_button_area}>
                    {!isEditingMode ? <button onClick={() => setIsEditingMode( true )}>{editLabel}</button>
                        : <button onClick={submitButton1_click}>完了</button>}
                    <button data-id={index} onClick={() => copyButton_click( message.message_txt )}>{copyLabel}</button>
                    <p className={styles.updated_at_p}>{updatedAtLabel}: {message.updated_at}</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MessageFlexBoxItem;
