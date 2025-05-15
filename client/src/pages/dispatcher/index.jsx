import React, { useContext, useEffect, useState } from "react";
import styles from "./Dispatcher.module.scss";
import { getAllTicketsByStatus } from "../../api/http/ticketAPI.js";
import { ROUTES, TICKET_MAIN_STATUSES } from "../../utility/constants.js";
import { showNotification } from "../../utility/showNotification.js";
import { socket } from "../../api/socketio/index.js";
import { useNavigate } from "react-router-dom";
import Ticket from "../../components/Ticket/index.jsx";
import Spinner from "../../components/Spinner/index.jsx";
import { observer } from "mobx-react-lite";
import { Context } from "../../main.jsx";
import multiModuleStyles from "../../utility/multiModuleStyles.js";

function DispatcherPage() {
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [fadingItems, setFadingItems] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(Context);
    async function getTickets() {
        setLoading(true);
        getAllTicketsByStatus(TICKET_MAIN_STATUSES.NEW)
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
    function takeTicketByDispatcher(ticketId) {
        socket.emit("ticket:take", { ticketId });
    }
    useEffect(() => {
        getTickets();
        socket.connect();
        socket.emit("ticket-dispatcher-pool:subscribePool");

        socket.on("ticket:create", ({ ticketWithClient }) => {
            setTickets(prev => {
                return [...prev, ticketWithClient];
            });
        });
        socket.on("ticket:ready", ({ dispatcherId, ticketId }) => {
            if (dispatcherId === user.user.id) navigate(ROUTES.ticket.replace(":ticketId", ticketId));
        });
        socket.on("ticket:removed", ({ ticketId }) => {
            setFadingItems(prev => [...prev, ticketId]);
            setTimeout(() => {
                setTickets(prev => {
                    return [...prev.filter(ticket => ticket.id !== ticketId)];
                });
                setFadingItems(prev => prev.filter(fid => fid !== ticketId));
            }, 300); // должен совпадать с длительностью анимации
        });
        socket.on("ticket-dispatcher-pool:error", msg => {
            showNotification(msg.reason);
            socket.disconnect();
            navigate("/");
        });
        socket.on("ticket:take_failed", msg => {
            showNotification(msg.reason);
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={styles.root}>
            <Spinner isLoading={loading} />
            <h1>Диспетчерская служба</h1>
            <div className={styles.dispatcherpage}>
                <h2>Новые заявки</h2>
                {tickets.length === 0 && <div className={styles.default}>Сейчас нет новых заявок</div>}
                <div className={styles.ticketcontainer}>
                    {tickets.map(ticket => {
                        return (
                            <Ticket
                                className={multiModuleStyles(
                                    styles.ticket,
                                    fadingItems.includes(ticket.id) ? styles.fadeOut : ""
                                )}
                                key={ticket.id}
                                id={ticket.id}
                                creator={ticket.client?.name}
                                status={ticket.status}
                                topic={ticket.topic}
                                address={ticket.address}
                                startTime={ticket.createdAt}
                                onClick={event => {
                                    event.preventDefault();
                                    takeTicketByDispatcher(ticket.id);
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default observer(DispatcherPage);
