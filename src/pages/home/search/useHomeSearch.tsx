import * as React from 'react';
import {BackHandler, Keyboard, TextInput} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '@/theme';

export const CLOSED_WIDTH = 56;
const OPEN_WIDTH = 256;
const ANIMATION_DURATION = 300;

export function useHomeSearch(
  search: string,
  setSearch: (search: string) => void,
  textInputRef: React.RefObject<TextInput>,
) {
  const theme = useTheme();
  const width = useSharedValue(CLOSED_WIDTH);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const themedStyles = React.useMemo(
    () => ({
      backgroundColor: theme.schemedTheme.primaryContainer,
      color: theme.schemedTheme.onPrimaryContainer,
    }),
    [theme.schemedTheme],
  );

  const open = React.useCallback(() => {
    textInputRef.current?.focus();
    width.value = withTiming(OPEN_WIDTH, {duration: ANIMATION_DURATION});
    // eslint-disable-next-line local-rules/exhaustive-deps
  }, []);

  const close = React.useCallback(() => {
    textInputRef.current?.blur();
    width.value = withTiming(CLOSED_WIDTH, {duration: ANIMATION_DURATION});
    // eslint-disable-next-line local-rules/exhaustive-deps
  }, []);

  const handleOnPress = React.useCallback(() => {
    if (width.value === CLOSED_WIDTH) {
      open();
    } else {
      setSearch('');
      close();
    }
  }, [open, close, setSearch]);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (width.value !== CLOSED_WIDTH) {
            close();
            return true;
          }
          return false;
        },
      );

      const keyboardHandler = Keyboard.addListener('keyboardDidHide', () => {
        if (!search.trim().length) {
          close();
        }
      });

      return () => {
        backHandler.remove();
        keyboardHandler.remove();
      };
    }, [close, search]),
  );

  return {handleOnPress, animatedStyle, themedStyles};
}
