export interface SessionFlags {
  downloadsOpenedDrawer: boolean;
  homeBannerDismissed: boolean;
}

export const INITIAL_SESSION_FLAGS: SessionFlags = {
  downloadsOpenedDrawer: false,
  homeBannerDismissed: false,
};

export interface SessionTrackers {
  appsBannerDismissed: string[];
}
export const INITIAL_SESSION_TRACKERS: SessionTrackers = {
  appsBannerDismissed: [],
};
