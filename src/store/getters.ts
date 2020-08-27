import { GetterTree } from "vuex";
import { State } from "./state";

export const getters: GetterTree<State, any> = {
  getSelectedTab: state => {
    return state.selectedTab;
  },
  getTabs: state => {
    return state.tabs;
  },
};
