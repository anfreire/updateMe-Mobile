import {Categories} from '@/states/fetched/categories';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import HomeCategoryItem from './homeCategoryItem';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/components/multiIcon';

interface HomeCategorySectionProps {
  title: string;
  category: Categories[string];
  expanded: boolean;
  toggleCategory: (category: string) => void;
}

const HomeCategorySection = ({
  title,
  category,
  expanded,
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

  const handleToggle = React.useCallback(() => {
    toggleCategory(title);
  }, [toggleCategory, title]);

  return (
    <List.Accordion
      title={title}
      style={styles.categoryContainer}
      expanded={expanded}
      onPress={handleToggle}
      left={CategoryIcon}>
      {category.apps.map(app => (
        <HomeCategoryItem key={app} app={app} />
      ))}
    </List.Accordion>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    paddingLeft: 0,
  },
});

HomeCategorySection.displayName = 'HomeCategorySection';

export default React.memo(HomeCategorySection);
