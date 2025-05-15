import React, { useContext, useEffect, useState } from "react";
import styles from "./AuthPage.module.scss";
import Input from "../../components/common/Input/index.jsx";
import Button from "../../components/common/Button/index.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../utility/constants.js";
import { login, registration } from "../../api/http/userAPI.js";
import { Context } from "../../main.jsx";
import { observer } from "mobx-react-lite";
import { showNotification } from "../../utility/showNotification.js";
function AuthPage() {
    const [loginValue, setLoginValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location?.pathname === ROUTES.login;
    useEffect(() => {
        setLoginValue("");
        setPasswordValue("");
    }, [isLogin]);

    const authHandler = async () => {
        try {
            if (loginValue.length === 0 || passwordValue.length === 0) return;
            let data;
            if (isLogin) {
                data = await login(loginValue, passwordValue);
            } else {
                data = await registration(loginValue, passwordValue);
            }
            user.setUser(data);
            user.setIsAuth(true);
            navigate(ROUTES.main);
        } catch (err) {
            showNotification(err?.response?.data?.message || err.message);
        }
    };
    return (
        <div className={styles.root}>
            <div className={styles.authwrapper}>
                <h1>{isLogin ? "Авторизация" : "Регистрация"}</h1>
                <Input
                    className={styles.input}
                    placeholder="Введите email"
                    type="text"
                    autoComplete="off"
                    value={loginValue}
                    onChange={({ target }) => {
                        setLoginValue(target.value);
                    }}
                    readOnly={!isLogin}
                    onFocus={({ target }) => {
                        target.removeAttribute("readonly");
                    }}
                />
                <Input
                    className={styles.input}
                    placeholder="Введите пароль"
                    type="password"
                    autoComplete={isLogin ? "off" : "new-password"}
                    aria-autocomplete="inline"
                    value={passwordValue}
                    onChange={({ target }) => {
                        setPasswordValue(target.value);
                    }}
                    readOnly={!isLogin}
                    onFocus={({ target }) => {
                        target.removeAttribute("readonly");
                    }}
                />

                <Button className={styles.btn} onClick={authHandler}>
                    {isLogin ? "Войти" : "Зарегистрироваться"}
                </Button>

                <div className={styles.infotext}>
                    {isLogin ? (
                        <Link to={ROUTES.registration}>Зарегистрироваться в системе</Link>
                    ) : (
                        <Link to={ROUTES.login}>Войти в личный кабинет</Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default observer(AuthPage);
