import {NavigationProps} from '@/types/navigation';
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {IconButton} from 'react-native-paper';

export function useBackButton() {
  const {goBack} = useNavigation<NavigationProps>();

  return React.useCallback(
    () => <IconButton icon="arrow-left" onPress={goBack} />,
    [goBack],
  );
}
