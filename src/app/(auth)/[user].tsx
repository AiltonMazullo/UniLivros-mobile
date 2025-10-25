import { Text, View } from 'react-native';
import { useLocalSearchParams } from "expo-router";

export default function User() {
  const { user } = useLocalSearchParams();
  return (
    <View>
      <Text>User: {user}</Text>
    </View>
  );
}