import {create} from 'zustand';

export type Dialog =
  | 'sourceColorPicker'
  | 'colorSchemePicker'
  | 'share'
  | 'homeLayoutPicker'
  | 'newVersion';

export type CustomDialogProps = {
  title: string;
  content: string;
  actions: {title: string; action: () => void}[];
};

export type ActiveDialogType = Dialog | 'custom' | null;

type useDialogsState = {
  activeDialog: ActiveDialogType;
  customDialog: CustomDialogProps | null;
};

type useDialogsActions = {
  openDialog: (dialog: ActiveDialogType | CustomDialogProps) => void;
  closeDialog: () => void;
};

export type useDialogsProps = useDialogsState & useDialogsActions;

export const useDialogs = create<useDialogsProps>(set => ({
  activeDialog: null,
  customDialog: null,
  openDialog: key => {
    if (typeof key === 'string') {
      set(state =>
        state.activeDialog === key
          ? state
          : {activeDialog: key, customDialog: null},
      );
    } else {
      set(state =>
        isEqual(state.customDialog, key)
          ? state
          : {activeDialog: 'custom', customDialog: key},
      );
    }
  },
  closeDialog: () =>
    set(state =>
      state.activeDialog === null && state.customDialog === null
        ? state
        : {activeDialog: null, customDialog: null},
    ),
}));
