import React from "react";
import MessageListItem from "../../types/MessageListItem";
import MessageFlexBoxItem from "../MessageFlexItem/MessageFlexBoxItem";

interface Props {
    index: number;
    message: MessageListItem;
    submitButton_click: ( messageId: number, newText: string ) => void;
    copyButton_click: ( text: string ) => void;
}


const AutoMessageFlexBoxItem = ( { index, message, copyButton_click, submitButton_click }: Props ) => {
    return (
        <React.Fragment>
            <MessageFlexBoxItem  index={index}
                copyButton_click={copyButton_click} submitButton_click={submitButton_click}
                senderId={message.sender_id}
                message={message} editLabel={"編集"} updatedAtLabel={"最終更新日時"} copyLabel={"コピー"} />
        </React.Fragment>
    );
}

export default AutoMessageFlexBoxItem;
