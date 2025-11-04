import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useInstall} from '@/hooks/useInstall';
import {useTranslations} from '@/states/persistent/translations';
import AppsModule from '@/lib/apps';
import {Button, Text} from 'react-native-paper';
import {CurrAppProps} from '@/hooks/useCurrApp';
import MultiIcon from '@/components/MultiIcon';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppInfoButton(currApp: CurrAppProps) {
  const translations = useTranslations(state => state.translations);
  const install = useInstall();
  const {schemedTheme} = useTheme();

  const handleInstall = React.useCallback(() => {
    install(currApp.title, currApp.defaultProvider);
  }, [install, currApp.defaultProvider, currApp.title]);

  const buttonProps = React.useMemo(() => {
    if (currApp.version == null) {
      return {
        icon: 'download',
        label: translations['Install'],
        action: handleInstall,
        mode: 'contained' as const,
        prominent: true,
      };
    }
    if (currApp.version < currApp.defaultProvider.version) {
      return {
        icon: 'update',
        label: translations['Update'],
        action: handleInstall,
        mode: 'contained' as const,
        prominent: true,
      };
    }
    return {
      icon: 'launch',
      label: translations['Open'],
      action: () => AppsModule.openApp(currApp.defaultProvider.packageName),
      mode: 'contained-tonal' as const,
      prominent: false,
    };
  }, [currApp, translations, handleInstall]);

  return {buttonProps, schemedTheme, translations};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppInfoButtonProps {
  currApp: CurrAppProps;
}

const AppInfoButton = ({currApp}: AppInfoButtonProps) => {
  const {buttonProps, schemedTheme} = useAppInfoButton(currApp);

  return (
    <View style={styles.container}>
      <Button
        mode={buttonProps.mode}
        onPress={buttonProps.action}
        style={[styles.button, buttonProps.prominent && styles.prominentButton]}
        contentStyle={[
          styles.buttonContent,
          buttonProps.prominent && styles.prominentButtonContent,
        ]}
        labelStyle={[
          styles.buttonLabel,
          buttonProps.prominent && styles.prominentButtonLabel,
        ]}
        icon={({size, color}) => (
          <MultiIcon
            size={size}
            type="material-icons"
            name={buttonProps.icon}
            color={color}
          />
        )}>
        {buttonProps.label}
      </Button>

      {/* Provider Source Info */}
      <View style={styles.providerInfo}>
        <MultiIcon
          size={12}
          type="material-icons"
          name="source"
          color={schemedTheme.onSurfaceVariant}
        />
        <Text
          variant="labelSmall"
          style={[styles.providerText, {color: schemedTheme.onSurfaceVariant}]}>
          FROM {currApp.defaultProviderTitle.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
  },
  button: {
    borderRadius: 16,
    width: '100%',
  },
  prominentButton: {
    borderRadius: 20,
  },
  buttonContent: {
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  prominentButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  prominentButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  providerText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    opacity: 0.8,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppInfoButton);
