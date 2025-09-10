import React from "react";
import MessageListItem from "../../types/MessageListItem";
import MessageFlexBoxItem from "../MessageFlexItem/MessageFlexBoxItem";

interface Props {
    index: number;
    message: MessageListItem;
    editButton_click: ( event: React.MouseEvent<HTMLButtonElement> ) => void;
}


const MeMessageFlexBoxItem = ( { index, message, editButton_click }: Props ) => {
    return (
        <React.Fragment>
            <MessageFlexBoxItem index={index} editButton_click={editButton_click}
                message={message}
                senderId={0} editLabel={"編集"} updatedAtLabel={"最終更新日時"} />
        </React.Fragment>
    );
}

export default MeMessageFlexBoxItem;
