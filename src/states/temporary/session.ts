import {create} from 'zustand';

interface Session {
  downloadsOpenedDrawer: boolean;
  updatesBannerDismissed: string[];
}

type SessionProperties<V> = {
  [K in keyof Session]: Session[K] extends V ? K : never;
}[keyof Session];

type ActivatableKeys = SessionProperties<boolean>;

type AddableKeys = SessionProperties<string[]>;
export interface useSessionProps extends Session {
  activate: (key: ActivatableKeys) => void;
  add: (key: AddableKeys, value: string) => void;
}

export const useSession = create<useSessionProps>(set => ({
  downloadsOpenedDrawer: false,
  updatesBannerDismissed: [],
  activate: key => set(({[key]: true})),
  add: (key, value) => set(state => ({[key]: [...state[key], value]})),
}));
