import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

export interface repeatCallbackProps {
  callback: () => void;
  interval: number;
}

export interface useScreenCallbackProps {
  initial?: () => void;
  repeat?: repeatCallbackProps;
  final?: () => void;
}

export default function useScreenCallback({
  initial,
  repeat,
  final,
}: useScreenCallbackProps) {
  useFocusEffect(
    useCallback(() => {
      let interval: NodeJS.Timeout | null = null;
      if (initial) initial();
      if (repeat) {
        repeat.callback();
        interval = setInterval(() => {
          repeat.callback();
        }, repeat.interval);
      }
      return () => {
        if (interval) clearInterval(interval);
        if (final) final();
      };
    }, []),
  );
}
