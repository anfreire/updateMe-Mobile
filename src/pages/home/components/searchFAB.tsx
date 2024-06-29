import useBackButton from "@/hooks/useBackButton";
import useKeyboard from "@/hooks/useKeyboard";
import { useTheme } from "@/theme";
import React, { useCallback } from "react";
import {TextInput as RNTextInput, View} from 'react-native';
import { IconButton } from "react-native-paper";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

export default function HomeSearchFAB({search, setSearch}: {search: string; setSearch: any}) {
  const theme = useTheme();
  const textInputRef = React.useRef<RNTextInput>(null);
  const width = useSharedValue(56);

  const open = useCallback(() => {
    textInputRef.current?.focus();
    width.value = withTiming(256, {
      duration: 300,
    });
  }, []);

  const close = useCallback(() => {
    textInputRef.current?.blur();
    width.value = withTiming(56, {
      duration: 300,
    });
  }, []);

  const smartClose = () => {
    if (search.trim() == '') {
      close();
    }
  };

  const smartToggle = () => {
    if (width.value === 56) {
      open();
    } else {
      setSearch('');
      close();
    }
  };

  useBackButton(() => {
    if (width.value != 56) {
      close();
      return true;
    }
    return false;
  });

  useKeyboard({
    hideCallback: smartClose,
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 16,
        height: 56,
        width,
        backgroundColor: theme.schemedTheme.primaryContainer,
        borderRadius: 10,
        elevation: 2,
        overflow: 'hidden',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
      }}>
      <View
        style={{
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
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
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingTop: 12,
          height: 56,
          width: 200,
          borderColor: 'transparent',
          color: theme.schemedTheme.onPrimaryContainer,
          fontSize: 16,
          paddingLeft: 16,
          backgroundColor: theme.schemedTheme.primaryContainer,
          textAlignVertical: 'center',
        }}
      />
    </Animated.View>
  );
}