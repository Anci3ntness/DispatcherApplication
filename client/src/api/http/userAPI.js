import { authHost, host } from ".";
import { jwtDecode } from "jwt-decode";
import { USER_ROLES } from "../../utility/constants.js";

export const registration = async (email, password) => {
    try {
        const { data } = await host.post("api/user/registration", { email, password, role: USER_ROLES.user });
        localStorage.setItem("token", data?.token);
        return { ...jwtDecode(data?.token), ...data.data };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const login = async (email, password) => {
    try {
        const { data } = await host.post("api/user/login", { email, password });
        localStorage.setItem("token", data?.token);
        return { ...jwtDecode(data?.token), ...data.data };
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const updateRole = async (id, role) => {
    try {
        const { data } = await authHost.put("api/user/update", { id, role });
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const check = async () => {
    try {
        const { data } = await authHost.get("api/user/check");
        localStorage.setItem("token", data?.token);
        return { ...jwtDecode(data?.token), ...data.data };
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const getUsers = async () => {
    try {
        const { data } = await authHost.get("api/user/all");
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
export const getPerformers = async () => {
    try {
        const { data } = await authHost.get("api/user/allPerformers");
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
