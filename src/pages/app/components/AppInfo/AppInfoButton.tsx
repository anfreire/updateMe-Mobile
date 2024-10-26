import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useInstall} from '@/hooks/useInstall';
import {useTranslations} from '@/states/persistent/translations';
import AppsModule from '@/lib/apps';
import {Button} from 'react-native-paper';
import {CurrAppProps} from '@/hooks/useCurrApp';
import MultiIcon from '@/components/MultiIcon';

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useAppInfoButton(currApp: CurrAppProps) {
  const translations = useTranslations(state => state.translations);
  const handleInstall = useInstall(currApp.title, currApp.defaultProvider);

  const uninstallLabel = React.useMemo(
    () => (currApp.version == null ? null : translations['Uninstall']),
    [currApp.version, translations],
  );

  const buttonProps = React.useMemo(() => {
    if (currApp.version == null) {
      return {
        icon: 'install-mobile',
        label: translations['Install'],
        action: handleInstall,
      };
    }
    if (currApp.version < currApp.defaultProvider.version) {
      return {
        icon: 'security-update',
        label: translations['Update'],
        action: handleInstall,
      };
    }
    return {
      icon: 'exit-to-app',
      label: translations['Open'],
      action: () => AppsModule.openApp(currApp.defaultProvider.packageName),
    };
  }, [currApp, translations, handleInstall]);

  return {buttonProps, uninstallLabel};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface AppInfoButtonProps {
  currApp: CurrAppProps;
}

const AppInfoButton = ({currApp}: AppInfoButtonProps) => {
  const {buttonProps, uninstallLabel} = useAppInfoButton(currApp);

  return (
    <View style={styles.buttonWrapper}>
      {uninstallLabel && (
        <Button
          onPress={() =>
            AppsModule.uninstallApp(currApp.defaultProvider.packageName)
          }
          icon={() => (
            <MultiIcon size={18} type="material-icons" name="delete" />
          )}
          mode="contained-tonal">
          {uninstallLabel}
        </Button>
      )}
      <Button
        onPress={buttonProps.action}
        icon={() => (
          <MultiIcon size={18} type="material-icons" name={buttonProps.icon} />
        )}
        mode="contained-tonal">
        {buttonProps.label}
      </Button>
    </View>
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(AppInfoButton);
