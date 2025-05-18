import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./TicketPage.module.scss";
import Spinner from "../../components/Spinner/index.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../utility/showNotification.js";
import { socket } from "../../api/socketio/index.js";
import { Context } from "../../main.jsx";
import multiModuleStyles from "../../utility/multiModuleStyles.js";
import Button from "../../components/common/Button/index.jsx";
import { getHistoryByTicket } from "../../api/http/chatAPI.js";
import { observer } from "mobx-react-lite";
import Input from "../../components/common/Input/index.jsx";
import { TICKET_MAIN_STATUSES, USER_ROLES } from "../../utility/constants.js";
import Select from "../../components/common/Select/index.jsx";
import {
    assignSpecialistToTicket,
    getAssignTicket,
    getTicketById,
    updateTicketStatus,
} from "../../api/http/ticketAPI.js";
import { getPerformers } from "../../api/http/userAPI.js";

function TicketPage() {
    const [loading, setLoading] = useState(false);
    const { ticketId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);
    const navigate = useNavigate();
    const [newStatus, setNewStatus] = useState("");
    const [newSpecialist, setNewSpecialist] = useState("");
    const [performers, setPerformers] = useState([]);
    const [ticket, setTicket] = useState({});
    const [assign, setAssign] = useState({});
    async function getDialogHistory() {
        setLoading(true);
        getHistoryByTicket(ticketId)
            .then(data => {
                setMessages(data);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    async function geTicket() {
        setLoading(true);
        getTicketById(ticketId)
            .then(data => {
                setTicket(data);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    async function getUsersPerformers() {
        setLoading(true);
        getPerformers()
            .then(data => {
                setPerformers(data);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
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

    const { user } = useContext(Context);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        getDialogHistory();
        geTicket();
        getUsersPerformers();
        getAssignTicketByTicketId();
        socket.connect();
        socket.emit("chat:join", { ticketId });

        socket.on("chat:message", msg => {
            setMessages(prev => [...prev, msg]);
        });
        socket.on("chat:error", msg => {
            showNotification(msg.reason);
            socket.disconnect();
            navigate("/");
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;

        const msg = {
            ticketId,
            message: input.trim(),
        };

        socket.emit("chat:message", msg);
        setInput("");
    };
    const handleKeyDown = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    return (
        <div className={styles.root}>
            <Spinner isLoading={loading} />
            <h1>Диалог с {user.user.role === USER_ROLES.dispatcher ? "клиентом" : "диспетчером"}</h1>
            <div className={styles.ticketpage}>
                <div className={styles.chat}>
                    {user.user.role === USER_ROLES.dispatcher && (
                        <div className={styles.panel}>
                            <div className={styles.wrapper}>
                                <label>Сменить статус</label>
                                <Select
                                    options={Object.values(TICKET_MAIN_STATUSES).map(e => {
                                        return { name: e, value: e };
                                    })}
                                    value={newStatus || ticket.status}
                                    onChange={({ target }) => {
                                        setNewStatus(target.value);
                                    }}
                                    notNull={true}
                                />
                            </div>
                            <div className={styles.wrapper}>
                                <label>Назначить специалиста</label>
                                <Select
                                    value={ticket?.specialist?.name || newSpecialist}
                                    options={
                                        ticket?.specialist?.name === undefined
                                            ? performers.map(e => {
                                                  return { name: e.name, value: e.id };
                                              })
                                            : [ticket?.specialist].map(e => {
                                                  return { name: e.name, value: e.id };
                                              })
                                    }
                                    onChange={({ target }) => {
                                        setNewSpecialist(target.value);
                                    }}
                                    notNull={ticket?.specialist?.name !== undefined}
                                />
                            </div>
                            <Button
                                onClick={async () => {
                                    if (newSpecialist) await assignSpecialistToTicket(ticketId, newSpecialist);
                                    if (newStatus) await updateTicketStatus(ticketId, newStatus);
                                    showNotification("Сведения обновлены", false);
                                }}
                            >
                                Применить
                            </Button>
                        </div>
                    )}
                    {assign?.id !== undefined && (
                        <div className={styles.specialistinfo}>
                            <div style={{ fontWeight: "500" }}>Состояние работы специалиста</div>
                            <div>Имя: {ticket?.specialist?.name}</div>
                            <div>Статус: {assign?.specialistStatus}</div>
                            <div>Заметка: {assign?.note}</div>
                        </div>
                    )}
                    {messages.length === 0 && <div className={styles.placeholder}>Диалог пуст</div>}
                    {messages.map((msg, i) => {
                        const isOwn = msg.senderId === user.user.id;

                        const time = new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        return (
                            <div
                                key={i}
                                className={multiModuleStyles(styles.chat_message, isOwn ? styles.own : styles.other)}
                            >
                                <div className={styles.bubble}>
                                    <div className={styles.text}>{msg.message}</div>
                                    <div className={styles.time}>{time}</div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>
                <div className={styles.chat_input}>
                    <Input
                        placeholder="Введите сообщение..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={300}
                    />
                    <Button onClick={sendMessage}>Отправить</Button>
                </div>
            </div>
        </div>
    );
}

export default observer(TicketPage);
