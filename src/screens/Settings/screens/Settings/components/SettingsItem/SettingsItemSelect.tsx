import React, {memo, useCallback, useMemo} from 'react';
import {useSettings} from '@/stores/persistent/settings';
import {useShallow} from 'zustand/shallow';
import {SettingsScreenItemSelect} from '../../data';
import {SettingsItemProps} from '.';
import SettingsItemBase from './SettingsItemBase';
import {View} from 'react-native';
import {Translation, useTranslations} from '@/stores/persistent/translations';
import {TextInput} from 'react-native-paper';
import MultiIcon from '@/common/components/MultiIcon';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const ItemSelect = memo(({data}: {data: SettingsScreenItemSelect['data']}) => {
  const translations = useTranslations(state => state.translations);
  const [selectedValue, setSetting] = useSettings(
    useShallow(state => [
      state.settings[data.section][data.item!],
      state.setSetting,
    ]),
  );

  const labelsToValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(data.values).map(([key, value]) => [
          translations[key as Translation],
          value,
        ]),
      ),
    [data.values, translations],
  );

  const labels = useMemo(() => Object.keys(labelsToValues), [labelsToValues]);

  const onSelect = useCallback(
    (value: string) => {
      setSetting(data.section, data.item, labelsToValues[value]);
    },
    [data.section, data.item, labelsToValues],
  );

  const selectChevron = useCallback(
    () => (
      <View className="justify-center items-center">
        <MultiIcon
          color="gray"
          size={20}
          type="material-icons"
          name="chevron-right"
        />
      </View>
    ),
    [],
  );

  return (
    <View className="justify-center items-center h-10 max-w-">
      <TextInput
        dense
        mode="outlined"
        numberOfLines={1}
        value={'Systema'}
        onChangeText={onSelect}
        editable={false}
      />
    </View>
  );
});

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsItemSelectProps extends Omit<SettingsItemProps, 'item'> {
  item: SettingsScreenItemSelect;
}

const SettingsItemSelect = ({
  item,
  scrollToItem,
  route,
}: SettingsItemSelectProps) => {
  const rightItem = useCallback(
    () => <ItemSelect data={item.data} />,
    [item.data],
  );

  return (
    <SettingsItemBase
      item={item}
      scrollToItem={scrollToItem}
      route={route}
      rightItem={rightItem}
    />
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsItemSelect);
