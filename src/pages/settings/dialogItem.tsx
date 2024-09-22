import * as React from 'react';
import {useTranslations} from '@/states/persistent/translations';
import {Dialog, useDialogs} from '@/states/runtime/dialogs';
import {List} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import MultiIcon from '@/components/multiIcon';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {usePulsingSettingsStyles} from './usePulsingSettingsStyle';
import {ItemComponentDataInferred} from './data';

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

const buildChevron = ({color, style}: {color: string; style?: Style}) => (
  <MultiIcon
    color={color}
    style={style}
    size={20}
    type="material-icons"
    name="chevron-right"
  />
);

interface DialogSettingItemProps {
  data: ItemComponentDataInferred;
}

const DialogSettingsItem = ({data}: DialogSettingItemProps) => {
  const [title, description] = useTranslations(state => [
    state.translations[data.title],
    state.translations[data.description],
  ]);
  const openDialog = useDialogs(state => state.openDialog);
  const pulsingStyles = usePulsingSettingsStyles(data.key);

  const handlePress = React.useCallback(() => {
    openDialog(data.action.data as Dialog);
  }, [data.action.data]);

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
      right={buildChevron}
      onPress={handlePress}
    />
  );
};

DialogSettingsItem.displayName = 'DialogSettingsItem';

export default React.memo(DialogSettingsItem);
