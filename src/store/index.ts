import * as getters from "./getters";
import { mutations } from "./mutations";
import { state, State } from "./state";
import createStore from "./simplestore";

// eslint-disable-next-line import/prefer-default-export
export const store = createStore<State>({
  state,
  getters,
  mutations,
});
