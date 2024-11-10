import * as React from 'react';
import {Portal, Snackbar} from 'react-native-paper';
import {useToast} from '@/states/runtime/toast';
import {useTheme} from '@/theme';

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
 *                                    HOOK                                    *
 ******************************************************************************/

function useToastComponent() {
  const [activeToast, closeToast] = useToast(state => [
    state.activeToast,
    state.closeToast,
  ]);
  const {colorScheme} = useTheme();

  const snackbarStyle = React.useMemo(() => {
    return {
      zIndex: 10000000,
      ...(activeToast?.type && {
        backgroundColor:
          TOAST_COLORS[activeToast.type as ToastType][colorScheme],
      }),
    };
  }, [activeToast, colorScheme]);

  return {activeToast, closeToast, snackbarStyle};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Toast = () => {
  const {activeToast, closeToast, snackbarStyle} = useToastComponent();

  return (
    <Portal>
      <Snackbar
        style={snackbarStyle}
        action={activeToast?.action}
        visible={!!activeToast}
        onDismiss={closeToast}
        duration={3000}>
        {activeToast?.message}
      </Snackbar>
    </Portal>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(Toast);
