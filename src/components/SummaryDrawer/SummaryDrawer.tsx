import React from "react";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import SummaryListItem from "../../types/SummaryListItem";

interface Props {
    summary: SummaryListItem;
    isSummaryDrawerOpen: boolean;
    onClose: () => void;
}


const SummaryDrawer = ( { isSummaryDrawerOpen, summary, onClose }: Props ) => {
    return (
        <React.Fragment>
            <Drawer open={isSummaryDrawerOpen} onClose={onClose} direction="right">
                <p>{summary?.summary_txt}</p>
            </Drawer>
        </React.Fragment>
    );
}

export default SummaryDrawer;
