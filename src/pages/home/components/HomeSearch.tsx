import * as React from 'react';
import {TextInput, StyleSheet, View, BackHandler, Keyboard} from 'react-native';
import {IconButton} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CLOSED_WIDTH = 56;
const OPEN_WIDTH = 256;
const ANIMATION_DURATION = 300;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useHomeSearch(
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
) {
  const {schemedTheme} = useTheme();
  const width = useSharedValue(CLOSED_WIDTH);
  const textInputRef = React.useRef<TextInput>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const themedStyles = React.useMemo(
    () => ({
      backgroundColor: schemedTheme.primaryContainer,
      color: schemedTheme.onPrimaryContainer,
    }),
    [schemedTheme],
  );

  const open = React.useCallback(() => {
    textInputRef.current?.focus();
    width.value = withTiming(OPEN_WIDTH, {duration: ANIMATION_DURATION});
  }, []);

  const close = React.useCallback(() => {
    textInputRef.current?.blur();
    width.value = withTiming(CLOSED_WIDTH, {duration: ANIMATION_DURATION});
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

  return {textInputRef, handleOnPress, animatedStyle, themedStyles};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface HomeSearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const HomeSearch = ({search, setSearch}: HomeSearchProps) => {
  const {textInputRef, handleOnPress, animatedStyle, themedStyles} =
    useHomeSearch(search, setSearch);

  return (
    <Animated.View style={[styles.outterView, animatedStyle, themedStyles]}>
      <View style={styles.innerView}>
        <IconButton
          iconColor={themedStyles.color}
          icon="magnify"
          onPress={handleOnPress}
        />
      </View>
      <TextInput
        ref={textInputRef}
        value={search}
        onChangeText={setSearch}
        selectionColor={themedStyles.color}
        underlineColorAndroid="transparent"
        style={[styles.textInput, themedStyles]}
      />
    </Animated.View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  outterView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16,
    height: CLOSED_WIDTH,
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  innerView: {
    width: CLOSED_WIDTH,
    height: CLOSED_WIDTH,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 12,
    height: CLOSED_WIDTH,
    width: 200,
    borderColor: 'transparent',
    fontSize: 16,
    paddingLeft: 16,
    textAlignVertical: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(HomeSearch);
