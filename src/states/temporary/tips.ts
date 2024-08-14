import { create } from "zustand";
import { Logger } from "../persistent/logs";

const TIPS_URL =
	"https://raw.githubusercontent.com/anfreire/updateMe-Data/main/tips.json";

type TipsType = Record<
	string,
	{
		description: string;
		content: {
			image: string;
			description: string;
		}[];
	}
>;

export interface useAppProps {
	tips: TipsType;
	currTip: string | null;
	setCurrTip: (tip: string | null) => void;
	fetchTips: () => Promise<void>;
}

export const useTips = create<useAppProps>((set, get) => ({
	tips: {},
	currTip: null,
	setCurrTip: (tip) => {
		if (tip === get().currTip) return;
		set({ currTip: tip });
	},
	fetchTips: async () => {
		try {
			const response = await fetch(TIPS_URL);
			const tips = await response.json();
			set({ tips });
		} catch (error) {
			Logger.error(`Error fetching tips: ${error}`);
		}
	},
}));
