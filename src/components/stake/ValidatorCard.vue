<template>
  <div
    class="denom-select flex flex-col items-center rounded-2xl shadow-panel bg-surface w-96"
    :class="{
      'py-6 px-8': size === 'md',
    }"
  >
    <Button v-tippy class="self-end" rounded variant="secondary" :content="$t('generic_cta.close')" @click="close">
      <Icon name="CloseIcon" :icon-size="1.5" />
    </Button>
    <ValidatorBadge :validator="validator" :size="'xl'" />
    <div class="text-1 font-medium py-6">{{ validator.moniker }}</div>
    <div class="text-muted py-6 w-full text-left">{{ validator.details }}</div>
    <List class="w-full">
      <ListItem size="sm" direction="col">
        <ListItem v-tippy size="xs" :label="'Commission'" :content="$t('components.validatorCard.commissionTooltip')">
          {{ commission }}
        </ListItem>
        <ListItem
          v-tippy
          inset
          size="xs"
          :label="'Max commission'"
          :content="$t('components.validatorCard.maxCommissionTooltip')"
          class="text-muted -text-1"
          :label-font-weight="'normal'"
        >
          {{ maxCommission }}
        </ListItem>
        <ListItem
          v-tippy
          inset
          size="xs"
          :label="'Max change rate'"
          :content="$t('components.validatorCard.maxChangeRateTooltip')"
          class="text-muted -text-1"
          :label-font-weight="'normal'"
        >
          {{ maxChange }}
        </ListItem>
      </ListItem>
      <Button :rounded="false" :disabled="disabled" @click="clicked">Stake</Button>
    </List>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import List from '@/components/ui/List/List.vue';
import ListItem from '@/components/ui/List/ListItem.vue';

export default defineComponent({
  name: 'ValidatorCard',
  components: { Button, Icon, ValidatorBadge, List, ListItem },
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    size: { type: String, required: false, default: 'md' },
  },
  emits: ['close', 'clicked'],
  setup(props, { emit }) {
    const propsRef = toRefs(props);
    const toPerc = (val) => {
      return Math.trunc(parseFloat(val) * 10000) / 100 + '%';
    };
    const commission = computed(() => {
      return toPerc(propsRef.validator.value.commission_rate);
    });
    const maxCommission = computed(() => {
      return toPerc(propsRef.validator.value.max_rate);
    });
    const maxChange = computed(() => {
      return toPerc(propsRef.validator.value.max_change_rate);
    });
    const close = () => {
      emit('close');
    };
    const clicked = () => {
      emit('clicked');
    };
    return {
      close,
      clicked,
      commission,
      maxCommission,
      maxChange,
    };
  },
});
</script>

<style lang="scss" scoped></style>
