import { MutationTree } from "vuex";
import { State } from "./state";
import { TabInfo } from "@/types";

export enum MutationTypes {
  SET_SELECTED_TAB = "SET_SELECTED_TAB",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_SELECTED_TAB](state: S, tabInfo: TabInfo): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_SELECTED_TAB](state, tabInfo: TabInfo) {
    state.selectedTab = tabInfo;
  },
};
