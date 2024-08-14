import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";

interface LogEntry {
	timestamp: string;
	level: "info" | "warn" | "error";
	message: string;
}

const MAX_LOGS = 1000;

export interface useLogsProps {
	logs: LogEntry[];
	addLog: (level: LogEntry["level"], message: string) => void;
	clearLogs: () => void;
	exportLogs: () => string[];
}

const storage = new MMKV({ id: "logs" });

const zustandStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, value);
	},
	getItem: (name) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
};

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
						`${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`,
				);
			},
		}),
		{
			name: "logs",
			storage: createJSONStorage(() => zustandStorage),
		},
	),
);

export const Logger = {
	info: (message: string) => useLogs.getState().addLog("info", message),
	warn: (message: string) => useLogs.getState().addLog("warn", message),
	error: (message: string) => useLogs.getState().addLog("error", message),
	clear: () => useLogs.getState().clearLogs(),
	export: () => useLogs.getState().exportLogs(),
};
