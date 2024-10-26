import * as React from 'react';
import {useTranslations} from '@/states/persistent/translations';
import {Checkbox, List} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import MultiIcon from '@/components/MultiIcon';
import {useSettings} from '@/states/persistent/settings';
import {ItemComponentDataInferred} from '../data';
import {useShallow} from 'zustand/react/shallow';
import {
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemValue,
} from '@/types/settings';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {usePulsingStyles} from '@/hooks/usePulsing';
import {useRoute} from '@react-navigation/native';
import {RouteProps} from '@/types/navigation';

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

interface CheckboxSettingItemProps {
  data: ItemComponentDataInferred;
}

const CheckboxSettingsItem = ({data}: CheckboxSettingItemProps) => {
  const section = data.action.data as SettingsSection;
  const item = data.key as SettingsSectionItem<typeof section>;

  const [title, description] = useTranslations(state => [
    state.translations[data.title],
    state.translations[data.description],
  ]);
  const {params} = useRoute<RouteProps>();
  const paramMatches = React.useMemo(
    () => !!(params && 'setting' in params && params.setting === item),
    [params, item],
  );

  const pulsingStyles = usePulsingStyles(paramMatches);
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

  const buildIcon = React.useCallback(
    (props: {color: string; style: Style}) => (
      <MultiIcon
        {...props}
        size={20}
        type={data.icon.type}
        name={data.icon.name}
      />
    ),
    [data.icon.type, data.icon.name],
  );

  return (
    <AnimatedListItem
      title={title}
      description={description}
      style={pulsingStyles}
      left={buildIcon}
      right={props => (
        <Checkbox
          status={persistedValue ? 'checked' : 'unchecked'}
          onPress={handlePress}
          color={props.color}
        />
      )}
      onPress={handlePress}
    />
  );
};

export default React.memo(CheckboxSettingsItem);
