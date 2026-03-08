import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export default function ProfileScreen() {
    return (
        <View className="flex-1 justify-center items-center bg-white" >
            <Text>Profile</Text>
            <Button variant="destructive">
                <Text>Click me</Text>
            </Button>
        </View>
    );
}