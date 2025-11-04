import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Chip, Divider} from 'react-native-paper';
import {CurrAppProps} from '@/hooks/useCurrApp';
import AppProvidersMenu from './AppProvidersMenu';
import {useTheme} from '@/theme';
import {useTranslations} from '@/states/persistent/translations';
import MultiIcon from '@/components/MultiIcon';
import {Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useToast} from '@/states/runtime/toast';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppProviders(currApp: CurrAppProps) {
  const {schemedTheme} = useTheme();
  const translations = useTranslations(state => state.translations);
  const openToast = useToast(state => state.openToast);

  const isMultipleProviders = React.useMemo(
    () => Object.keys(currApp.providers).length > 1,
    [currApp.providers],
  );

  const currentProvider = currApp.providers[currApp.defaultProviderTitle];

  const copyToClipboard = React.useCallback(
    (text: string, label: string) => {
      Clipboard.setString(text);
      openToast(`${label} copied to clipboard`);
    },
    [openToast],
  );

  const openVirusTotal = React.useCallback(() => {
    Linking.openURL(
      `https://www.virustotal.com/gui/file/${currentProvider.sha256}`,
    );
  }, [currentProvider.sha256]);

  const openProviderSite = React.useCallback(() => {
    Linking.openURL(currentProvider.source);
  }, [currentProvider.source]);

  return {
    isMultipleProviders,
    schemedTheme,
    translations,
    currentProvider,
    copyToClipboard,
    openVirusTotal,
    openProviderSite,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppProvidersProps {
  currApp: CurrAppProps;
}

const AppProviders = ({currApp}: AppProvidersProps) => {
  const {
    isMultipleProviders,
    schemedTheme,
    translations,
    currentProvider,
    copyToClipboard,
    openVirusTotal,
    openProviderSite,
  } = useAppProviders(currApp);

  return (
    <View style={styles.container}>
      {/* Clean Section Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MultiIcon
            size={18}
            type="material-icons"
            name="hub"
            color={schemedTheme.primary}
          />
          <Text
            variant="titleSmall"
            style={[styles.title, {color: schemedTheme.onSurface}]}>
            Source Details
          </Text>
        </View>
        {isMultipleProviders && (
          <Text
            variant="labelSmall"
            style={[
              styles.optionsCount,
              {color: schemedTheme.onSurfaceVariant},
            ]}>
            {Object.keys(currApp.providers).length} SOURCES
          </Text>
        )}
      </View>

      {/* Provider Selection Section */}
      {isMultipleProviders && (
        <View style={styles.selectionSection}>
          <AppProvidersMenu
            currApp={currApp}
            isMultipleProviders={isMultipleProviders}
          />
        </View>
      )}

      {/* Current Provider Details */}
      <View
        style={[
          styles.providerCard,
          {backgroundColor: schemedTheme.surfaceContainerLow},
        ]}>
        {/* Provider Name & Security */}
        <View style={styles.providerHeader}>
          <View style={styles.providerNameSection}>
            <TouchableOpacity
              onPress={openProviderSite}
              style={styles.providerNameButton}>
              <Text
                variant="titleSmall"
                style={[styles.providerName, {color: schemedTheme.primary}]}>
                {currApp.defaultProviderTitle}
              </Text>
              <MultiIcon
                size={16}
                type="material-icons"
                name="open-in-new"
                color={schemedTheme.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Security Status */}
          <Chip
            mode="outlined"
            compact
            style={[
              styles.securityChip,
              {
                borderColor: currentProvider.safe
                  ? schemedTheme.primary
                  : schemedTheme.error,
                backgroundColor: currentProvider.safe
                  ? schemedTheme.primaryContainer
                  : schemedTheme.errorContainer,
              },
            ]}
            textStyle={[
              styles.securityText,
              {
                color: currentProvider.safe
                  ? schemedTheme.onPrimaryContainer
                  : schemedTheme.onErrorContainer,
              },
            ]}
            icon={() => (
              <MultiIcon
                size={12}
                type="material-icons"
                name={currentProvider.safe ? 'verified' : 'warning'}
                color={
                  currentProvider.safe
                    ? schemedTheme.onPrimaryContainer
                    : schemedTheme.onErrorContainer
                }
              />
            )}
            onPress={openVirusTotal}>
            {currentProvider.safe ? 'VERIFIED' : 'UNVERIFIED'}
          </Chip>
        </View>

        <Divider
          style={[styles.divider, {backgroundColor: schemedTheme.outline}]}
        />

        {/* Provider Information Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text
              variant="labelSmall"
              style={[
                styles.infoLabel,
                {color: schemedTheme.onSurfaceVariant},
              ]}>
              PACKAGE
            </Text>
            <View style={styles.infoValueRow}>
              <Text
                variant="bodySmall"
                style={[styles.infoValue, {color: schemedTheme.onSurface}]}
                numberOfLines={1}>
                {currentProvider.packageName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(currentProvider.packageName, 'Package name')
                }>
                <MultiIcon
                  size={16}
                  type="material-icons"
                  name="content-copy"
                  color={schemedTheme.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text
              variant="labelSmall"
              style={[
                styles.infoLabel,
                {color: schemedTheme.onSurfaceVariant},
              ]}>
              VERSION
            </Text>
            <View style={styles.infoValueRow}>
              <Text
                variant="bodySmall"
                style={[styles.infoValue, {color: schemedTheme.onSurface}]}>
                {currentProvider.version}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(currentProvider.version, 'Version')
                }>
                <MultiIcon
                  size={16}
                  type="material-icons"
                  name="content-copy"
                  color={schemedTheme.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SHA-256 Hash */}
        <View style={styles.hashSection}>
          <Text
            variant="labelSmall"
            style={[styles.infoLabel, {color: schemedTheme.onSurfaceVariant}]}>
            SHA-256 HASH
          </Text>
          <View style={styles.hashRow}>
            <Text
              variant="bodySmall"
              style={[styles.hashValue, {color: schemedTheme.onSurfaceVariant}]}
              numberOfLines={1}>
              {currentProvider.sha256.substring(0, 32)}...
            </Text>
            <TouchableOpacity
              onPress={() =>
                copyToClipboard(currentProvider.sha256, 'SHA-256 hash')
              }>
              <MultiIcon
                size={16}
                type="material-icons"
                name="content-copy"
                color={schemedTheme.onSurfaceVariant}
              />
            </TouchableOpacity>
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
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  optionsCount: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 0.8,
    opacity: 0.7,
  },
  selectionSection: {
    paddingHorizontal: 4,
  },
  providerCard: {
    borderRadius: 12,
    padding: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  providerNameSection: {
    flex: 1,
  },
  providerNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  providerName: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  securityChip: {
    borderRadius: 16,
  },
  securityText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    marginVertical: 12,
    opacity: 0.3,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    gap: 6,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoValue: {
    fontWeight: '500',
    flex: 1,
  },
  hashSection: {
    gap: 6,
  },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  hashValue: {
    fontFamily: 'monospace',
    fontSize: 11,
    flex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppProviders);
