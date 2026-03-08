import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import axios from "../api/axios";
import useAuth from "./useAuth";
import { REFRESH_TOKEN_KEY } from "./useRefreshToken";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});

        try {
            if (Platform.OS === "web") {
                await axios("/api/logout", { withCredentials: true });
            } else {
                await axios("/api/logout", {
                    headers: await getAuthHeadersForLogout(),
                });
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return logout;
};

/** Mobile: send refresh token so backend can invalidate it */
async function getAuthHeadersForLogout() {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export default useLogout;