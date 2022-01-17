let store = undefined;
export function setStore(setStore) {
  store = setStore;
}
export function useStore() {
  return store;
}
