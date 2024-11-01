import * as React from 'react';
import {useSettings} from '@/states/persistent/settings';
import {ItemComponentDataInferred} from '../data';
import {useShallow} from 'zustand/react/shallow';
import {
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemValue,
} from '@/types/settings';
import {usePulsingStyles} from '@/hooks/usePulsing';
import {useRoute} from '@react-navigation/native';
import {RouteProps} from '@/types/navigation';
import {Dialog, useDialogs} from '@/states/runtime/dialogs';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/components/MultiIcon';
import {Checkbox, List} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';

/*******************************************************************************
 *                                  CONSTANTS                                  *
 *******************************************************************************/

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

/*******************************************************************************
 *                                    UTILS                                    *
 *******************************************************************************/

const buildChevron = ({color, style}: {color: string; style?: Style}) => (
  <MultiIcon
    color={color}
    style={style}
    size={20}
    type="material-icons"
    name="chevron-right"
  />
);

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useCheckboxSettingsItem(data: ItemComponentDataInferred) {
  const section = data.action.data as SettingsSection;
  const item = data.key as SettingsSectionItem<typeof section>;

  const [persistedValue, setPersistedValue] = useSettings(
    useShallow(state => [state.settings[section][item], state.setSetting]),
  );

  const handlePress = React.useCallback(
    () =>
      setPersistedValue(
        section,
        item,
        !persistedValue as SettingsSectionItemValue<
          typeof section,
          typeof item
        >,
      ),
    [section, item, persistedValue],
  );

  const rightItem = React.useCallback(
    (props: {color: string; style?: Style}) => (
      <Checkbox
        status={persistedValue ? 'checked' : 'unchecked'}
        onPress={handlePress}
        color={props.color}
      />
    ),
    [persistedValue, handlePress],
  );

  return {
    handlePress,
    rightItem,
  };
}

function useDialogSettingsItem(data: ItemComponentDataInferred) {
  const openDialog = useDialogs(state => state.openDialog);

  const handlePress = React.useCallback(
    () => openDialog(data.action.data as Dialog),
    [data.action.data],
  );

  return {
    handlePress,
    rightItem: buildChevron,
  };
}

function useSettingsItem(data: ItemComponentDataInferred) {
  const {params} = useRoute<RouteProps>();

  const paramMatches = React.useMemo(
    () => !!(params && 'setting' in params && params.setting === data.key),
    [params, data.key],
  );

  const pulsingStyles = usePulsingStyles(paramMatches);

  const leftItem = React.useCallback(
    (props: {color: string; style: Style}) => (
      <View style={styles.iconWrapper}>
        <MultiIcon
          {...props}
          size={20}
          type={data.icon.type}
          name={data.icon.name}
        />
      </View>
    ),
    [data.icon.type, data.icon.name],
  );

  const hook = React.useMemo(
    () =>
      data.action.type === 'dialog'
        ? useDialogSettingsItem
        : useCheckboxSettingsItem,
    [data.action.type],
  );

  const {handlePress, rightItem} = hook(data);

  return {
    pulsingStyles,
    handlePress,
    leftItem,
    rightItem,
  };
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface SettingsItemProps {
  data: ItemComponentDataInferred;
}

const SettingsItem = ({data}: SettingsItemProps) => {
  const {pulsingStyles, handlePress, leftItem, rightItem} =
    useSettingsItem(data);

  return (
    <AnimatedListItem
      title={data.title}
      description={data.description}
      style={pulsingStyles}
      left={leftItem}
      right={rightItem}
      onPress={handlePress}
    />
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default SettingsItem;
