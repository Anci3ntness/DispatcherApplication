import { authHost } from ".";

export const getHistoryByTicket = async ticketId => {
    try {
        const { data } = await authHost.get("api/chat/getHistory", { params: { ticketId } });
        return data.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
