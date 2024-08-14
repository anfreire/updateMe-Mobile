function HomeStack({navigation}: {navigation: any}) {
    const theme = useTheme();
    const openDrawer = useDrawer().openDrawer;
    const {currApp, setCurrApp} = useCurrApp(state => ({
      currApp: state.currApp,
      setCurrApp: state.setCurrApp,
    }));
    return (
      <Stack.Navigator initialRouteName="Home" id="home-tab-navigator">
        <Stack.Screen
          name="Home-Home"
          options={{
            headerStyle: {
              backgroundColor: theme.schemedTheme.surfaceContainer,
            },
            headerTitle: _ => <HomeLogo />,
            headerRight: buildDrawerButton(openDrawer),
          }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="App-Home"
          options={{
            headerStyle: {
              backgroundColor: theme.schemedTheme.surfaceContainer,
            },
            headerTitleStyle: {
              color: theme.schemedTheme.onSurface,
            },
            headerTitle: currApp?.name ?? '',
            headerLeft: _ => (
              <IconButton
                icon="arrow-left"
                onPress={() => {
                  setCurrApp(null);
                  navigation.goBack();
                }}
              />
            ),
            headerRight: buildDrawerButton(openDrawer),
          }}
          component={AppScreen}
        />
      </Stack.Navigator>
    );
  }