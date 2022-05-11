<template>
  <Button
    :status="state.matches('ready.submitting') ? 'loading' : 'active'"
    :disabled="!state.can('SUBMIT')"
    @click="send('SUBMIT')"
  >
    {{ buttonName }}
  </Button>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from '@/components/ui/Button.vue';

interface SwapButtonProps {
  send: any;
  state: any;
}

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<SwapButtonProps>();
const { send, state } = toRefs(props);

const buttonName = computed(() => {
  if (state.value.matches('ready.invalid.belowMin')) {
    return t('components.swap.inputBelowMin');
  } else if (state.value.matches('ready.invalid.overMax')) {
    return t('components.swap.inputOverMax');
  } else {
    return 'Swap';
  }
});
</script>
