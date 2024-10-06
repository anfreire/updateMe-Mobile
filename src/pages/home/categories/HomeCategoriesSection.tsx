import {Categories} from '@/states/fetched/categories';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/components/multiIcon';
import HomeCategoriesItem from './HomeCategoriesItem';

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
  const CategoryIcon = React.useCallback(
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

  return (
    <List.Accordion
      title={title}
      style={styles.categoryContainer}
      expanded={isExpanded}
      onPress={handleOnPress}
      left={CategoryIcon}>
      {category.apps.map(app => (
        <HomeCategoriesItem key={app} app={app} />
      ))}
    </List.Accordion>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    paddingLeft: 0,
  },
});

export default React.memo(HomeCategoriesSection);
