import {create} from 'zustand';

const DIALOGS = [
  'sourceColorPicker',
  'colorSchemePicker',
  'share',
  'homeLayoutPicker',
  'newVersion',
] as const;

export type CustomDialogsType = (typeof DIALOGS)[number];

export type DefaultDialogProps = {
  title: string;
  content: string;
  actions: {title: string; action: () => void}[];
};

export type useDialogsProps = {
  activeDialog: (typeof DIALOGS)[number] | 'default' | null;
  defaultDialogProps: DefaultDialogProps | null;
  openDialog: (key: (typeof DIALOGS)[number] | DefaultDialogProps) => void;
  closeDialog: () => void;
};

export const useDialogs = create<useDialogsProps>(set => ({
  activeDialog: null,
  defaultDialogProps: null,
  openDialog: key => {
    set(() => {
      if (typeof key === 'string' && DIALOGS.includes(key)) {
        return {
          activeDialog: key as (typeof DIALOGS)[number],
          defaultDialogProps: null,
        };
      }
      return {
        activeDialog: 'default',
        defaultDialogProps: key as DefaultDialogProps,
      };
    });
  },
  closeDialog: () => set({activeDialog: null, defaultDialogProps: null}),
}));
