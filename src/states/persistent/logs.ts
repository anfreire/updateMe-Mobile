import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";

const STORAGE_ID = "logs" as const;

const MAX_LOGS = 1000;

const storage = new MMKV({ id: STORAGE_ID });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
}

type useLogsState = {
  logs: LogEntry[];
};

type useLogsActions = {
  addLog: (level: LogEntry["level"], message: string) => void;
  clearLogs: () => void;
  exportLogs: () => string[];
};

export type useLogsProps = useLogsState & useLogsActions;

export const useLogs = create<useLogsProps>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (level, message) => {
        const newLog: LogEntry = {
          timestamp: new Date().toISOString(),
          level,
          message,
        };
        set((state) => {
          const logs = [newLog, ...state.logs].slice(0, MAX_LOGS);
          return { logs };
        });
      },
      clearLogs: () => set({ logs: [] }),
      exportLogs: () => {
        return get().logs.map(
          (log) =>
            `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`
        );
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export const Logger = {
  info: (message: string) => useLogs.getState().addLog("info", message),
  warn: (message: string) => useLogs.getState().addLog("warn", message),
  error: (message: string) => useLogs.getState().addLog("error", message),
  clear: () => useLogs.getState().clearLogs(),
  export: () => useLogs.getState().exportLogs(),
};
