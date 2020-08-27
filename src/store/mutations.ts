import { MutationTree } from "vuex";
import { State } from "./state";
import { TabInfo } from "@/types";

export enum MutationTypes {
  SET_SELECTED_TAB = "SET_SELECTED_TAB",
  SET_PREVIOUS_TAB = "SET_PREVIOUS_TAB",
  SET_TABS = "SET_TABS",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_SELECTED_TAB](state: S, tabInfo: TabInfo): void;
  [MutationTypes.SET_PREVIOUS_TAB](state: S, tabInfo: TabInfo): void;
  [MutationTypes.SET_TABS](state: S, tabs: TabInfo[]): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_SELECTED_TAB](state, tabInfo: TabInfo) {
    state.selectedTab = tabInfo;
  },
  [MutationTypes.SET_PREVIOUS_TAB](state, tabInfo: TabInfo) {
    state.previousTab = tabInfo;
  },
  [MutationTypes.SET_TABS](state, tabs: TabInfo[]) {
    state.tabs = tabs;
  },
};
