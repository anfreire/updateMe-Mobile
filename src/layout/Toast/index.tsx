import React, {memo, useMemo} from 'react';
import {Snackbar} from 'react-native-paper';
import {useToast} from '@/stores/runtime/toast';
import {useTheme} from '@/theme';
import {useShallow} from 'zustand/shallow';
import {ViewStyle} from 'react-native';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const TOAST_COLORS = {
  success: {
    light: '#2E7D32',
    dark: '#81C784',
  },
  error: {
    light: '#D50000',
    dark: '#E57373',
  },
  warning: {
    light: '#CC8A00',
    dark: '#FFD54F',
  },
} as const;

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

type ToastType = keyof typeof TOAST_COLORS;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Toast = () => {
  const [activeToast, closeToast] = useToast(
    useShallow(state => [state.activeToast, state.closeToast]),
  );
  const {colorScheme} = useTheme();

  const snackbarStyle: ViewStyle = useMemo(() => {
    return {
      zIndex: 100,
      ...(activeToast?.type && {
        backgroundColor:
          TOAST_COLORS[activeToast.type as ToastType][colorScheme],
      }),
    };
  }, [activeToast, colorScheme]);

  if (!activeToast) {
    return null;
  }

  return (
    <Snackbar
      style={snackbarStyle}
      action={activeToast?.action}
      visible={true}
      onDismiss={closeToast}
      duration={3000}>
      {activeToast?.message}
    </Snackbar>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(Toast);
