import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TipsScreen from '@/pages/tips';
import {TipsStackParams} from '@/types/navigation';
import TipScreen from '@/pages/tips/components/TipScreen';

const Stack = createStackNavigator<TipsStackParams>();

export default function TipsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="tips"
      id="tips-stack">
      <Stack.Screen name="tips" navigationKey="tips" component={TipsScreen} />
      <Stack.Screen name="tip" navigationKey="tip" component={TipScreen} />
    </Stack.Navigator>
  );
}
