import {useRotate} from '@/hooks/useRotate';
import {useIndex} from '@/states/fetched';
import * as React from 'react';

export function useHomeLogo() {
  const [isFetched, fetch] = useIndex(state => [state.isFetched, state.fetch]);
  const {startRotating, cancelRotating, rotatingStyles} = useRotate();

  const handleOnPress = React.useCallback(() => {
    if (!isFetched) return;
    fetch();
    startRotating();
  }, [isFetched, startRotating]);

  React.useEffect(() => {
    return cancelRotating;
  }, [cancelRotating]);

  return {handleOnPress, rotatingStyles};
}
