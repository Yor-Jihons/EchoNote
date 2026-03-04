import { Link } from "react-router-dom";
import styles from "./chatItem4allchats.module.css";
import ChatListItem from '../../types/ChatListItem';

interface ButtonProps {
  chatItem: ChatListItem;
  idx: number;
}

const ChatItem4AllChats = ({ chatItem, idx }: ButtonProps) => {
  return (
    <div className={styles.chat_item} key={idx}>
      <p>
        <Link to={`/chats/${chatItem.id}`} data-id={chatItem.id} className={styles.link_as_anchor}>
          {chatItem.id}: {chatItem.chat_name}
        </Link>
      </p>
    </div>
  );
};

export default ChatItem4AllChats;
