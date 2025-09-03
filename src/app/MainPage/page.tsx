//import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { useTranslation } from 'react-i18next';
import '../../App.css';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function MainPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={1} minSize={1}>
          <div className="panel-content">
            <h2>左パネル</h2>
            <p>ここにコンテンツが入ります。</p>
          </div>
        </Panel>

        <PanelResizeHandle style={{ width: "5px", background: "#ccc" }} />

        <Panel defaultSize={99} minSize={1}>
          <div className="panel-content">
            <h2>右パネル</h2>
            <p>ここにコンテンツが入ります。</p>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default MainPage;
