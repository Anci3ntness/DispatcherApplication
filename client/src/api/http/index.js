import axios from "axios";

const host = axios.create({
    baseURL: import.meta.env.VITE_SERVER_HTTP_URL,
    timeout: 7000,
});

const authHost = axios.create({
    baseURL: import.meta.env.VITE_SERVER_HTTP_URL,
    timeout: 7000,
});

const authInterceptor = cfg => {
    cfg.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    return cfg;
};

authHost.interceptors.request.use(authInterceptor);

export { host, authHost };
