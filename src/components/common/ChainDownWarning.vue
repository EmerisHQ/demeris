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

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

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
    chains: {
      type: Array as PropType<string[]>,
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

  setup(props) {
    const i18nPath = computed(() => {
      if (props.unavailable === 'full') {
        if (props.chains?.length > 1) {
          return `components.chainDown.fullUnavailableMultiple`;
        }
        return `components.chainDown.fullUnavailable`;
      }

      return `components.chainDown.partUnavailable`;
    });

    return { i18nPath };
  },
});
</script>
