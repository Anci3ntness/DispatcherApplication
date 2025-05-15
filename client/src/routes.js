import { ROUTES, USER_ROLES } from "./utility/constants.js";
import Auth from "./pages/auth/index.jsx";
import Main from "./pages/main/index.jsx";
import ProfilePage from "./pages/profile/index.jsx";
import AdminPage from "./pages/admin/index.jsx";
import TicketPage from "./pages/ticket/index.jsx";
import DispatcherPage from "./pages/dispatcher/index.jsx";
import AssignPage from "./pages/assign/index.jsx";

export const authRoutes = [
    {
        path: ROUTES.main,
        Component: Main,
    },
    {
        path: ROUTES.profile,
        Component: ProfilePage,
    },
    {
        path: ROUTES.dispatcher,
        Component: DispatcherPage,
        requireRoles: [USER_ROLES.dispatcher, USER_ROLES.admin],
    },
    {
        path: ROUTES.admin,
        Component: AdminPage,
        requireRoles: [USER_ROLES.admin],
    },
    {
        path: ROUTES.assign,
        Component: AssignPage,
        requireRoles: [USER_ROLES.performer, USER_ROLES.admin],
    },
    {
        path: ROUTES.ticket,
        Component: TicketPage,
    },
];

export const publicRoutes = [
    {
        path: ROUTES.login,
        Component: Auth,
    },
    {
        path: ROUTES.registration,
        Component: Auth,
    },
];
