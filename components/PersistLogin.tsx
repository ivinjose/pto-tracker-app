import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

/**
 * PersistLogin wraps app content and verifies/refreshes the auth token
 * when the user has "Trust this device" enabled and returns to the app.
 * - If persist is off: resolves immediately and renders children.
 * - If persist is on and no access token: attempts refresh, shows loader until done.
 * - When done (success or fail), renders children; (tabs) layout redirects to login if needed.
 */
export function PersistLogin({ children }: { children: React.ReactNode }) {
	const refresh = useRefreshToken();
	const { auth, persist, setIsLoading, isLoading } = useAuth();

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.warn("Refresh token verification failed:", err);
			} finally {
				setIsLoading(false);
			}
		};

		if (persist && !auth?.accessToken) {
			verifyRefreshToken();
		} else {
			setIsLoading(false);
		}
	}, [persist]);

	// Show loader only while we're verifying (persist on, no token yet)
	if (persist && isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return <>{children}</>;
}
