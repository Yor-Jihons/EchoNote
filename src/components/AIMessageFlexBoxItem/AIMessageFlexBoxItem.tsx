import React from "react";
import MessageListItem from "../../types/MessageListItem";
import MessageFlexBoxItem from "../MessageFlexItem/MessageFlexBoxItem";

interface Props {
    index: number;
    message: MessageListItem;
    editButton_click: ( event: React.MouseEvent<HTMLButtonElement> ) => void;
}

const AIMessageFlexBoxItem = ( { index, message, editButton_click }: Props ) => {
    return (
        <React.Fragment>
            <MessageFlexBoxItem index={index} editButton_click={editButton_click}
                message={message} messageBodyStyle={{ background: "rgb(240, 217, 186)", borderColor: "rgb(240, 217, 186)" }}
                senderId={1} editLabel={"編集"} updatedAtLabel={"最終更新日時"} />
        </React.Fragment>
    );
}

export default AIMessageFlexBoxItem;
