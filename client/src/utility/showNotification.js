let callback = null;
export function registerNotification(cb) {
    callback = cb;
}
export function showNotification(message, isDanger = true) {
    if (callback) {
        callback(message, isDanger);
    } else {
        console.warn("NotificationContainer не подключен");
    }
}
