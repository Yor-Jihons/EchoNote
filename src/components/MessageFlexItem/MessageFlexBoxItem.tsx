import React from "react";
import styles from "./messageflexboxitem.module.css";
import MessageListItem from "../../types/MessageListItem";

interface Props {
    index: number;
    senderId: number;
    message: MessageListItem;
    editButton_click: ( event: React.MouseEvent<HTMLButtonElement> ) => void;
    editLabel: string;
    updatedAtLabel: string;
    messageBodyStyle?: React.CSSProperties;
}


const MessageFlexBoxItem = ( { index, senderId, message, editButton_click, editLabel, updatedAtLabel, messageBodyStyle }: Props ) => {
    const senderText = senderId == 0 ? "Me" : "AI";

    return (
        <React.Fragment>
            <div className={styles.me_message}>
                <div className={styles.message_header_area}>
                    <h3 className={styles.message_header}>{senderText}</h3>
                </div>
                <div className={styles.message_body} style={messageBodyStyle}>
                    {message.message_txt}
                </div>
                <div className={styles.message_button_area}>
                    <button data-id={index} onClick={editButton_click}>{editLabel}</button>
                    <p className={styles.updated_at_p}>{updatedAtLabel}: {message.updated_at}</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MessageFlexBoxItem;
