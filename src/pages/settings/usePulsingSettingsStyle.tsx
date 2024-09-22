import * as React from 'react';
import {usePulsing} from '@/hooks/usePulsing';
import {useRoute} from '@react-navigation/native';
import {RouteProps} from '@/types/navigation';
import {SettingsSectionItemInferred} from '@/types/settings';

export function usePulsingSettingsStyles(
  settingItem: SettingsSectionItemInferred,
) {
  const {pulsingStyles, startPulsing, cancelPulsing} = usePulsing();
  const isPulsing = React.useRef(false);
  const {params} = useRoute<RouteProps>();

  const settingParamMatch = React.useMemo(
    () => params && 'setting' in params && params.setting === settingItem,
    [params, settingItem],
  );

  React.useEffect(() => {
    if (!settingParamMatch || isPulsing.current) return;

    startPulsing(() => {
      isPulsing.current = false;
    });
    isPulsing.current = true;

    return () => {
      if (isPulsing.current) {
        cancelPulsing();
        isPulsing.current = false;
      }
    };
  }, [settingParamMatch, cancelPulsing, startPulsing]);

  if (settingParamMatch) {
    return undefined;
  }

  return pulsingStyles;
}
