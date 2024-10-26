import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {DataTable, Icon, Text} from 'react-native-paper';
import MultiIcon, {MultiIconType} from '@/components/MultiIcon';
import {useToast} from '@/states/runtime/toast';

/*******************************************************************************
 *                                BASE COMPONENT                               *
 *******************************************************************************/

interface BaseCellProps {
  onPressMessage: string;
  onLongPress: () => void;
  width: number;
  isFirst?: boolean;
  floatingIcon?: {
    type: MultiIconType;
    name: string;
  };
}

interface TextCellProps {
  text: string;
  icon?: never;
}
interface IconCellProps {
  icon: string;
  text?: never;
}

export type CellProps = BaseCellProps & (TextCellProps | IconCellProps);

const Cell = ({
  onPressMessage,
  onLongPress,
  width,
  isFirst,
  floatingIcon,
  text,
  icon,
}: CellProps) => {
  const openToast = useToast(state => state.openToast);

  const style = isFirst ? styles.firstCell : styles.otherCells;

  return (
    <DataTable.Cell
      onPress={() => openToast(onPressMessage)}
      onLongPress={onLongPress}
      style={[style, {width}]}>
      <View style={styles.floatingWrapper}>
        {text && <Text numberOfLines={1}>{text}</Text>}
        {icon && <Icon size={18} source={icon} />}
        {floatingIcon && (
          <MultiIcon
            style={styles.floatingIcon}
            size={10}
            type={floatingIcon.type}
            name={floatingIcon.name}
          />
        )}
      </View>
    </DataTable.Cell>
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  firstCell: {
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  otherCells: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  floatingWrapper: {
    position: 'relative',
  },
  floatingIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(Cell);
