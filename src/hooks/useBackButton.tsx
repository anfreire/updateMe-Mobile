import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {BackHandler} from 'react-native';

export default function useBackButton(callback: () => boolean) {
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
		callback,
      );
      return () => backHandler.remove();
    }, []),
  );
}
