import React, { useEffect, useState } from "react";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import SummaryListItem from "../../types/SummaryListItem";
import DOMPurify from 'dompurify';
import styles from "./summarydrawer.module.css";

interface Props {
    summary: SummaryListItem;
    isSummaryDrawerOpen: boolean;
    onClose: () => void;
    onInput: ( newText: string ) => void;
}

const SummaryDrawer = ( { isSummaryDrawerOpen, summary, onInput, onClose }: Props ) => {
    const [isEditMode, setIsEditMode] = useState<boolean>( false );
    const [summaryText, setSummaryText] = useState<string>( summary.summary_txt );

    useEffect( () => {
        if( isSummaryDrawerOpen ){
            setIsEditMode(false);
        }
    }, [ isSummaryDrawerOpen ] );

    useEffect( () => {
        setSummaryText( summary.summary_txt );
    }, [ summary ] );

    const editButton_click = () => {
        setIsEditMode( !isEditMode );
    }

    const textarea_input = ( event:  React.FormEvent<HTMLTextAreaElement> ) => {
        const v = event.currentTarget.value;
        setSummaryText( v );
        onInput( v );
    }

    return (
        <React.Fragment>
            <Drawer open={isSummaryDrawerOpen} onClose={onClose} direction="bottom" className={styles.drawer_content_custom}>
                {!isEditMode ? <button className={styles.edit_button} onClick={editButton_click}>編集モードへ</button>
                    : <button className={styles.edit_button} onClick={editButton_click}>テキストモードへ</button>}
                <p></p>
                {isEditMode ? <div><textarea className={styles.summary_input} defaultValue={summaryText} onInput={textarea_input}></textarea></div>
                    : <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( summaryText ) }} className={styles.summary_output} />}
                <p>最終更新日時: {summary.updated_at}</p>
            </Drawer>
        </React.Fragment>
    );
}

export default SummaryDrawer;
