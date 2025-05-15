import { authHost } from ".";

export const create = async (topic, address) => {
    try {
        const { data } = await authHost.post("api/ticket/create", { topic, address });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getTicketById = async ticketId => {
    try {
        const { data } = await authHost.get(`api/ticket/${ticketId}`);
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const getAllTicketsByStatus = async status => {
    try {
        const { data } = await authHost.get("api/ticket/getAll", { params: { status } });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getAssignTicket = async ticketId => {
    try {
        const { data } = await authHost.get("api/ticket/getAssignTicket", { params: { ticketId } });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const getTicketByUser = async () => {
    try {
        const { data } = await authHost.get("api/ticket/getByUser");
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const getTicketByDispatcher = async () => {
    try {
        const { data } = await authHost.get("api/ticket/getByDispatcher");
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const getTicketBySpecialist = async () => {
    try {
        const { data } = await authHost.get("api/ticket/getBySpecialist");
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const getTicketStatusHistory = async ticketId => {
    try {
        const { data } = await authHost.get("api/ticket/getTicketStatusHistory", { params: { ticketId } });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const updateTicketStatus = async (ticketId, status) => {
    try {
        const { data } = await authHost.put("api/ticket/updateTicketStatus", { ticketId, status });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const assignSpecialistToTicket = async (ticketId, specialistId) => {
    try {
        const { data } = await authHost.post("api/ticket/assignSpecialistToTicket", { ticketId, specialistId });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const updateAssign = async (id, status, note) => {
    try {
        const { data } = await authHost.put("api/ticket/updateAssign", { id, status, note });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
