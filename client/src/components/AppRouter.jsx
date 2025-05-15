import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import { authRoutes, publicRoutes } from "../routes.js";

import MainLayout from "../layouts/MainLayout";
import { ROUTES } from "../utility/constants.js";

function AppRouter() {
    const { user } = useContext(Context);

    const getLayout = () => {
        return MainLayout;
    };
    const Layout = getLayout();
    return (
        <Layout>
            <Routes>
                {user.isAuth &&
                    authRoutes.map(({ path, Component, requireRoles }) => {
                        if (requireRoles !== undefined && !requireRoles.includes(user.user?.role)) return <></>;
                        return <Route key={path} path={path} Component={Component} />;
                    })}
                {publicRoutes.map(({ path, Component }) => {
                    return <Route key={path} path={path} Component={Component} />;
                })}
                <Route path="*" element={<Navigate to={user.isAuth ? ROUTES.main : ROUTES.login} />} />
            </Routes>
        </Layout>
    );
}
export default observer(AppRouter);
