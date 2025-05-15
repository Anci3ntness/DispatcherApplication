import React, { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import Ticket from "../../components/Ticket/index.jsx";
import { getTicketByDispatcher, getTicketBySpecialist, getTicketByUser } from "../../api/http/ticketAPI.js";
import { showNotification } from "../../utility/showNotification.js";
import Spinner from "../../components/Spinner/index.jsx";
import { socket } from "../../api/socketio/index.js";
import { observer } from "mobx-react-lite";
import { ROUTES, USER_ROLES } from "../../utility/constants.js";
import { Context } from "../../main.jsx";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(Context);
    const navigate = useNavigate();
    async function checkRole() {
        if (user.user.role === USER_ROLES.dispatcher) return await getTicketByDispatcher();
        else if (user.user.role === USER_ROLES.performer) return await getTicketBySpecialist();
        return await getTicketByUser();
    }
    async function getTickets() {
        setLoading(true);
        checkRole()
            .then(data => {
                setTickets(data?.rows || []);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        getTickets();
        socket.connect();
        socket.emit("ticket-user-pool:join");

        socket.on("ticket:statusUpdated", updatedTicket => {
            setTickets(prev => prev.map(ticket => (ticket.id === updatedTicket.id ? { ...updatedTicket } : ticket)));
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.root}>
            <Spinner isLoading={loading} />
            <h1>Личный кабинет</h1>
            <div className={styles.profilepage}>
                <h2>Мои заявки</h2>
                {tickets.length === 0 && <div className={styles.default}>Вы не создали ни одной заявки</div>}
                <div className={styles.ticketcontainer}>
                    {tickets.map(value => {
                        const ticket = value.Ticket !== undefined ? value.Ticket : value;

                        return (
                            <Ticket
                                key={ticket.id}
                                id={ticket.id}
                                creator={ticket.client?.name}
                                status={ticket.status}
                                topic={ticket.topic}
                                address={ticket.address}
                                startTime={ticket.createdAt}
                                onClick={e => {
                                    if (user.user.role === USER_ROLES.performer) {
                                        e.preventDefault();
                                        navigate(ROUTES.assign.replace(":ticketId", ticket.id));
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default observer(ProfilePage);
