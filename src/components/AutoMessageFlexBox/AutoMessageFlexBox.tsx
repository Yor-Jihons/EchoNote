import React from "react";
import MessageListItem from "../../types/MessageListItem";
import MessageFlexBoxItem from "../MessageFlexItem/MessageFlexBoxItem";

interface Props {
    index: number;
    message: MessageListItem;
    editButton_click: ( event: React.MouseEvent<HTMLButtonElement> ) => void;
    copyButton_click: ( text: string ) => void;
}


const AutoMessageFlexBoxItem = ( { index, message, editButton_click, copyButton_click }: Props ) => {
    return (
        <React.Fragment>
            <MessageFlexBoxItem  index={index} editButton_click={editButton_click} copyButton_click={copyButton_click}
                senderId={message.sender_id}
                message={message} editLabel={"編集"} updatedAtLabel={"最終更新日時"} copyLabel={"コピー"} />
        </React.Fragment>
    );
}

export default AutoMessageFlexBoxItem;
