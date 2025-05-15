import React, { useContext } from "react";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { Context } from "../../../../main.jsx";
import { observer } from "mobx-react-lite";
import {} from "../../../../routes.js";
import { ROUTES, USER_ROLES } from "../../../../utility/constants.js";

function Header() {
    const { user } = useContext(Context);

    return (
        <header className={styles.header}>
            <div className={styles.header__inner}>
                <Link to={ROUTES.main}>
                    <img
                        className={styles.logo}
                        src={window.location.origin + "/Dispatcher_Logo.png"}
                        alt="Диспетчерская служба"
                    ></img>
                </Link>

                <nav className={styles.nav}></nav>
                {user.isAuth ? (
                    <div className={styles.profile}>
                        <div className={styles.login}>{user.user?.name}</div>
                        <div className={styles.wrapper}>
                            <div className={styles.options}>
                                {user.user?.role === USER_ROLES.admin && (
                                    <Link to={ROUTES.admin} className={styles.option} onClick={() => {}}>
                                        Админ-панель
                                    </Link>
                                )}
                                {(user.user?.role === USER_ROLES.dispatcher ||
                                    user.user?.role === USER_ROLES.admin) && (
                                    <Link to={ROUTES.dispatcher} className={styles.option} onClick={() => {}}>
                                        Панель диспетчера
                                    </Link>
                                )}

                                <Link to={ROUTES.profile} className={styles.option} onClick={() => {}}>
                                    Профиль
                                </Link>
                                <Link
                                    to={ROUTES.login}
                                    className={styles.option}
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        user.setUser({});
                                        user.setIsAuth(false);
                                    }}
                                >
                                    Выйти
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link to="/login">
                        <div className={styles.auth}>Авторизация</div>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default observer(Header);
