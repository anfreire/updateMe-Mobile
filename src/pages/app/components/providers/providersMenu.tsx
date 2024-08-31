import * as React from "react";
import { Menu, Text, TextInput } from "react-native-paper";
import { Linking, StyleSheet, View } from "react-native";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { useTheme } from "@/theme";
import { useDialogs } from "@/states/temporary/dialogs";
import { CurrAppProps } from "@/states/computed/currApp";
import { useTranslations } from "@/states/persistent/translations";

const ProvidersMenu = ({ currApp }: { currApp: CurrAppProps }) => {
  const [providersMenuVisible, setProvidersMenuVisible] = React.useState(false);
  const { schemedTheme } = useTheme();
  const setDefaultProvider = useDefaultProviders(
    (state) => state.setDefaultProvider
  );
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);

  const handleProviderChange = React.useCallback(
    (provider: string) => {
      if (currApp.defaultProvider === provider) return;

      const showWarningDialog = (content: string, onContinue: () => void) => {
        openDialog({
          title: translations["Warning"],
          content,
          actions: [
            { title: translations["Cancel"], action: () => {} },
            { title: translations["Continue"], action: onContinue },
          ],
        });
      };

      if (!currApp.providers[provider].safe) {
        openDialog({
          title: translations["Warning"],
          content:
            translations[
              "The provider's apk is potentially unsafe. Are you sure you want to continue?"
            ],
          actions: [
            { title: translations["Cancel"], action: () => {} },
            {
              title: translations["See analysis"],
              action: () =>
                Linking.openURL(
                  `https://www.virustotal.com/gui/file/${currApp.providers[provider].sha256}`
                ),
            },
            {
              title: translations["Continue"],
              action: () => setDefaultProvider(currApp.name, provider),
            },
          ],
        });
      } else if (
        currApp.providers[provider].packageName !==
          currApp.providers[currApp.defaultProvider].packageName ||
        currApp.version == null
      ) {
        setDefaultProvider(currApp.name, provider);
      } else {
        showWarningDialog(
          translations[
            "Changing the provider will likely require uninstalling and reinstalling the app in order to install updates. Are you sure you want to continue?"
          ],
          () => setDefaultProvider(currApp.name, provider)
        );
      }
      setProvidersMenuVisible(false);
    },
    [currApp, translations]
  );

  const providerMenuItems = React.useMemo(
    () =>
      Object.keys(currApp.providers).map((provider) => (
        <Menu.Item
          key={provider}
          style={{
            backgroundColor:
              currApp.defaultProvider === provider
                ? schemedTheme.surfaceBright
                : schemedTheme.surfaceContainer,
          }}
          titleStyle={styles.menuItemTitle}
          trailingIcon={currApp.defaultProvider === provider ? "star" : ""}
          onPress={() => handleProviderChange(provider)}
          title={provider}
        />
      )),
    [
      currApp.providers,
      currApp.defaultProvider,
      schemedTheme,
      handleProviderChange,
    ]
  );

  if (Object.keys(currApp.providers).length < 2) return null;

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{translations["Selected Provider"]}</Text>
      <Menu
        elevation={5}
        statusBarHeight={0}
        anchorPosition="bottom"
        visible={providersMenuVisible}
        contentStyle={{ backgroundColor: schemedTheme.surfaceContainer }}
        onDismiss={() => setProvidersMenuVisible(false)}
        anchor={
          <TextInput
            editable={false}
            mode="outlined"
            placeholder={currApp.defaultProvider}
            style={styles.textInput}
            dense
            contentStyle={styles.textInputContent}
            right={
              <TextInput.Icon
                icon="chevron-down"
                onPress={() => setProvidersMenuVisible(true)}
                size={20}
              />
            }
          />
        }
      >
        {providerMenuItems}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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

export default React.memo(ProvidersMenu);
