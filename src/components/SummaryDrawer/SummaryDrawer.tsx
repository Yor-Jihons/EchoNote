import React, { useState } from "react";
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

/*
    The data which I need:
      * summary
        * id
        * summary_txt
        * created_at
        * updated_at
*/

const SummaryDrawer = ( { isSummaryDrawerOpen, summary, onInput, onClose }: Props ) => {
    const [isEditMode, setIsEditMode] = useState<boolean>( false );
    const [summaryText, setSummaryText] = useState<string>( summary.summary_txt );

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
            <Drawer open={isSummaryDrawerOpen} onClose={onClose} direction="bottom" className={styles.drawer}>
                <button className={styles.edit_button} onClick={editButton_click}>編集モードへ</button>
                {!isEditMode ? <div><textarea className={styles.text_input} defaultValue={summaryText} onInput={textarea_input}></textarea></div>
                    : <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( summaryText ) }} />}
                <button>OK</button>
            </Drawer>
        </React.Fragment>
    );
}

export default SummaryDrawer;
