import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useInstall} from '@/hooks/useInstall';
import {useTranslations} from '@/states/persistent/translations';
import AppsModule from '@/lib/apps';
import {Button} from 'react-native-paper';
import {CurrAppProps} from '@/hooks/useCurrApp';

interface AppInfoButtonsProps {
  currApp: CurrAppProps;
}

const AppInfoButtons = ({currApp}: AppInfoButtonsProps) => {
  const translations = useTranslations(state => state.translations);
  const handleInstall = useInstall(currApp.title, currApp.defaultProvider);

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

  return (
    <View style={styles.buttonWrapper}>
      <Button
        onPress={buttonProps.action}
        icon={buttonProps.icon}
        mode="contained-tonal">
        {buttonProps.label}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});

AppInfoButtons.displayName = 'AppInfoButtons';

export default React.memo(AppInfoButtons);
