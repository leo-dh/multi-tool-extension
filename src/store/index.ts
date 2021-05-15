import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import VuexWebExtensions from "vuex-webextensions";
import * as getters from "./getters";
import { mutations } from "./mutations";
// import { mutations } from "./mutations";
import { state, State } from "./state";

export default createStore<State>({
  state,
  getters,
  mutations,
  actions: {},
  modules: {},
  plugins: [VuexWebExtensions()],
});

// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}
