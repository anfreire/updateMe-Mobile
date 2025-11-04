import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTheme} from '@/theme';
import {useTranslations} from '@/states/persistent/translations';
import {CurrAppProps} from '@/hooks/useCurrApp';
import AppInfoButton from './AppInfoButton';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppInfo(currApp: CurrAppProps) {
  const {schemedTheme} = useTheme();
  const translations = useTranslations(state => state.translations);

  const localVersionProps = React.useMemo(
    () => ({
      color:
        currApp.version === null
          ? schemedTheme.error
          : schemedTheme.onSurfaceVariant,
      version:
        currApp.version == null
          ? translations['Not installed']
          : currApp.version,
    }),
    [currApp, schemedTheme.error, schemedTheme.onSurfaceVariant, translations],
  );

  const localVersionLabel = translations['Local Version'];
  const availableVersionLabel = translations['Available Version'];

  return {
    localVersionProps,
    localVersionLabel,
    availableVersionLabel,
    schemedTheme,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppInfoProps {
  currApp: CurrAppProps;
}

const AppInfo = ({currApp}: AppInfoProps) => {
  const {
    localVersionProps,
    localVersionLabel,
    availableVersionLabel,
    schemedTheme,
  } = useAppInfo(currApp);

  return (
    <View style={styles.container}>
      {/* Primary Action Button */}
      <View style={styles.buttonSection}>
        <AppInfoButton currApp={currApp} />
      </View>

      {/* Compact Version Information */}
      <View style={styles.versionSection}>
        <View style={styles.versionRow}>
          <View style={styles.versionItem}>
            <Text
              variant="labelSmall"
              style={[styles.versionLabel, {color: schemedTheme.primary}]}>
              {availableVersionLabel.toUpperCase()}
            </Text>
            <Text
              variant="titleSmall"
              style={[styles.versionValue, {color: schemedTheme.onSurface}]}>
              {currApp.defaultProvider.version}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              {backgroundColor: schemedTheme.outlineVariant},
            ]}
          />

          <View style={styles.versionItem}>
            <Text
              variant="labelSmall"
              style={[
                styles.versionLabel,
                {
                  color:
                    currApp.version === null
                      ? schemedTheme.error
                      : schemedTheme.onSurfaceVariant,
                },
              ]}>
              {localVersionLabel.toUpperCase()}
            </Text>
            <Text
              variant="titleSmall"
              style={[styles.versionValue, {color: localVersionProps.color}]}>
              {localVersionProps.version}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  buttonSection: {
    // Primary focus area
  },
  versionSection: {
    paddingHorizontal: 4,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  versionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  versionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  versionValue: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: 20,
    opacity: 0.5,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppInfo);
