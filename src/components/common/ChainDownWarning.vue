<template>
  <tippy>
    <Icon name="InformationIcon" class="text-warning" :icon-size="iconSize" />
    <template #content>
      <i18n-t :keypath="`components.chainDown.${unavailable === 'part' ? 'partUnavailable' : 'fullUnavailable'}`">
        <template #chain>
          <ChainName :name="chain" />
        </template>

        <template #denom>
          <Denom :name="denom" />
        </template>
      </i18n-t>
    </template>
  </tippy>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Denom from '@/components/common/Denom.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  components: {
    Icon,
    ChainName,
    Denom,
  },
  props: {
    iconSize: {
      type: Number,
      default: 1.6,
    },
    chain: {
      type: String,
      default: undefined,
    },
    denom: {
      type: String,
      default: undefined,
    },
    unavailable: {
      type: String as PropType<'part' | 'full'>,
      default: undefined,
    },
  },
});
</script>
