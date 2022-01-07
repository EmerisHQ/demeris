import { computed, watch } from 'vue';
import { useStore } from 'vuex';

import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

type Props = {
  updateOnChange?: boolean;
};
export default function useTheme(props: Props = {}) {
  const store = useStore();

  const theme = computed({
    get() {
      return store.getters['demeris/theme'] || 'system';
    },
    set(value: string) {
      store.dispatch(GlobalDemerisActionTypes.SET_SESSION_DATA, { data: { theme: value } });
    },
  });

  const updateDocument = (add: string, remove: string) => {
    if (!props.updateOnChange) {
      return;
    }

    document.documentElement.classList.add(add);
    document.documentElement.classList.remove(remove);
  };

  watch(theme, updateDocument, { immediate: true, flush: 'post' });

  return theme;
}
