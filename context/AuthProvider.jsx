import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import { Platform } from "react-native";

import { PERSIST_KEY } from "../constants/auth";

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
	const [persistLoaded, setPersistLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getPersist()
			.then((value) => {
				setPersist(value);
			})
			.finally(() => {
				setPersistLoaded(true);
			});
	}, []);

	useEffect(() => {
		if (!persistLoaded) return;
		const savePersist = async () => {
			try {
				if (Platform.OS === "web") {
					localStorage.setItem(PERSIST_KEY, JSON.stringify(persist));
				} else {
					await SecureStore.setItemAsync(PERSIST_KEY, JSON.stringify(persist));
				}
			} catch {
				// Ignore storage errors
			}
		};
		savePersist();
	}, [persist, persistLoaded]);

	return (
		<AuthContext.Provider
			value={{ auth, setAuth, persist, setPersist, persistLoaded, isLoading, setIsLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;