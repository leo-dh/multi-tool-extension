import Vue from "vue";
import Vuex from "vuex";
import VuexWebExtensions from "vuex-webextensions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state, State } from "./state";

Vue.use(Vuex);

export default new Vuex.Store<State>({
  state,
  getters,
  mutations,
  actions: {},
  modules: {},
  plugins: [VuexWebExtensions()],
});
