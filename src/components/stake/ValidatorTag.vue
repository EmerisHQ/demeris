<template>
  <div v-if="isValidatorOffline(validator) || validator.jailed" class="flex items-center gap-2 ml-2">
    <div v-if="validator.jailed" class="px-3 py-0.5 rounded-xl text-text -text-1 tag__jailed">Jailed</div>
    <div v-else-if="isValidatorOffline(validator)" class="px-3 py-0.5 rounded-xl -text-1 tag__offline">Offline</div>
  </div>
</template>

<script lang="ts" setup>
import { Validator } from '@emeris/types/lib/EmerisAPI';
import { toRefs } from 'vue';

import { isValidatorOffline } from '@/utils/basic';

interface Props {
  validator?: Validator;
}
const props = defineProps<Props>();
const { validator } = toRefs(props);
</script>

<style lang="scss">
.tag {
  &__jailed {
    background: rgba(252, 140, 11, 0.56);
  }
  &__offline {
    background: rgba(254, 71, 95, 0.4);
  }
}
</style>
