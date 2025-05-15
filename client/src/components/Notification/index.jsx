import { useEffect, useState } from "react";
import styles from "./Notification.module.scss";
import { registerNotification } from "../../utility/showNotification.js";

export default function NotificationContainer() {
    const [message, setMessage] = useState(null);

    useEffect(() => {
        registerNotification(msg => {
            setMessage(msg);
            setTimeout(() => setMessage(null), 3000);
        });
    }, []);

    if (!message) return null;

    return (
        <div className={styles.root}>
            <strong>Ошибка:</strong> {message}
        </div>
    );
}
