import { computed, watch } from 'vue';

import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

type Props = {
  updateOnChange?: boolean;
};
export default function useTheme(props: Props = {}) {
  const store = useStore();

  const theme = computed({
    get() {
      return store.getters[GlobalDemerisGetterTypes.USER.theme] || 'system';
    },
    set(value: string) {
      store.dispatch(GlobalDemerisActionTypes.USER.SET_SESSION_DATA, { data: { theme: value } });
    },
  });

  const updateDocument = (add: string, remove: string) => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!props.updateOnChange) {
      return;
    }

    if (add === 'system') {
      add = isDark ? 'dark' : 'light';
      remove = isDark ? 'light' : 'dark';
    } else if (remove === 'system') {
      remove = add === 'dark' ? 'light' : 'dark';
    }

    document.documentElement.classList.add(add);
    document.documentElement.classList.remove(remove);
  };

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => updateDocument('system', ''));
  watch(theme, updateDocument, { immediate: true, flush: 'post' });

  return theme;
}
