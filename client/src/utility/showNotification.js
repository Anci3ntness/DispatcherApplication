let callback = null;
export function registerNotification(cb) {
    callback = cb;
}
export function showNotification(message) {
    if (callback) {
        callback(message);
    } else {
        console.warn("NotificationContainer не подключен");
    }
}
