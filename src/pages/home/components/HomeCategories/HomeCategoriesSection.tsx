import {Categories} from '@/states/fetched/categories';
import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {useTheme} from '@/theme';
import MultiIcon from '@/components/MultiIcon';
import HomeCategoriesItem from './HomeCategoriesItem';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useHomeCategoriesSection(
  title: string,
  category: Categories[string],
  isExpanded: boolean,
  toggleCategory: (category: string) => void,
) {
  const {schemedTheme} = useTheme();

  const handleToggle = React.useCallback(() => {
    toggleCategory(title);
  }, [toggleCategory, title]);

  return {
    schemedTheme,
    handleToggle,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface HomeCategorySectionProps {
  title: string;
  category: Categories[string];
  isExpanded: boolean;
  toggleCategory: (category: string) => void;
}

const HomeCategoriesSection = ({
  title,
  category,
  isExpanded,
  toggleCategory,
}: HomeCategorySectionProps) => {
  const {schemedTheme, handleToggle} = useHomeCategoriesSection(
    title,
    category,
    isExpanded,
    toggleCategory,
  );

  return (
    <View style={styles.container}>
      {/* Clean Category Header */}
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={handleToggle}
        activeOpacity={0.6}>
        <View style={styles.headerLeft}>
          <MultiIcon
            type={category.type}
            name={category.icon}
            size={20}
            color={schemedTheme.onSurfaceVariant}
          />

          <Text
            variant="titleMedium"
            style={[styles.categoryTitle, {color: schemedTheme.onSurface}]}>
            {title}
          </Text>

          <Text
            variant="bodySmall"
            style={[styles.appCount, {color: schemedTheme.onSurfaceVariant}]}>
            {category.apps.length}
          </Text>
        </View>

        <MultiIcon
          size={18}
          type="material-icons"
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          color={schemedTheme.onSurfaceVariant}
        />
      </TouchableOpacity>

      {/* Compact Apps List */}
      {isExpanded && (
        <View style={styles.appsContainer}>
          {category.apps.map(app => (
            <HomeCategoriesItem key={app} app={app} />
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
    paddingHorizontal: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryTitle: {
    fontWeight: '600',
    letterSpacing: 0.2,
    flex: 1,
  },
  appCount: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  appsContainer: {
    paddingLeft: 32,
    paddingBottom: 8,
    gap: 2,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(HomeCategoriesSection);
