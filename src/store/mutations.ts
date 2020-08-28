import { MutationTree } from "vuex";
import { State } from "./state";
import { Tab } from "@/types";

export enum MutationTypes {
  SET_SELECTED_TAB = "SET_SELECTED_TAB",
  SET_PREVIOUS_TAB = "SET_PREVIOUS_TAB",
  SET_TABS = "SET_TABS",
  SET_PLAYING_TAB = "SET_PLAYING_TAB",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_SELECTED_TAB](state: S, tab: Tab | null): void;
  [MutationTypes.SET_PREVIOUS_TAB](state: S, tab: Tab): void;
  [MutationTypes.SET_TABS](state: S, tabs: Tab[]): void;
  [MutationTypes.SET_PLAYING_TAB](state: S, tab: Tab | null): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_SELECTED_TAB](state, tab: Tab | null) {
    state.selectedTab = tab;
  },
  [MutationTypes.SET_PREVIOUS_TAB](state, tab: Tab) {
    state.previousTab = tab;
  },
  [MutationTypes.SET_TABS](state, tabs: Tab[]) {
    state.tabs = tabs;
  },
  [MutationTypes.SET_PLAYING_TAB](state, tab: Tab | null) {
    state.playingTab = tab;
  },
};
