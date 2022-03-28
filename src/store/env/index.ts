import env from './env';

export default function init(store) {
  if (!store.hasModule(['common'])) {
    store.registerModule(['common'], { namespaced: true });
  }
  store.registerModule(['common', 'env'], env);
}
