import {MainStackNavigation} from '@/navigation/types';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

export function useClearParams() {
  const {setParams} = useNavigation<MainStackNavigation>();
  return useCallback(() => {
    setParams(undefined);
  }, [setParams]);
}
