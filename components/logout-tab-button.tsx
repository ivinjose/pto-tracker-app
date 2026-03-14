import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import useLogout from '../hooks/useLogout';

export function LogoutTabButton(props: BottomTabBarButtonProps) {
	const logout = useLogout();

	return (
		<PlatformPressable
			{...props}
			onPress={(ev) => {
				if (process.env.EXPO_OS === 'ios') {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				logout();
			}}
		/>
	);
}
