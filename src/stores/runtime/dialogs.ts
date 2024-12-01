import {create} from 'zustand';
import {deepEqual} from 'fast-equals';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type Dialog = 'share';

export type CustomDialogProps = {
  title: string;
  content: string;
  actions: {title: string; onPress: () => void}[];
};

export type ActiveDialogType = Dialog | 'custom' | null;

/******************************************************************************
 *                                   STORE                                    *
 ******************************************************************************/

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
  openDialog: props => {
    if (typeof props === 'string') {
      set(state =>
        state.activeDialog === props
          ? state
          : {activeDialog: props, customDialog: null},
      );
    } else {
      set(state =>
        deepEqual(state.customDialog, props)
          ? state
          : {activeDialog: 'custom', customDialog: props},
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
