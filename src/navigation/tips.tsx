import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TipsScreen from '@/pages/tips';
import TipScreen from '@/pages/tips/tip';
import {TipsStackParams} from '@/types/navigation';

const Stack = createStackNavigator<TipsStackParams>();

export default function TipsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="tips"
      id="tips-stack">
      <Stack.Screen name="tips" component={TipsScreen} />
      <Stack.Screen name="tip" component={TipScreen} />
    </Stack.Navigator>
  );
}
