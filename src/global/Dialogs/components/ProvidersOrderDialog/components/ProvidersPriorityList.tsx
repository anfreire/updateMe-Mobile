import * as React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import ProvidersPriorityListItem from './ProvidersPriorityListItem';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const keyExtractor = (item: string) => item;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface ProvidersPriorityListProps {
  orderedProviders: string[];
  setOrderedProviders: (providersOrder: string[]) => void;
}

const ProvidersPriorityList = ({
  orderedProviders,
  setOrderedProviders,
}: ProvidersPriorityListProps) => {
  const {schemedTheme} = useTheme();

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <DraggableFlatList
        data={orderedProviders}
        style={{backgroundColor: schemedTheme.elevation.level3}}
        onDragEnd={({data}) => setOrderedProviders(data)}
        renderItem={ProvidersPriorityListItem}
        keyExtractor={keyExtractor}
      />
    </GestureHandlerRootView>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(ProvidersPriorityList);
