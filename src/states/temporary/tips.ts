import {create} from 'zustand';

const TIPS_URL =
  'https://raw.githubusercontent.com/anfreire/updateMe-Data/main/tips.json';

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

export const useTips = create<useAppProps>(set => ({
  tips: {},
  currTip: null,
  setCurrTip: tip => set({currTip: tip}),
  fetchTips: async () => {
    try {
      const response = await fetch(TIPS_URL);
      const tips = await response.json();
      set({tips});
    } catch (error) {}
  },
}));
