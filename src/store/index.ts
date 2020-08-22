import Vue from "vue";
import Vuex, { GetterTree, MutationTree } from "vuex";
import VuexWebExtensions from "vuex-webextensions";

Vue.use(Vuex);

interface TabInfo {
  id: number;
  windowId: number;
}
interface State {
  listedTabs: TabInfo[];
  counter: number;
  test: any;
}
const state: State = {
  listedTabs: [] as TabInfo[],
  counter: 0,
  test: "",
};

const getters: GetterTree<State, any> = {
  getTabInfo: state => {
    return state.listedTabs[state.counter % state.listedTabs.length];
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
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions: {},
  modules: {},
  plugins: [VuexWebExtensions()],
});
