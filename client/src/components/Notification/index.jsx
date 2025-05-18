import { useEffect, useState } from "react";
import styles from "./Notification.module.scss";
import { registerNotification } from "../../utility/showNotification.js";
import multiModuleStyles from "../../utility/multiModuleStyles.js";

export default function NotificationContainer() {
    const [message, setMessage] = useState(null);
    const [danger, setDanger] = useState(null);
    useEffect(() => {
        registerNotification((msg, isDanger) => {
            setMessage(msg);
            setDanger(isDanger);
            setTimeout(() => {
                setMessage(null);
                setDanger(null);
            }, 3000);
        });
    }, []);

    if (!message) return null;

    return (
        <div className={multiModuleStyles(styles.root, danger ? styles.danger : "")}>
            <strong>{danger ? "Ошибка" : "Успешно"}:</strong> {message}
        </div>
    );
}
