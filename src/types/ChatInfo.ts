import ChatListItem from "./ChatListItem";
import MessageListItem from "./MessageListItem";

export default interface ChatInfo{
    id: number;
    chat: ChatListItem;
    messages: MessageListItem[];
}
