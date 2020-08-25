import { GetterTree } from "vuex";
import { State } from "./state";

export const getters: GetterTree<State, any> = {
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
