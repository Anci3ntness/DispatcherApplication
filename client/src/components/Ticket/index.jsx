import { useEffect, useState } from "react";
import styles from "./Ticket.module.scss";
import { ROUTES, TICKET_MAIN_STATUSES } from "../../utility/constants.js";
import multiModuleStyles from "../../utility/multiModuleStyles.js";
import { Link } from "react-router-dom";
const THIRTY_MINUTES = 5 * 60 * 1000;
function Ticket({ id, creator, address, topic, status, startTime, className = "", onClick = () => {}, ...props }) {
    const [timeLeft, setTimeLeft] = useState(() => {
        const now = Date.now();
        const start = new Date(startTime).getTime();
        return Math.max(THIRTY_MINUTES - (now - start), 0);
    });
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1000;
                return next <= 0 ? 0 : next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const formatTime = ms => {
        const totalSec = Math.floor(ms / 1000);
        const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
        const sec = String(totalSec % 60).padStart(2, "0");
        return `${min}:${sec}`;
    };
    return (
        <Link
            to={ROUTES.ticket.replace(":ticketId", id)}
            className={multiModuleStyles(
                styles.root,
                timeLeft <= 0 && status === TICKET_MAIN_STATUSES.NEW ? styles.expired : "",
                status === TICKET_MAIN_STATUSES.IN_PROGRESS ? styles.progress : "",
                className
            )}
            onClick={onClick}
            {...props}
        >
            <div className={styles.creator}>Создатель: {creator}</div>
            <div className={styles.topic}>Тема: {topic}</div>
            <div className={styles.address}>Адрес: {address}</div>
            <div className={styles.status}>Статус: {status}</div>
            {status === TICKET_MAIN_STATUSES.NEW && (
                <div className={styles.created}>{timeLeft > 0 ? formatTime(timeLeft) : "00:00"}</div>
            )}
        </Link>
    );
}

export default Ticket;
