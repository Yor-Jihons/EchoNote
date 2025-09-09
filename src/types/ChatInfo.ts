import ChatListItem from "./ChatListItem";
import MessageListItem from "./MessageListItem";
import SummaryListItem from "./SummaryListItem";

export default interface ChatInfo{
    id: number;
    chat: ChatListItem;
    messages: MessageListItem[];
    summary: SummaryListItem;
}
