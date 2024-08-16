import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';

const storage = new MMKV({id: 'token'});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    return storage.getString(name) || null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export interface useToken {
  token: string | null;
  init: () => void;
}

export const useToken = create<useToken>()(
  persist(
    (set, get) => ({
      token: null,
      init: () => {
        if (!get().token) {
          const token = storage.getString('token');
          if (token) {
            set({token});
          } else {
            const timestamp = Date.now().toString(36);
            const randomString = Math.random().toString(36).substring(2, 15);
            set({token: `${timestamp}-${randomString}`});
          }
        }
      },
    }),
    {
      name: 'token',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
