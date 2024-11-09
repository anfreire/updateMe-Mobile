import * as React from 'react';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {SectionsData} from './data';
import SettingsSection from './components/SettingsSection';
import {useTranslations} from '@/states/persistent/translations';
import {ScrollView} from 'react-native-gesture-handler';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'settings';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useSettingsScreen() {
  const translations = useTranslations(state => state.translations);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const translatedSectionsData = React.useMemo(
    () =>
      Object.values(SectionsData).map(section => ({
        ...section,
        title: translations[section.title],
        items: section.items.map(item => ({
          ...item,
          title: translations[item.title],
          description: translations[item.description],
        })),
      })) as typeof SectionsData,
    [translations],
  );

  useCurrPageEffect(CURR_PAGE);

  return {translatedSectionsData, scrollViewRef};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SettingsScreen = () => {
  const {translatedSectionsData, scrollViewRef} = useSettingsScreen();

  return (
    <ScrollView ref={scrollViewRef}>
      {Object.values(translatedSectionsData).map(section => (
        <SettingsSection
          key={section.title}
          section={section}
          scrollViewRef={scrollViewRef}
        />
      ))}
    </ScrollView>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default SettingsScreen;
