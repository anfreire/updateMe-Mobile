import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {Keyboard} from 'react-native';

interface useKeyboardProps {
  showCallback?: () => void;
  hideCallback?: () => void;
}

export default function useKeyboard(props: useKeyboardProps) {
  useFocusEffect(
    useCallback(() => {
      const keyboardDidShowListener = props.showCallback
        ? Keyboard.addListener('keyboardDidShow', props.showCallback)
        : null;

      const keyboardDidHideListener = props.hideCallback
        ? Keyboard.addListener('keyboardDidHide', props.hideCallback)
        : null;

      return () => {
        keyboardDidShowListener && keyboardDidShowListener.remove();
        keyboardDidHideListener && keyboardDidHideListener.remove();
      };
    }, []),
  );
}
