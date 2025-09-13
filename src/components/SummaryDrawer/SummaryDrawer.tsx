import React from "react";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import SummaryListItem from "../../types/SummaryListItem";

interface Props {
    summary: SummaryListItem;
    isSummaryDrawerOpen: boolean;
    onClose: () => void;
}

/*
    The data which I need:
      * summary
        * id
        * summary_txt
        * created_at
        * updated_at
*/

const SummaryDrawer = ( { isSummaryDrawerOpen, summary, onClose }: Props ) => {
    return (
        <React.Fragment>
            <Drawer open={isSummaryDrawerOpen} onClose={onClose} direction="bottom">
                <p>{summary?.summary_txt}</p>
            </Drawer>
        </React.Fragment>
    );
}

export default SummaryDrawer;
