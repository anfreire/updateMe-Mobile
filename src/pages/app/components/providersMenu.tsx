import {useState} from 'react';
import {Menu, TextInput} from 'react-native-paper';
import {Linking} from 'react-native';
import {AppScreenChildProps} from '..';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useTheme} from '@/theme';
import {useDialogs} from '@/states/temporary/dialogs';

export default function ProvidersMenu(props: AppScreenChildProps) {
  const [providersMenuVisible, setProvidersMenuVisible] = useState(false);
  const theme = useTheme();
  const _setDefaultProvider = useDefaultProviders().setDefaultProvider;
  const showDialog = useDialogs().openDialog;

  const setDefaultProvider = (appName: string, provider: string) => {
    _setDefaultProvider(appName, provider);
    props.refresh();
  };

  return (
    <Menu
      elevation={5}
      statusBarHeight={0}
      anchorPosition="bottom"
      visible={providersMenuVisible}
      contentStyle={{
        backgroundColor: theme.schemedTheme.surfaceContainer,
      }}
      onDismiss={() => setProvidersMenuVisible(false)}
      anchor={
        <TextInput
          editable={false}
          mode="outlined"
          placeholder={props.currApp.defaultProvider}
          style={{width: 200}}
          dense
          contentStyle={{
            fontSize: 14,
          }}
          right={
            <TextInput.Icon
              icon="chevron-down"
              onPress={() => setProvidersMenuVisible(true)}
              size={20}
            />
          }
        />
      }>
      {Object.keys(props.currApp.providers).map(provider => (
        <Menu.Item
          key={provider}
          style={{
            backgroundColor:
              props.currApp.defaultProvider === provider
                ? theme.schemedTheme.surfaceBright
                : theme.schemedTheme.surfaceContainer,
          }}
          titleStyle={{
            fontSize: 14,
          }}
          trailingIcon={
            props.currApp.defaultProvider === provider ? 'star' : ''
          }
          onPress={() => {
            if (props.currApp.defaultProvider === provider) return;
            if (!props.currApp.providers[provider].safe) {
              showDialog({
                title: 'Warning',
                content:
                  "The provider's apk is potentially unsafe. Are you sure you want to continue?",
                actions: [
                  {
                    title: 'Cancel',
                    action: () => {},
                  },
                  {
                    title: 'See analysis',
                    action: () =>
                      Linking.openURL(
                        `https://www.virustotal.com/gui/file/${props.currApp.providers[provider].sha256}`,
                      ),
                  },
                  {
                    title: 'Continue',
                    action: () =>
                      setDefaultProvider(props.currApp.name, provider),
                  },
                ],
              });
            } else if (
              props.currApp.providers[provider].packageName !==
                props.currApp.providers[props.currApp.defaultProvider]
                  .packageName ||
              props.currApp.version == null
            ) {
              setDefaultProvider(props.currApp.name, provider);
            } else {
              showDialog({
                title: 'Warning',
                content:
                  'Changing the provider will likely require uninstalling and reinstalling the app in order to install updates. Are you sure you want to continue?',
                actions: [
                  {
                    title: 'Cancel',
                    action: () => {},
                  },
                  {
                    title: 'Continue',
                    action: () =>
                      setDefaultProvider(props.currApp.name, provider),
                  },
                ],
              });
            }
            setProvidersMenuVisible(false);
          }}
          title={provider}
        />
      ))}
    </Menu>
  );
}
