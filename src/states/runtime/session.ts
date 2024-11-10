import {
  INITIAL_SESSION_FLAGS,
  INITIAL_SESSION_TRACKERS,
  SessionFlags,
  SessionTrackers,
} from '@/types/session';
import {create} from 'zustand';
import {Page} from '@/types/navigation';

type useSessionState = {
  currPage: Page;
  flags: SessionFlags;
  trackers: SessionTrackers;
};

type useSessionActions = {
  setCurrPage: (page: Page) => void;
  activateFlag: (key: keyof SessionFlags) => void;
  addTracker: (key: keyof SessionTrackers, value: string) => void;
};

export type useSessionProps = useSessionState & useSessionActions;

export const useSession = create<useSessionProps>(set => ({
  currPage: 'loading',
  flags: INITIAL_SESSION_FLAGS,
  trackers: INITIAL_SESSION_TRACKERS,
  setCurrPage: page => {
    set(state =>
      state.currPage === page ? state : {...state, currPage: page},
    );
  },
  activateFlag: key => {
    set(state => ({flags: {...state.flags, [key]: true}}));
  },
  addTracker: (key, value) => {
    set(state =>
      state.trackers[key].includes(value)
        ? state
        : {
            trackers: {
              ...state.trackers,
              [key]: [...state.trackers[key], value],
            },
          },
    );
  },
}));
