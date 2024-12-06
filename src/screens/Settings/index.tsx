import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {
  type SettingsScreenItem,
  SettingsScreenItemCheckbox,
  SettingsScreenItemDialog,
  SettingsScreenItemScreen,
  SettingsScreenSections,
} from './data';
import {MainStackRoute, Page} from '@/navigation/types';
import ScrollableScrollView, {
  ScrollableScrollViewHandle,
} from '@/common/components/ScrollableScrollView';
import {useDialogs} from '@/stores/runtime/dialogs';
import {useNavigate} from '@/common/hooks/useNavigate';
import {StyleSheet, View} from 'react-native';
import {
  SettingsSection,
  SettingsSectionItem,
  useSettings,
} from '@/stores/persistent/settings';
import {useShallow} from 'zustand/shallow';
import {useTranslations} from '@/stores/persistent/translations';
import AnimatedListItem, {
  AnimatedListItemProps,
} from '@/common/components/AnimatedListItem';
import {useRoute} from '@react-navigation/native';
import {buildMultiIcon} from '@/common/components/MultiIcon';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {Checkbox, List} from 'react-native-paper';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'settings';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function buildShouldPulse(
  section: SettingsSection,
  item: SettingsSectionItem<typeof section>,
) {
  return (params: object | undefined) => {
    if (
      !params ||
      'section' in params === false ||
      'item' in params === false
    ) {
      return false;
    }
    return params.section === section && params.item === item;
  };
}

function buildCheckbox(checked: boolean, onPress: () => void) {
  return memo((props: {color: string; style?: Style}) => (
    <View style={[styles.checkboxWrapper, props.style]}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={onPress}
        color={props.color}
      />
    </View>
  ));
}

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

type AnimatedListItemPropsWithRef = AnimatedListItemProps & {
  ref: (ref: View | null) => void;
};

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useSectionItems() {
  const itemRefs = useRef(new Map<string, Map<string, View | null>>());
  const [settings, setSettingWithPrevious] = useSettings(
    useShallow(state => [state.settings, state.setSettingWithPrevious]),
  );
  const translations = useTranslations(state => state.translations);
  const openDialog = useDialogs(state => state.openDialog);
  const navigate = useNavigate();

  const buildRefSetter = useCallback(
    (section: SettingsSection, item: SettingsSectionItem<typeof section>) =>
      (ref: View | null) => {
        if (!ref) {
          return;
        }
        if (!itemRefs.current.has(section)) {
          itemRefs.current.set(section, new Map());
        }
        itemRefs.current.get(section)!.set(item, ref);
      },
    [],
  );

  const buildBaseItem = useCallback(
    (item: SettingsScreenItem): AnimatedListItemPropsWithRef => ({
      ref: buildRefSetter(item.section, item.item),
      title: translations[item.title],
      description: translations[item.description],
      left: item.icon,
      shouldPulse: buildShouldPulse(item.section, item.item),
    }),
    [translations, buildRefSetter],
  );

  const buildDialogItem = useCallback(
    (item: SettingsScreenItemDialog): AnimatedListItemPropsWithRef => {
      const baseItem = buildBaseItem(item);
      baseItem.right = buildMultiIcon('open-in-app');
      baseItem.onPress = () => openDialog(item.data);
      return baseItem;
    },
    [buildBaseItem],
  );

  const buildScreenItem = useCallback(
    (item: SettingsScreenItemScreen): AnimatedListItemPropsWithRef => {
      const baseItem = buildBaseItem(item);
      baseItem.right = buildMultiIcon('arrow-right');
      baseItem.onPress = () =>
        navigate({
          stack: 'settings-stack',
          screen: item.data,
          params: undefined,
        });
      return baseItem;
    },
    [buildBaseItem, navigate],
  );

  const buildCheckboxItem = useCallback(
    (item: SettingsScreenItemCheckbox): AnimatedListItemPropsWithRef => {
      const baseItem = buildBaseItem(item);
      baseItem.onPress = () => {
        setSettingWithPrevious(
          item.section,
          item.item,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prev => !prev as any,
        );
      };
      baseItem.right = buildCheckbox(
        settings[item.section][item.item] as unknown as boolean,
        baseItem.onPress,
      );
      return baseItem;
    },
    [settings, buildBaseItem],
  );

  const buildAnyItem = useCallback(
    (item: SettingsScreenItem) => {
      switch (item.type) {
        case 'checkbox':
          return buildCheckboxItem(item);
        case 'dialog':
          return buildDialogItem(item);
        case 'screen':
          return buildScreenItem(item);
      }
    },
    [buildCheckboxItem, buildDialogItem, buildScreenItem],
  );

  const sections = useMemo(
    () =>
      SettingsScreenSections.map(section => ({
        title: translations[section.title],
        items: section.items.map(buildAnyItem),
      })),
    [translations, buildAnyItem],
  );

  return {
    itemRefs,
    sections,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SettingsScreen = () => {
  const scrollableScrollViewHandle = useRef<ScrollableScrollViewHandle>(null);
  const {params} = useRoute<MainStackRoute>();
  const {itemRefs, sections} = useSectionItems();

  useEffect(() => {
    if (
      !params ||
      'section' in params === false ||
      'item' in params === false
    ) {
      return;
    }
    const ref = itemRefs.current
      .get(params.section as string)
      ?.get(params.item as string);
    if (ref) {
      scrollableScrollViewHandle.current?.scrollToItem(ref);
    }
  }, [params, itemRefs]);

  useCurrPageEffect(CURR_PAGE);

  return (
    <ScrollableScrollView ref={scrollableScrollViewHandle}>
      {sections.map(section => (
        <List.Section key={section.title} title={section.title}>
          {section.items.map(item => (
            <AnimatedListItem key={item.title} {...item} />
          ))}
        </List.Section>
      ))}
    </ScrollableScrollView>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  checkboxWrapper: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsScreen);
