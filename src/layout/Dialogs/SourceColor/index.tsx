import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Button, Dialog, IconButton} from 'react-native-paper';
import ColorPicker, {
  HueCircular,
  type returnedResults,
} from 'reanimated-color-picker';
import {useTheme} from '@/theme';
import {useDialogs} from '@/stores/runtime/dialogs';
import {useToast} from '@/stores/runtime/toast';
import {useTranslations} from '@/stores/persistent/translations';
import {Logger} from '@/stores/persistent/logs';
import {useShallow} from 'zustand/shallow';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SourceColorDialog = () => {
  const {schemedTheme, sourceColor, setSourceColor, resetSourceColor} =
    useTheme();
  const initialSourceColor = useRef<string | null>(null);
  const closeDialog = useDialogs(state => state.closeDialog);
  const [openToast, closeToast] = useToast(
    useShallow(state => [state.openToast, state.closeToast]),
  );
  const translations = useTranslations(state => state.translations);
  const selectedColor = useSharedValue(sourceColor);
  const scale = useSharedValue(1);

  const labels = useMemo(
    () => ({
      title: translations['Source Color'],
      info: translations['Tap on the middle circle to test the color'],
      cancel: translations['Revert'],
      useSystem: translations['Use System'],
      save: translations['Save'],
    }),
    [translations],
  );

  const previewAnimatedStyles = useAnimatedStyle(
    () => ({
      backgroundColor: selectedColor.value,
      transform: [{scale: scale.value}],
    }),
    [selectedColor],
  );

  const handleOnChange = useCallback((color: returnedResults) => {
    'worklet';
    selectedColor.value = color.hex;
  }, []);

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withTiming(0.975, {
      duration: 100,
      easing: Easing.linear,
    });
    setSourceColor(selectedColor.value);
  }, [setSourceColor]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withTiming(1, {
      duration: 100,
      easing: Easing.linear,
    });
  }, []);

  const handleClose = useCallback(() => {
    initialSourceColor.current = null;
    closeDialog();
    closeToast();
  }, []);

  const handleInfoPress = useCallback(() => {
    openToast(translations['Tap on the middle circle to test the color']);
  }, [translations]);

  const handleCancel = useCallback(() => {
    if (initialSourceColor.current !== null) {
      setSourceColor(initialSourceColor.current);
    } else {
      Logger.error(
        'Source Color Picker',
        'Revert Changes',
        'Initial source color is null. This should not happen',
      );
    }
    handleClose();
  }, [setSourceColor, handleClose]);

  const handleUseSystem = useCallback(() => {
    resetSourceColor();
    handleClose();
  }, [handleClose, resetSourceColor]);

  const handleSave = useCallback(() => {
    setSourceColor(selectedColor.value);
    handleClose();
  }, [handleClose, setSourceColor]);

  useEffect(() => {
    if (initialSourceColor.current === null) {
      initialSourceColor.current = sourceColor;
      selectedColor.value = sourceColor;
    }
  }, [sourceColor]);

  return (
    <Dialog
      visible
      onDismiss={undefined}
      dismissable={false}
      dismissableBackButton={false}
      style={styles.dialog}>
      <IconButton
        icon="information"
        onPress={handleInfoPress}
        style={styles.infoButton}
      />
      <Dialog.Title>{labels.title}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <ColorPicker value={selectedColor.value} onChange={handleOnChange}>
          <HueCircular
            containerStyle={[
              {backgroundColor: schemedTheme.elevation.level3},
              styles.hueCircularContainer,
            ]}
            style={styles.hueCircular}
            thumbShape="circle"
            sliderThickness={15}
            thumbScaleAnimationValue={1.1}
            thumbInnerStyle={styles.thumb}
            thumbStyle={styles.thumb}
            thumbSize={30}>
            <AnimatedPressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.preview, previewAnimatedStyles]}
            />
          </HueCircular>
        </ColorPicker>
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={handleCancel}>{labels.cancel}</Button>
        <Button onPress={handleUseSystem}>{labels.useSystem}</Button>
        <Button onPress={handleSave}>{labels.save}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  dialog: {
    position: 'relative',
  },
  infoButton: {
    position: 'absolute',
    top: -12,
    right: 8,
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 16,
    position: 'relative',
  },
  hueCircular: {
    width: 275,
    height: 275,
  },
  hueCircularContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    borderColor: 'transparent',
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  actions: {
    justifyContent: 'space-around',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SourceColorDialog);
