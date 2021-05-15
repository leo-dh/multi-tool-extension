export default function createStore<S, M extends Record<string | number, Function> = {}>({
  state,
  getters,
  mutations,
}: {
  state: S;
  getters?: Record<string, (state: S) => any>;
  mutations?: M;
}) {
  function bindState<T extends Record<string, Function>>(obj: T) {
    return Object.entries(obj).reduce((result, [key, value]) => {
      Object.assign(result, { [key]: value.bind(null, state) });
      return result;
    }, {} as Record<keyof T, Function>);
  }

  const store = {
    state,
    getters: getters ? bindState(getters) : {},
    mutations: mutations ? bindState(mutations) : ({} as Record<string, Function>),
    commit(type: string, ...args: any[]) {
      this.mutations[type](...args);
    },
  };

  store.commit = store.commit.bind(store);

  return store;
}
