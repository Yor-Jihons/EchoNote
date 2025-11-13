import styles from "./infodialog.module.css";
import ChatInfo from '../../types/ChatInfo';

interface Props {
    chatInfo: ChatInfo;
    isInfoDialogShow: boolean;
    onClose: () => void;
}

const InfoDialog = ({ chatInfo, isInfoDialogShow, onClose }: Props) => {
    return (
        <dialog open={isInfoDialogShow}>
            <fieldset className={styles.fieldset1}>
                <legend>情報</legend>
                <p><span className={styles.label_place}>チャット名:</span> {chatInfo.chat.chat_name}</p>
                <p><span className={styles.label_place}>AIアシスタント名:</span> {chatInfo.chat.ai_type || "---"}</p>
                <p><span className={styles.label_place}>作成日時:</span> {chatInfo.chat.created_at}</p>
                <p><span className={styles.label_place}>説明/備考:</span> <span className={styles.description}>{chatInfo.chat.description_txt || "---"}</span></p>
            </fieldset>
            <button onClick={onClose}>CLOSE</button>
        </dialog>
    );
};

export default InfoDialog;
