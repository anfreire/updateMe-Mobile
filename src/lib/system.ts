import {NativeModules} from 'react-native';
const {System} = NativeModules;

export function simulateBackPress() {
  System.simulateBackPress();
}
