<template>
  <tippy>
    <Icon name="InformationIcon" class="text-warning" :icon-size="iconSize" />
    <template #content>
      <i18n-t scope="global" :keypath="i18nPath">
        <template #chain>
          <ChainName :name="chain" />
        </template>

        <template #chains>
          <span v-for="(value, index) of chains" :key="value">
            <ChainName :name="value" />{{ index !== chains.length - 1 ? ',&nbsp;' : '' }}
          </span>
        </template>

        <template #denom>
          <Denom :name="denom" />
        </template>
      </i18n-t>
    </template>
  </tippy>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';

interface Props {
  iconSize?: number;
  chain?: string;
  chains?: string[];
  denom?: string;
  unavailable?: 'part' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 1.6,
  chain: undefined,
  chains: undefined,
  denom: undefined,
  unavailable: undefined,
});

const i18nPath = computed(() => {
  if (props.unavailable === 'full') {
    if (props.chains?.length > 1) {
      return `components.chainDown.fullUnavailableMultiple`;
    }
    return `components.chainDown.fullUnavailable`;
  }

  return `components.chainDown.partUnavailable`;
});
</script>
