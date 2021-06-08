import wallet from './wallet';

export default function init(store) {
  if (!store.hasModule(['common'])) {
    store.registerModule(['common'], { namespaced: true });
  }
  store.registerModule(['common', 'wallet'], wallet);
}
