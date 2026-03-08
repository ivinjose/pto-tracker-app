import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const PERSIST_KEY = "persist";

const getPersist = async () => {
	if (Platform.OS === "web") {
		try {
			const value = localStorage.getItem(PERSIST_KEY);
			return value != null ? JSON.parse(value) : false;
		} catch {
			return false;
		}
	}
	try {
		const value = await SecureStore.getItemAsync(PERSIST_KEY);
		return value != null ? JSON.parse(value) : false;
	} catch {
		return false;
	}
};

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const [persist, setPersist] = useState(false);

	useEffect(() => {
		getPersist().then(setPersist);
	}, []);

	return (
		<AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;