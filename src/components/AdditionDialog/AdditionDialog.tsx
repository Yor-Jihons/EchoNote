import React, { useEffect, useRef } from "react";
import styles from "./additiondialog.module.css";
import aiAssistants from "../../utils/AIAssistants";

interface Props {
    isOpen: boolean;
    onSubmit: ( chatName: string, aiType: string, description: string ) => void;
    onClose: () => void;
}

const AdditionDialog = ( { isOpen, onSubmit, onClose }: Props ) => {
    const dialogRef = useRef<HTMLDialogElement>( null );

    const [chatName, setChatName] = React.useState( '' );
    const [aiType, setAiType] = React.useState( '' );
    const [description, setDescription] = React.useState( '' );

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
        onSubmit( chatName, aiType, description );
    };

    return (
        <React.Fragment>
            <dialog ref={dialogRef} onCancel={onClose} id="add-chat-dialog" className={styles.dialog}>
                <form onSubmit={handleSubmit} className={styles.additiondialog_form} action="" method="post">
                    <div className={styles.content_area}>
                        <h3 className={styles.dialog_header}>チャットの追加</h3>
                        <p>
                            <label htmlFor="chat_name" className={styles.label1}>チャット名 (必須):</label>
                            <input id="chat_name" type="text" className={styles.textbox1} minLength={3} placeholder="Enter the chat name."
                                value={chatName} onChange={ (e) => setChatName( e.target.value ) } required />
                        </p>
                        <p>
                            <label htmlFor="ai_type" className={styles.label1}>AIアシスタント名:</label>
                            <input id="ai_type" list="ai-assistants" type="text" className={styles.textbox1} placeholder="Gemini, Microsoft Copilot, ChatGPT etc."
                                value={aiType} onChange={ (e) => setAiType( e.target.value ) } />

                            <datalist id="ai-assistants">
                                {aiAssistants.map( (aiAssistant, idx) => <option value={aiAssistant} key={idx}></option>)}
                            </datalist>
                        </p>
                        <p>
                            <label htmlFor="description" className={styles.label2}>説明/備考:</label>
                            <textarea id="description" className={styles.textbox2}
                                value={description} onChange={ (e) => setDescription( e.target.value ) } />
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
