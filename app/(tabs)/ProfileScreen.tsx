import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import useAuth from '../../hooks/useAuth';

export default function ProfileScreen() {
    const { auth } = useAuth();

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text variant="h2">Profile</Text>
            {auth?.name ? <Text className="mt-2 text-muted-foreground">{auth.name}</Text> : null}
        </View>
    );
}