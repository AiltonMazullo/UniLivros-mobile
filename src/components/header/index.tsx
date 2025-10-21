import { View, Text } from 'react-native';

export function Header() {
  return (
    <View className='w-full h-16 bg-gray-200 flex justify-center items-center'>
      <Text className="text-2xl font-bold text-center">UniLivros</Text>  
    </View>
  );
}