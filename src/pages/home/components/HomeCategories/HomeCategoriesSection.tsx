import {Categories} from '@/states/fetched/categories';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/components/multiIcon';
import HomeCategoriesItem from './HomeCategoriesItem';

/*******************************************************************************
 *                                    LOGIC                                    *
 *******************************************************************************/

function useHomeCategoriesSection(
  title: string,
  category: Categories[string],
  toggleCategory: (category: string) => void,
) {
  const buildCategoryIcon = React.useCallback(
    (props: {color: string; style: Style}) => (
      <MultiIcon
        type={category.type}
        name={category.icon}
        {...props}
        size={18}
      />
    ),
    [category.type, category.icon],
  );

  const handleOnPress = React.useCallback(() => {
    toggleCategory(title);
  }, [toggleCategory, title]);

  return {buildCategoryIcon, handleOnPress};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

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
  const {buildCategoryIcon, handleOnPress} = useHomeCategoriesSection(
    title,
    category,
    toggleCategory,
  );

  return (
    <List.Accordion
      title={title}
      style={styles.categoryContainer}
      expanded={isExpanded}
      onPress={handleOnPress}
      left={buildCategoryIcon}>
      {category.apps.map(app => (
        <HomeCategoriesItem key={app} app={app} />
      ))}
    </List.Accordion>
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  categoryContainer: {
    paddingLeft: 0,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(HomeCategoriesSection);
