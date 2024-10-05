import * as React from "react";
import { useTheme } from "@/theme";
import { useFocusEffect } from "@react-navigation/native";
import {
  BackHandler,
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const CLOSED_WIDTH = 56;
const OPEN_WIDTH = 256;
const ANIMATION_DURATION = 300;

interface HomeSearchFABProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const HomeSearchFAB = ({ search, setSearch }: HomeSearchFABProps) => {
  const theme = useTheme();
  const textInputRef = React.useRef<RNTextInput>(null);
  const width = useSharedValue(CLOSED_WIDTH);

  const open = React.useCallback(() => {
    textInputRef.current?.focus();
    width.value = withTiming(OPEN_WIDTH, { duration: ANIMATION_DURATION });
  }, []);

  const close = React.useCallback(() => {
    textInputRef.current?.blur();
    width.value = withTiming(CLOSED_WIDTH, { duration: ANIMATION_DURATION });
  }, []);

  const smartClose = React.useCallback(() => {
    if (search.trim() === "") {
      close();
    }
  }, [close, search]);

  const smartToggle = React.useCallback(() => {
    if (width.value === CLOSED_WIDTH) {
      open();
    } else {
      setSearch("");
      close();
    }
  // eslint-disable-next-line local-rules/exhaustive-deps
  }, [open, close]);

  const handleOnFocus = React.useCallback(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (width.value !== CLOSED_WIDTH) {
          close();
          return true;
        }
        return false;
      }
    );

    const keyboardHandler = Keyboard.addListener("keyboardDidHide", smartClose);

    return () => {
      backHandler.remove();
      keyboardHandler.remove();
    };
  }, [close, smartClose]);

  useFocusEffect(handleOnFocus);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const themedStyles = React.useMemo(
    () => ({
      container: {
        backgroundColor: theme.schemedTheme.primaryContainer,
      },
      textInput: {
        backgroundColor: theme.schemedTheme.primaryContainer,
        color: theme.schemedTheme.onPrimaryContainer,
      },
    }),
    [theme.schemedTheme.primaryContainer, theme.schemedTheme.onPrimaryContainer]
  );

  return (
    <Animated.View
      style={[styles.outterView, animatedStyle, themedStyles.container]}
    >
      <View style={styles.innerView}>
        <IconButton
          iconColor={theme.schemedTheme.onPrimaryContainer}
          icon="magnify"
          onPress={smartToggle}
        />
      </View>

      <RNTextInput
        ref={textInputRef}
        value={search}
        onChangeText={setSearch}
        selectionColor={theme.schemedTheme.onPrimaryContainer}
        underlineColorAndroid="transparent"
        style={[styles.textInput, themedStyles.textInput]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outterView: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
    height: CLOSED_WIDTH,
    borderRadius: 10,
    elevation: 2,
    overflow: "hidden",
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },
  innerView: {
    width: CLOSED_WIDTH,
    height: CLOSED_WIDTH,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 12,
    height: CLOSED_WIDTH,
    width: 200,
    borderColor: "transparent",
    fontSize: 16,
    paddingLeft: 16,
    textAlignVertical: "center",
  },
});

HomeSearchFAB.displayName = "HomeSearchFAB";

export default React.memo(HomeSearchFAB);
