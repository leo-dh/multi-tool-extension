import { MutationTree } from "vuex";
import { State } from "./state";
import { TabInfo, PopupMode } from "@/types";

export enum MutationTypes {
  ADD_TAB = "ADD_TAB",
  CLEAR_LISTED_TABS = "CLEAR_LISTED_TABS",
  SET_SELECTED_TAB = "SET_SELECTED_TAB",
  SET_POPUP_MODE = "SET_POPUP_MODE",
  INCREMENT_COUNTER = "INCREMENT_COUNTER",
}

export type Mutations<S = State> = {
  [MutationTypes.ADD_TAB](state: S, tabInfo: TabInfo): void;
  [MutationTypes.CLEAR_LISTED_TABS](state: S): void;
  [MutationTypes.SET_SELECTED_TAB](state: S, tabInfo: TabInfo): void;
  [MutationTypes.SET_POPUP_MODE](state: S, popupMode: PopupMode): void;
  [MutationTypes.INCREMENT_COUNTER](state: S): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_TAB](state, tabInfo: TabInfo) {
    const { id, windowId } = tabInfo;
    for (const tab of state.listedTabs) {
      if (id === tab.id && windowId === tab.windowId) {
        return;
      }
    }
    state.listedTabs.push(tabInfo);
  },
  [MutationTypes.CLEAR_LISTED_TABS](state) {
    state.listedTabs = [] as TabInfo[];
  },
  [MutationTypes.SET_SELECTED_TAB](state, tabInfo: TabInfo) {
    state.selectedTab = tabInfo;
  },
  [MutationTypes.SET_POPUP_MODE](state, popupMode: PopupMode) {
    state.popupMode = popupMode;
  },
  [MutationTypes.INCREMENT_COUNTER](state) {
    state.counter++;
    state.counter %= state.listedTabs.length;
  },
};
