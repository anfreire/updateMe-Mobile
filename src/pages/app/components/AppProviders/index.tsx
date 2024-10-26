import * as React from 'react';
import {Card} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import AppProvidersInfo from './AppProvidersInfo';
import ProvidersDataTable from './DataTable';
import {CurrAppProps} from '@/hooks/useCurrApp';
import AppProvidersMenu from './AppProvidersMenu';

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useAppProviders(currApp: CurrAppProps) {
  const paddingTop = React.useMemo(
    () => (Object.keys(currApp.providers).length > 1 ? 30 : 15),
    [currApp.providers],
  );

  const isMultipleProviders = React.useMemo(
    () => Object.keys(currApp.providers).length > 1,
    [currApp.providers],
  );

  return {paddingTop, isMultipleProviders};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface AppProvidersProps {
  currApp: CurrAppProps;
}

const AppProviders = ({currApp}: AppProvidersProps) => {
  const {paddingTop, isMultipleProviders} = useAppProviders(currApp);

  return (
    <Card contentStyle={[styles.container, {paddingTop}]}>
      <AppProvidersMenu
        currApp={currApp}
        isMultipleProviders={isMultipleProviders}
      />
      <ProvidersDataTable currApp={currApp} />
      <AppProvidersInfo isMultipleProviders={isMultipleProviders} />
    </Card>
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexDirection: 'column',
    padding: 30,
    gap: 30,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(AppProviders);
