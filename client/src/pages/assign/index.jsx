import React, { useEffect, useState } from "react";
import styles from "./Assign.module.scss";
import { getAssignTicket, updateAssign } from "../../api/http/ticketAPI.js";
import { TICKET_SPECIALIST_STATUSES } from "../../utility/constants.js";
import { showNotification } from "../../utility/showNotification.js";

import { useParams } from "react-router-dom";

import Spinner from "../../components/Spinner/index.jsx";

import Select from "../../components/common/Select/index.jsx";
import Input from "../../components/common/Input/index.jsx";
import Button from "../../components/common/Button/index.jsx";

function AssignPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [note, setNote] = useState("");
    const [assign, setAssign] = useState({});
    const { ticketId } = useParams();
    async function getAssignTicketByTicketId() {
        setLoading(true);
        getAssignTicket(ticketId)
            .then(data => {
                setAssign(data);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    useEffect(() => {
        getAssignTicketByTicketId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={styles.root}>
            <Spinner isLoading={loading} />
            <h1>Карточка заявки специалиста</h1>
            <div className={styles.assignpage}>
                <div className={styles.wrapper}>
                    <label>Сменить статус</label>
                    <Select
                        value={status || assign.specialistStatus}
                        options={Object.values(TICKET_SPECIALIST_STATUSES).map(e => {
                            return { name: e, value: e };
                        })}
                        onChange={({ target }) => {
                            setStatus(target.value);
                        }}
                        notNull
                    />
                </div>
                <div className={styles.wrapper}>
                    <label>Добавить заметку</label>
                    <Input
                        value={note}
                        onChange={({ target }) => {
                            setNote(target.value);
                        }}
                    />
                </div>
                <Button
                    onClick={async () => {
                        await updateAssign(assign.id, status, note);
                        showNotification("Сведения обновлены", false);
                    }}
                >
                    Применить
                </Button>
            </div>
        </div>
    );
}

export default AssignPage;
