import React from 'react';
import { UserRouters } from "../../utils/const.jsx";
import { Route, Routes } from "react-router-dom";

const UserLayout = () => {
    return (
        <div>
            <Routes>
                {UserRouters.map(({ Path, Component }, index) => (
                    <Route key={index} path={Path} element={<Component />} />
                ))}
            </Routes>
        </div>
    );
};

export default UserLayout;
