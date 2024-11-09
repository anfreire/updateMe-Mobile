import * as React from 'react';
import AppScreen from '@/pages/app';
import HomeScreen from '@/pages/home';
import {createStackNavigator} from '@react-navigation/stack';
import {AppsStackParams} from '@/types/navigation';

const Stack = createStackNavigator<AppsStackParams>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="apps"
      id="apps-stack"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="apps" navigationKey="apps" component={HomeScreen} />
      <Stack.Screen name="app" navigationKey="app" component={AppScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
