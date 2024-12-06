import {NestedScreenPage} from '@/navigation/types';
import {create} from 'zustand';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type CurrPage = NestedScreenPage | 'loading';

export interface SessionFlags extends Record<string, boolean> {}

export interface SessionTrackers extends Record<string, string[]> {}

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_SESSION_FLAGS: SessionFlags = {} as const;

const INITIAL_SESSION_TRACKERS: SessionTrackers = {} as const;

/******************************************************************************
 *                                   STORE                                    *
 ******************************************************************************/

type useSessionState = {
  currPage: CurrPage;
  flags: SessionFlags;
  trackers: SessionTrackers;
};

type useSessionActions = {
  setCurrPage: (page: CurrPage) => void;
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
