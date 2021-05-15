import { State } from "./state";

export const getSelectedTab = (state: State) => {
  return state.selectedTab;
};

export const getPreviousTab = (state: State) => {
  return state.previousTab;
};

export const getTabs = (state: State) => {
  return state.tabs;
};

export const getPlayingTab = (state: State) => {
  return state.playingTab;
};

export const getVideoPlaying = (state: State) => {
  return state.videoPlaying;
};
