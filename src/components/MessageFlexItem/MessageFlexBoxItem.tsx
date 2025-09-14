import React from "react";
import styles from "./messageflexboxitem.module.css";
import MessageListItem from "../../types/MessageListItem";
import DOMPurify from 'dompurify';

interface Props {
    index: number;
    senderId: number;
    message: MessageListItem;
    editButton_click: ( event: React.MouseEvent<HTMLButtonElement> ) => void;
    copyButton_click: ( text: string ) => void;
    editLabel: string;
    copyLabel: string;
    updatedAtLabel: string;
}

const MessageFlexBoxItem = ( { index, senderId, message, editButton_click, editLabel, copyLabel, copyButton_click, updatedAtLabel }: Props ) => {
    const senderText = senderId === 1 ? "Me" : "AI";
    const style: React.CSSProperties = senderId == 0 ? { background: "rgb(240, 217, 186)", borderColor: "rgb(240, 217, 186)" }
        : { background: "rgb(240, 217, 186)", borderColor: "rgb(240, 217, 186)" }; // TODO: Modify.

    console.log( "" + editButton_click + ", " + editLabel + ", " + index ); // TODO Modify this dummy process.

    return (
        <React.Fragment>
            <div className={styles.auto_message}>
                <div className={styles.message_header_area}>
                    <h3 className={styles.message_header}>{senderText}</h3>
                </div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( message.message_txt ) }} className={styles.message_body} style={style} />
                <div className={styles.message_button_area}>
                    <button data-id={index} onClick={() => copyButton_click( message.message_txt )}>{copyLabel}</button>
                    <p className={styles.updated_at_p}>{updatedAtLabel}: {message.updated_at}</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MessageFlexBoxItem;
