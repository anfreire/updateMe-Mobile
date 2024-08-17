import { create } from "zustand";

const DIALOGS = [
  "sourceColorPicker",
  "colorSchemePicker",
  "share",
  "homeLayoutPicker",
  "newVersion",
] as const;

export type CustomDialogsType = (typeof DIALOGS)[number];

export type DefaultDialogProps = {
  title: string;
  content: string;
  actions: { title: string; action: () => void }[];
};

export type ActiveDialogType = (typeof DIALOGS)[number] | "default" | null;

export type useDialogsProps = {
  activeDialog: ActiveDialogType;
  defaultDialogProps: DefaultDialogProps | null;
  openDialog: (key: (typeof DIALOGS)[number] | DefaultDialogProps) => void;
  closeDialog: () => void;
};

export const useDialogs = create<useDialogsProps>((set, get) => ({
  activeDialog: null,
  defaultDialogProps: null,
  openDialog: (key) => {
    if (
      (typeof key === "string" && get().activeDialog === key) ||
      (typeof key !== "string" &&
        JSON.stringify(get().defaultDialogProps) === JSON.stringify(key))
    )
      return;
    set(() => {
      if (typeof key === "string" && DIALOGS.includes(key)) {
        return {
          activeDialog: key as (typeof DIALOGS)[number],
          defaultDialogProps: null,
        };
      }
      return {
        activeDialog: "default",
        defaultDialogProps: key as DefaultDialogProps,
      };
    });
  },
  closeDialog: () => set({ activeDialog: null, defaultDialogProps: null }),
}));
