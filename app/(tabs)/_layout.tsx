import React from 'react';

import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import useAuth from '../../hooks/useAuth';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AppLayout() {
	const colorScheme = useColorScheme();
	const { auth, isLoading } = useAuth();

	// 1. Show a loader while checking the token (Step 3 logic)
	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	// 2. If no token, redirect to Login (The ProtectedRoute logic)
	if (!auth?.id) {
		return <Redirect href="/(auth)/login" />;
	}

	// 3. If logged in, show the Tab Navigation
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
				}} />
			<Tabs.Screen name="manage" options={{ title: 'Manage' }} />
			<Tabs.Screen name="train-bookings" options={{ title: 'Trains' }} />
			<Tabs.Screen name="profiles" options={{ title: 'Profiles' }} />
		</Tabs>
	);
}