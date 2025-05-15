import React, { useState } from "react";
import styles from "./AdminPage.module.scss";
import ChangeUserRole from "./components/ChangeUserRole/index.jsx";
import TicketHistory from "./components/TicketHistory/index.jsx";

function AdminPage() {
    const [selected, setSelected] = useState("");
    return (
        <div className={styles.root}>
            <h1>Админ-Панель</h1>
            <div className={styles.adminpage}>
                <div className={styles.gridcontainer}>
                    <div
                        className={styles.griditem}
                        onClick={() => {
                            setSelected("updateRole");
                        }}
                    >
                        Изменить роль пользователя
                    </div>

                    <div
                        className={styles.griditem}
                        onClick={() => {
                            setSelected("historyTicket");
                        }}
                    >
                        Посмотреть историю заявки
                    </div>
                </div>
                {selected === "updateRole" && <ChangeUserRole />}
                {selected === "historyTicket" && <TicketHistory />}
            </div>
        </div>
    );
}

export default AdminPage;
