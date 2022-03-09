<template>
  <template v-if="imgUrl">
    <img :src="imgUrl" :alt="validator.moniker" class="w-full h-full block rounded-full relative z-10" />
  </template>
  <template v-else>
    <div class="w-full h-full rounded-full relative z-10 flex items-center justify-center">
      <p class="font-medium">{{ monikerFirst }}</p>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';

import { getFirstAlphabet } from '@/utils/basic';
interface Validator {
  chain_name?: string;
  operator_address?: string;
  consensus_pubkey_type?: string;
  consensus_pubkey_value?: string;
  jailed?: boolean;
  status?: number;
  tokens?: string;
  delegator_shares?: string;
  moniker: string;
  identity?: string;
  website?: string;
  details?: string;
  unbonding_height?: number;
  unbonding_time?: string;
  commission_rate?: string;
  max_rate?: string;
  max_change_rate?: string;
  update_time?: string;
  min_self_delegation?: number;
  avatar?: string;
}
interface Props {
  validator: Validator;
}
const props = withDefaults(defineProps<Props>(), {
  validator: () => ({ moniker: '' }),
});
const { validator } = toRefs(props);
const imgUrl = ref<string>(validator.value?.avatar);
const monikerFirst = ref<string>(getFirstAlphabet(validator.value?.moniker));
</script>
