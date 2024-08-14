import { NativeModules } from "react-native";

interface AppsModuleInterface {
	getAllApps(): Promise<string[]>;
	getAppVersion(packageName: string): Promise<string | null>;
	isAppInstalled(packageName: string): Promise<boolean>;
	openApp(packageName: string): void;
	uninstallApp(packageName: string): void;
}

const AppsModule: AppsModuleInterface = NativeModules.AppsModule;

export default AppsModule;
