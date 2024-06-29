import {useColorScheme} from 'react-native';
import {Portal, Snackbar} from 'react-native-paper';
import React from 'react';
import {useToast} from '@/states/temporary/toast';
import {useSettings} from '@/states/persistent/settings';

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
};

export function ToastWrapper({children}: {children: React.ReactNode}) {
  const {activeToast, closeToast} = useToast(state => ({
    activeToast: state.activeToast,
    closeToast: state.closeToast,
  }));
  const systemColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colorSchemeSetting = useSettings(
    state => state.settings.theme.colorScheme,
  );
  const colorScheme =
    colorSchemeSetting === 'system' ? systemColorScheme : colorSchemeSetting;

  return (
    <>
      <Portal>
        <Snackbar
          style={{
            zIndex: 10000000,
            ...(activeToast?.type
              ? {backgroundColor: TOAST_COLORS[activeToast.type][colorScheme]}
              : {}),
          }}
          action={activeToast?.action}
          visible={activeToast !== null}
          onDismiss={closeToast}
          duration={3000}>
          {activeToast?.message}
        </Snackbar>
      </Portal>
      {children}
    </>
  );
}
