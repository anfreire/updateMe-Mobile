import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Surface} from 'react-native-paper';
import {useTranslations} from '@/states/persistent/translations';
import {useTheme} from '@/theme';
import MultiIcon from '@/components/MultiIcon';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useAppFeatures = () => {
  const translations = useTranslations(state => state.translations);
  const {schemedTheme} = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const titleLabel = translations['Features'];

  const toggleExpanded = React.useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return {titleLabel, schemedTheme, isExpanded, toggleExpanded};
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppFeaturesProps {
  features: string[];
}

const AppFeatures = ({features}: AppFeaturesProps) => {
  const {titleLabel, schemedTheme, isExpanded, toggleExpanded} =
    useAppFeatures();

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Accordion Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}>
        <View style={styles.headerContent}>
          <MultiIcon
            size={18}
            type="material-icons"
            name="auto-awesome"
            color={schemedTheme.primary}
          />
          <Text
            variant="titleSmall"
            style={[styles.title, {color: schemedTheme.onSurface}]}>
            {titleLabel}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View
            style={[
              styles.badge,
              {backgroundColor: schemedTheme.primaryContainer},
            ]}>
            <Text
              variant="labelSmall"
              style={[
                styles.badgeText,
                {color: schemedTheme.onPrimaryContainer},
              ]}>
              {features.length}
            </Text>
          </View>
          <MultiIcon
            size={20}
            type="material-icons"
            name={isExpanded ? 'expand-less' : 'expand-more'}
            color={schemedTheme.onSurfaceVariant}
          />
        </View>
      </TouchableOpacity>

      {/* Collapsible Content */}
      {isExpanded && (
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Surface
              key={index}
              style={[
                styles.featureItem,
                {backgroundColor: schemedTheme.surfaceContainerLow},
              ]}
              elevation={0}>
              <View style={styles.featureContent}>
                <MultiIcon
                  size={14}
                  type="material-icons"
                  name="check-circle"
                  color={schemedTheme.primary}
                />
                <Text
                  variant="bodySmall"
                  style={[
                    styles.featureText,
                    {color: schemedTheme.onSurfaceVariant},
                  ]}
                  numberOfLines={2}>
                  {feature}
                </Text>
              </View>
            </Surface>
          ))}
        </View>
      )}
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  featuresGrid: {
    gap: 8,
    paddingTop: 4,
  },
  featureItem: {
    padding: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppFeatures);
