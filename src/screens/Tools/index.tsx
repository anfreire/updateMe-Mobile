import React, {memo, useEffect, useMemo, useRef} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {MainStackRoute, Page, ToolsStackPage} from '@/navigation/types';
import {TOOLS} from './data';
import {useNavigate} from '@/common/hooks/useNavigate';
import {buildMultiIcon} from '@/common/components/MultiIcon';
import {View} from 'react-native';
import AnimatedListItem from '@/common/components/AnimatedListItem';
import {useRoute} from '@react-navigation/native';
import {useTranslations} from '@/stores/persistent/translations';
import ScrollableScrollView, {
  ScrollableScrollViewHandle,
} from '@/common/components/ScrollableScrollView';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'tools';

const rightItem = buildMultiIcon('arrow-right');

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function buildShouldPulse(screen: ToolsStackPage) {
  return (params: object | undefined) => {
    if (!params || 'tool' in params === false) {
      return false;
    }
    return params.tool === screen;
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ToolsScreen = () => {
  const navigate = useNavigate();
  const translations = useTranslations(state => state.translations);
  const scrollViewHandle = useRef<ScrollableScrollViewHandle>(null);
  const itemRefs = useRef(new Map<string, View>());
  const {params} = useRoute<MainStackRoute>();

  const items = useMemo(
    () =>
      TOOLS.map(item => ({
        ref: (ref: View | null) => {
          if (ref) {
            itemRefs.current.set(item.screen, ref);
          } else {
            itemRefs.current.delete(item.screen);
          }
        },
        title: translations[item.title],
        description: translations[item.description],
        left: item.icon,
        righ: rightItem,
        onPress: () =>
          navigate({
            stack: 'tools-stack',
            screen: item.screen,
            params: undefined,
          }),
        shouldPulse: buildShouldPulse(item.screen),
      })),
    [translations, navigate],
  );

  useEffect(() => {
    if (params && 'tool' in params) {
      const ref = itemRefs.current.get(params.tool as string);
      if (ref) {
        scrollViewHandle.current?.scrollToItem(ref);
      }
    }
  }, [params]);

  useCurrPageEffect(CURR_PAGE);

  return (
    <ScrollableScrollView ref={scrollViewHandle}>
      {items.map(tool => (
        <AnimatedListItem key={tool.title} {...tool} />
      ))}
    </ScrollableScrollView>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(ToolsScreen);
