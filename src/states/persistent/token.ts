import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const storage = new MMKV({ id: "token" });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

export interface useTokenProps {
  _token: string | null;
  getToken: () => string;
}

function generateToken() {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomString}`;
}

export const useToken = create<useTokenProps>()(
  persist(
    (set, get) => ({
      _token: null,
      getToken: () => {
        const token = get()._token;
        if (token) {
          return token;
        }
        const newToken = generateToken();
        set({ _token: newToken });
        return newToken;
      },
    }),
    {
      name: "token",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
