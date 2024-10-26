import * as React from 'react';
import {useTranslations} from '@/states/persistent/translations';
import {useDialogs} from '@/states/runtime/dialogs';
import {IconButton} from 'react-native-paper';
import {StyleSheet} from 'react-native';

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useAppProvidersInfo() {
  const openDialog = useDialogs(state => state.openDialog);
  const translations = useTranslations(state => state.translations);

  const handlePress = React.useCallback(() => {
    openDialog({
      title: 'Providers',
      content:
        translations[
          'Providers are different sources for the same app. Because they were made by different developers, they may have different versions, features or bugs.'
        ],
      actions: [{title: translations['Ok'], action: () => {}}],
    });
  }, [translations]);

  return {handlePress};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface AppProvidersInfoProps {
  isMultipleProviders: boolean;
}

const AppProvidersInfo = ({isMultipleProviders}: AppProvidersInfoProps) => {
  const {handlePress} = useAppProvidersInfo();

  if (!isMultipleProviders) return null;

  return (
    <IconButton
      icon="information"
      style={styles.button}
      onPress={handlePress}
    />
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(AppProvidersInfo);
