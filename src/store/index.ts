import Vue from "vue";
import Vuex, { GetterTree, MutationTree } from "vuex";
import VuexWebExtensions from "vuex-webextensions";
import { TabInfo, PopupMode } from "../types";

Vue.use(Vuex);

interface State {
  counter: number;
  popupMode: PopupMode;
  listedTabs: TabInfo[];
  selectedTab: TabInfo | null;
}
const state: State = {
  listedTabs: [] as TabInfo[],
  counter: 0,
  selectedTab: null,
  popupMode: PopupMode.MULTIPLE_TABS,
};

const getters: GetterTree<State, any> = {
  getListedTab: state => {
    return state.listedTabs[state.counter];
  },
  getListedTabs: state => {
    return state.listedTabs;
  },
  getSelectedTab: state => {
    return state.selectedTab;
  },
  getPopupMode: state => {
    return state.popupMode;
  },
};

const mutations: MutationTree<State> = {
  addTab: (state, tabInfo: TabInfo): void => {
    const { id, windowId } = tabInfo;
    for (const tab of state.listedTabs) {
      if (id === tab.id && windowId === tab.windowId) {
        return;
      }
    }
    state.listedTabs.push(tabInfo);
  },
  clearListedTabs: (state): void => {
    state.listedTabs = [] as TabInfo[];
  },
  setSelectedTab: (state, tabInfo: TabInfo): void => {
    state.selectedTab = tabInfo;
  },
  setPopupMode: (state, popupMode: PopupMode): void => {
    state.popupMode = popupMode;
  },
  incrementCounter: (state): void => {
    state.counter++;
    state.counter %= state.listedTabs.length;
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions: {},
  modules: {},
  plugins: [VuexWebExtensions()],
});
