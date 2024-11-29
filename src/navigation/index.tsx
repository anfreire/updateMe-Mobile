import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const SampleScreen = () => <></>;

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={SampleScreen} />
      <Drawer.Screen name="Settings" component={SampleScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
