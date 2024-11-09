import * as React from 'react';
import MultiIcon, {MultiIconType} from '@/components/MultiIcon';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useIconBuilder(
  type: MultiIconType,
  name: string,
  size: number = 20,
) {
  return React.useCallback(
    ({color, style}: {color: string; style?: Style}) => {
      return (
        <MultiIcon
          type={type}
          name={name}
          size={size}
          color={color}
          style={style}
        />
      );
    },
    [type, name, size],
  );
}
