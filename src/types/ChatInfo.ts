import ChatListItem from "./ChatListItem.js";
import MessageListItem from "./MessageListItem.js";
import SummaryListItem from "./SummaryListItem.js";

export default interface ChatInfo{
    id: number;
    chat: ChatListItem;
    messages: MessageListItem[];
    summary: SummaryListItem;
}
