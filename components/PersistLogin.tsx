import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

/**
 * PersistLogin silently verifies/refreshes the auth token on app start when
 * "Trust this device" is enabled. It never unmounts children — the (tabs)
 * layout handles the loading state via isLoading from AuthContext.
 *
 * - If persist is off: clears isLoading immediately; (tabs) redirects to login.
 * - If persist is on and no access token: attempts refresh; (tabs) shows a
 *   loader until isLoading is cleared (success or fail).
 */
export function PersistLogin({ children }: { children: React.ReactNode }) {
	const refresh = useRefreshToken();
	const { auth, persist, persistLoaded, setIsLoading } = useAuth();

	useEffect(() => {
		if (!persistLoaded) return;

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
	}, [persist, persistLoaded]);

	return <>{children}</>;
}
