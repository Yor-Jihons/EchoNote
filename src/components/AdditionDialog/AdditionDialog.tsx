import React, { useEffect, useRef } from "react";
import styles from "./additiondialog.module.css";

interface Props {
    isOpen: boolean;
    onSubmit: ( chatName: string, aiType: string ) => void;
    onClose: () => void;
}


const AdditionDialog = ( { isOpen, onSubmit, onClose }: Props ) => {
    const dialogRef = useRef<HTMLDialogElement>( null );

    const [chatName, setChatName] = React.useState( '' );
    const [aiType, setAiType] = React.useState( '' );

    useEffect( () => {
        if( dialogRef.current ){
            if( isOpen ){
                dialogRef.current.showModal();
            }else{
                setChatName( "" );
                dialogRef.current.close();
            }
        }
    }, [ isOpen ] );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit( chatName, aiType );
    };

    return (
        <React.Fragment>
            <dialog ref={dialogRef} onCancel={onClose} id="add-chat-dialog" className={styles.dialog}>
                <form onSubmit={handleSubmit} className={styles.additiondialog_form} action="" method="post">
                    <div className={styles.content_area}>
                        <h3 className={styles.dialog_header}>チャットの追加</h3>
                        <p>
                            <label htmlFor="chat_name">チャット名 (必須):</label>
                            <input id="chat_name" type="text" className={styles.textbox}
                                value={chatName} onChange={ (e) => setChatName( e.target.value ) } required />
                        </p>
                        <p>
                            <label htmlFor="ai_type">AIの種類 (任意):</label>
                            <input id="ai_type" type="text" className={styles.textbox}
                                value={aiType} onChange={ (e) => setAiType( e.target.value ) } />
                        </p>
                    </div>
                    <div className={styles.button_area}>
                        <button type="submit" className={styles.submit_button}>追加</button>
                        <button type="button" onClick={onClose} className={styles.cancel_button}>キャンセル</button>
                    </div>
                </form>
            </dialog>
        </React.Fragment>
    );
}

export default AdditionDialog;
