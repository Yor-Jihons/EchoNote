import React from "react";
import styles from "./messageflexboxitem.module.css";
import MessageListItem from "../../types/MessageListItem";

interface Props {
    index: number;
    message: MessageListItem;
    editButton_click: ( event: React.MouseEvent<HTMLButtonElement> ) => void;
}


const MessageFlexBoxItem = ( { index, message, editButton_click }: Props ) => {

    return (
        <React.Fragment>
            <div className={styles.me_message}>
                <div className={styles.message_header_area}>
                    <h3 className={styles.message_header}>Me</h3>
                </div>
                <div className={styles.message_date_area}>
                    <p>最終更新日時: {message.updated_at}</p>
                </div>
                <div className={styles.message_body}>
                    {message.message_txt}
                </div>
                <div className={styles.message_button_area}>
                    <button data-id={index} onClick={editButton_click}>編集</button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MessageFlexBoxItem;
