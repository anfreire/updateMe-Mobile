import * as React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Button, Dialog, IconButton, SegmentedButtons} from 'react-native-paper';
import MultiIcon, {MultiIconType} from './MultiIcon';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {useTranslations} from '@/states/persistent/translations';
import {useDialogs} from '@/states/runtime/dialogs';
import {Translation} from '@/types/translations';
import {useToast} from '@/states/runtime/toast';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface PageButton {
  value: string;
  label: Translation;
  icon:
    | {
        type: MultiIconType;
        name: string;
      }
    | string;
}

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/
function buildSegmentedButtonData(button: PageButton) {
  return {
    value: button.value,
    label: button.label,
    icon:
      typeof button.icon === 'string'
        ? button.icon
        : (props: {color: string; style?: Style}) => (
            <MultiIcon
              {...props}
              type={(button.icon as Exclude<PageButton['icon'], string>).type}
              name={(button.icon as Exclude<PageButton['icon'], string>).name}
            />
          ),
  };
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useMultiPagesDialog = (
  buttons: PageButton[],
  onSave: (closeDialog: () => void) => void,
  info: string,
) => {
  const translations = useTranslations(state => state.translations);
  const closeDialog = useDialogs(state => state.closeDialog);
  const {height: screenHeight} = useWindowDimensions();
  const openToast = useToast(state => state.openToast);

  const labels = React.useMemo(
    () => ({
      save: translations['Save'],
      cancel: translations['Cancel'],
    }),
    [translations],
  );

  const segmentedButtons = React.useMemo(
    () => buttons.map(buildSegmentedButtonData),
    [buttons],
  );

  const segmentedButtonsDynamicStyles = React.useMemo(
    () => ({paddingHorizontal: buttons.length > 2 ? 18 : 36}),
    [buttons],
  );

  const scrollAreaDynimacStyles = React.useMemo(
    () => ({height: screenHeight * 0.5}),
    [screenHeight],
  );

  const handleSave = React.useCallback(() => onSave(closeDialog), [onSave]);

  const handleInfo = React.useCallback(() => openToast(info), [info]);

  return {
    labels,
    segmentedButtons,
    segmentedButtonsDynamicStyles,
    scrollAreaDynimacStyles,
    handleSave,
    closeDialog,
    handleInfo,
  };
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type MultiPagesDialogProps = React.PropsWithChildren<{
  title: string;
  info: string;
  buttons: PageButton[];
  onSave: (closeDialog: () => void) => void;
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}>;

const MultiPagesDialog = ({
  title,
  info,
  buttons,
  onSave,
  activePage,
  setActivePage,
  children,
}: MultiPagesDialogProps) => {
  const {
    labels,
    segmentedButtons,
    segmentedButtonsDynamicStyles,
    scrollAreaDynimacStyles,
    handleSave,
    closeDialog,
    handleInfo,
  } = useMultiPagesDialog(buttons, onSave, info);

  return (
    <Dialog
      visible
      dismissable={false}
      dismissableBackButton={false}
      style={styles.dialog}>
      <Dialog.Title style={styles.title}>{title}</Dialog.Title>
      <View style={styles.content}>
        <SegmentedButtons
          buttons={segmentedButtons}
          value={activePage}
          onValueChange={setActivePage}
          style={[styles.segmentedButton, segmentedButtonsDynamicStyles]}
        />
        <Dialog.ScrollArea
          style={[styles.listWrapper, scrollAreaDynimacStyles]}>
          {children}
        </Dialog.ScrollArea>
      </View>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={closeDialog}>{labels.cancel}</Button>
        <Button onPress={handleSave}>{labels.save}</Button>
      </Dialog.Actions>
      <IconButton
        icon="information"
        style={styles.infoButton}
        onPress={handleInfo}
      />
    </Dialog>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  dialog: {
    position: 'relative',
  },
  infoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  title: {
    marginBottom: 24,
  },
  listWrapper: {
    width: '100%',
    paddingHorizontal: 0,
    margin: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  segmentedButton: {
    marginBottom: 18,
    padding: 0,
  },
  actions: {
    display: 'flex',
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingBottom: 0,
    height: 64,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(MultiPagesDialog);
