//import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Outlet } from "react-router-dom";
import LeftSide from "../components/LeftSide/LeftSide";

const CommonLayout = () => {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={20} minSize={1}>
                    <div className="panel-content">
                        <LeftSide />
                    </div>
                </Panel>

                <PanelResizeHandle style={{ width: "5px", background: "#ccc" }} />

                <Panel defaultSize={80} minSize={1}>
                    <div className="panel-content">
                        <Outlet />
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    )
};

export default CommonLayout;
