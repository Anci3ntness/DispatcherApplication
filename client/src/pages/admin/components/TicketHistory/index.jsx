import React, { useEffect, useState } from "react";
import styles from "./TicketHistory.module.scss";
import Select from "../../../../components/common/Select/index.jsx";

import Spinner from "../../../../components/Spinner/index.jsx";

import { showNotification } from "../../../../utility/showNotification.js";
import { getAllTicketsByStatus, getTicketStatusHistory } from "../../../../api/http/ticketAPI.js";
function TicketHistory() {
    const [selected, setSelected] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [tickets, setTickets] = useState([]);
    async function getTickets() {
        setLoading(true);
        getAllTicketsByStatus()
            .then(data => {
                setTickets(data.rows);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    async function historyRequest(value) {
        setLoading(true);
        getTicketStatusHistory(value)
            .then(res => {
                if (!res) return;
                setHistory(res);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    useEffect(() => {
        if (!selected) return;
        historyRequest(selected);
    }, [selected]);
    useEffect(() => {
        getTickets();
    }, []);

    return (
        <div className={styles.root}>
            <Spinner isLoading={loading} />
            <h2>Изменить роль пользователя</h2>
            <div className={styles.adminpage}>
                <div className={styles.adminheader}>
                    <h3>Выберите заявку</h3>
                    <Select
                        value={selected}
                        options={tickets.map(({ id }) => {
                            return { name: id, value: id };
                        })}
                        onChange={({ target }) => {
                            setSelected(target.value);
                        }}
                        className={styles.inputcomponent}
                    />
                </div>
                <div className={styles.wrapper}>
                    {history.map(elem => {
                        return (
                            <div className={styles.status}>
                                <div>{elem.oldStatus}</div>
                                <div>перешло в</div>
                                <div>{elem.newStatus}</div>
                                <div>{new Date(elem.createdAt).toLocaleString("ru-RU")}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default TicketHistory;
