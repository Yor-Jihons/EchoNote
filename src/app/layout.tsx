//import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const CommonLayout = () => {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
            <Outlet />
        </div>
    )
};

export default CommonLayout;
