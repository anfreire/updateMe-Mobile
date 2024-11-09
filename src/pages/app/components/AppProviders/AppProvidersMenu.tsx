import * as React from 'react';
import {Menu, Text, TextInput} from 'react-native-paper';
import {Linking, StyleSheet, View} from 'react-native';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useTheme} from '@/theme';
import {useDialogs} from '@/states/runtime/dialogs';
import {useTranslations} from '@/states/persistent/translations';
import {CurrAppProps} from '@/hooks/useCurrApp';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppProvidersMenu(currApp: CurrAppProps) {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const {schemedTheme} = useTheme();
  const setDefaultProvider = useDefaultProviders(
    state => state.setDefaultProvider,
  );
  const openDialog = useDialogs(state => state.openDialog);
  const translations = useTranslations(state => state.translations);

  const selectedProviderLabel = translations['Selected Provider'];

  const openMenu = React.useCallback(() => setIsMenuVisible(true), []);
  const closeMenu = React.useCallback(() => setIsMenuVisible(false), []);

  const handleProviderChange = React.useCallback(
    (provider: string) => {
      if (currApp.defaultProviderTitle === provider) return;

      if (!currApp.providers[provider].safe) {
        openDialog({
          title: translations['Warning'],
          content:
            translations[
              "The provider's apk is potentially unsafe. Are you sure you want to continue?"
            ],
          actions: [
            {title: translations['Cancel'], action: () => {}},
            {
              title: translations['See analysis'],
              action: () =>
                Linking.openURL(
                  `https://www.virustotal.com/gui/file/${currApp.providers[provider].sha256}`,
                ),
            },
            {
              title: translations['Continue'],
              action: () => setDefaultProvider(currApp.title, provider),
            },
          ],
        });
      } else if (
        currApp.providers[provider].packageName !==
          currApp.providers[currApp.defaultProviderTitle].packageName ||
        currApp.version == null
      ) {
        setDefaultProvider(currApp.title, provider);
      } else {
        openDialog({
          title: translations['Warning'],
          content:
            translations[
              'Changing the provider will likely require uninstalling and reinstalling the app in order to install updates. Are you sure you want to continue?'
            ],
          actions: [
            {title: translations['Cancel'], action: () => {}},
            {
              title: translations['Continue'],
              action: () => setDefaultProvider(currApp.title, provider),
            },
          ],
        });
      }
      setIsMenuVisible(false);
    },
    [currApp, translations],
  );

  return {
    isMenuVisible,
    closeMenu,
    openMenu,
    handleProviderChange,
    schemedTheme,
    selectedProviderLabel,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppProvidersMenuProps {
  currApp: CurrAppProps;
  isMultipleProviders: boolean;
}

const AppProvidersMenu = ({
  currApp,
  isMultipleProviders,
}: AppProvidersMenuProps) => {
  const {
    selectedProviderLabel,
    isMenuVisible,
    closeMenu,
    openMenu,
    handleProviderChange,
    schemedTheme,
  } = useAppProvidersMenu(currApp);

  const renderMenuItem = React.useCallback(
    (item: string) => (
      <Menu.Item
        style={{
          backgroundColor:
            currApp.defaultProviderTitle === item
              ? schemedTheme.surfaceBright
              : schemedTheme.surfaceContainer,
        }}
        key={item}
        titleStyle={styles.menuItemTitle}
        trailingIcon={currApp.defaultProviderTitle === item ? 'star' : ''}
        onPress={() => handleProviderChange(item)}
        title={item}
      />
    ),
    [currApp.defaultProviderTitle, schemedTheme, handleProviderChange],
  );

  const menuAnchor = React.useMemo(
    () => (
      <TextInput
        editable={false}
        mode="outlined"
        placeholder={currApp.defaultProviderTitle}
        style={styles.textInput}
        dense
        contentStyle={styles.textInputContent}
        right={
          <TextInput.Icon icon="chevron-down" onPress={openMenu} size={20} />
        }
      />
    ),
    [currApp.defaultProviderTitle, openMenu],
  );

  if (!isMultipleProviders) return null;

  const data = Object.keys(currApp.providers);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{selectedProviderLabel}</Text>
      <Menu
        elevation={5}
        statusBarHeight={0}
        anchorPosition="bottom"
        visible={isMenuVisible}
        contentStyle={{backgroundColor: schemedTheme.surfaceContainer}}
        onDismiss={closeMenu}
        anchor={menuAnchor}>
        {data.map(renderMenuItem)}
      </Menu>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 7,
  },
  textInput: {
    width: 200,
  },
  textInputContent: {
    fontSize: 14,
  },
  menuItemTitle: {
    fontSize: 14,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppProvidersMenu);
