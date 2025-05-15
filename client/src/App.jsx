import "./styles/globals.scss";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import AppRouter from "./components/AppRouter.jsx";
import NotificationContainer from "./components/Notification/index.jsx";
import { Context } from "./main.jsx";
import { check } from "./api/http/userAPI.js";
import Spinner from "./components/Spinner/index.jsx";
function App() {
    const [loading, setLoading] = useState(true);
    const { user } = useContext(Context);
    async function checkRequest() {
        setLoading(true);
        check()
            .then(data => {
                user.setUser(data);
                user.setIsAuth(true);
            })
            .catch(() => {
                user.setUser({});
                user.setIsAuth(false);
            })
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        checkRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <BrowserRouter>
            {loading ? <Spinner isLoading={loading} /> : <AppRouter />}
            <NotificationContainer />
        </BrowserRouter>
    );
}

export default observer(App);
