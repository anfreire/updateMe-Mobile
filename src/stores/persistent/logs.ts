import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {buildPersistentStorage, migrate} from '../utils';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  subCategory: string;
  message: string;
  reason?: unknown;
}

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const STORAGE_ID = 'logs' as const;

const MAX_LOGS = 1000;

const PERSISTED_KEYS: Array<keyof useLogsState> = ['logs'];

const DEFAULT_STATE = {
  logs: [],
};

/******************************************************************************
 *                                   STORE                                    *
 ******************************************************************************/

type useLogsState = {
  logs: LogEntry[];
};

type useLogsActions = {
  addLog: (
    level: LogEntry['level'],
    category: string,
    subCategory: string,
    message: string,
    reason?: unknown,
  ) => void;
  clearLogs: () => void;
  exportLogs: () => string[];
};

export type useLogsProps = useLogsState & useLogsActions;

const zustandStorage = buildPersistentStorage(STORAGE_ID);

export const useLogs = create<useLogsProps>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (level, category, subCategory, message, reason) => {
        const newLog: LogEntry = {
          timestamp: new Date().toISOString(),
          level,
          category,
          subCategory,
          message,
          reason,
        };
        switch (level) {
          case 'debug':
            console.debug(newLog);
            break;
          case 'info':
            console.info(newLog);
            break;
          case 'warn':
            console.warn(newLog);
            break;
          case 'error':
            console.error(newLog);
            break;
        }
        set(state => {
          const logs = [newLog, ...state.logs].slice(0, MAX_LOGS);
          return {logs};
        });
      },
      clearLogs: () => set({logs: []}),
      exportLogs: () => {
        return get().logs.map(
          log =>
            `${log.timestamp} [${log.level.toUpperCase()}] [${log.category}] [${log.subCategory}]\n${log.message}` +
            (log.reason ? `\n${JSON.stringify(log.reason, null, 2)}` : ''),
        );
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
      migrate: (persistedState, version) =>
        migrate(DEFAULT_STATE, persistedState, version),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTED_KEYS.includes(key as keyof useLogsState),
          ),
        ),
    },
  ),
);

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

export const Logger = {
  debug: (
    category: string,
    subCategory: string,
    message: string,
    exception?: unknown,
  ) =>
    useLogs
      .getState()
      .addLog('debug', category, subCategory, message, exception),
  info: (
    category: string,
    subCategory: string,
    message: string,
    exception?: unknown,
  ) =>
    useLogs
      .getState()
      .addLog('info', category, subCategory, message, exception),
  warn: (
    category: string,
    subCategory: string,
    message: string,
    exception?: unknown,
  ) =>
    useLogs
      .getState()
      .addLog('warn', category, subCategory, message, exception),
  error: (
    category: string,
    subCategory: string,
    message: string,
    exception?: unknown,
  ) =>
    useLogs
      .getState()
      .addLog('error', category, subCategory, message, exception),
  clear: () => useLogs.getState().clearLogs(),
  export: () => useLogs.getState().exportLogs(),
};
