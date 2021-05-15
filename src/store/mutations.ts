import { Tab } from "@/types";
import { State } from "./state";

export enum MutationTypes {
  SET_SELECTED_TAB = "SET_SELECTED_TAB",
  SET_PREVIOUS_TAB = "SET_PREVIOUS_TAB",
  SET_TABS = "SET_TABS",
  SET_PLAYING_TAB = "SET_PLAYING_TAB",
  SET_VIDEO_PLAYING = "SET_VIDEO_PLAYING",
}

export const mutations = {
  [MutationTypes.SET_SELECTED_TAB](state: State, tab: Tab | null) {
    state.selectedTab = tab;
  },
  [MutationTypes.SET_PREVIOUS_TAB](state: State, tab: Tab) {
    state.previousTab = tab;
  },
  [MutationTypes.SET_TABS](state: State, tabs: Tab[]) {
    state.tabs = tabs;
  },
  [MutationTypes.SET_PLAYING_TAB](state: State, tab: Tab | null) {
    state.playingTab = tab;
  },
  [MutationTypes.SET_VIDEO_PLAYING](state: State, status: boolean) {
    state.videoPlaying = status;
  },
};
