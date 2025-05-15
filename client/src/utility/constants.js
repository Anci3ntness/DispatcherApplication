export const USER_ROLES = {
    performer: "PERFORMER",
    dispatcher: "DISPATCHER",
    user: "USER",
    admin: "ADMIN",
};
export const TICKET_SPECIALIST_STATUSES = {
    PENDING: "PENDING",
    WORKING: "WORKING",
    COMPLETED: "COMPLETED",
    RETURNED: "RETURNED",
};
export const TICKET_MAIN_STATUSES = {
    NEW: "NEW",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
    CANCELLED: "CANCELLED",
};
export const ROUTES = {
    main: "/",
    login: "/login",
    registration: "/registration",
    profile: "/profile",
    dispatcher: "/dispatcher",
    admin: "/admin",
    ticket: "/ticket/:ticketId",
    assign: "/assign/:ticketId",
};
