<template>
  <section
    class="denom-select flex flex-col items-center rounded-2xl shadow-panel bg-surface w-96"
    :class="{
      'p-8': size === 'md',
    }"
  >
    <Button
      class="self-end absolute"
      variant="link"
      :full-width="false"
      :name="$t('generic_cta.close')"
      :click-function="close"
    />
    <ValidatorBadge :validator="validator" size="xl" />
    <h2 class="text-2 font-medium mt-6">{{ validator.moniker }}</h2>
    <span
      v-if="validator.jailed"
      v-tippy
      content="Validator jailed. Staking temporarily unavailable."
      class="mt-3 py-1 px-3 rounded-3xl border border-negative-text text-negative-text -text-1"
      >Unavailable</span
    >
    <p class="text-muted mt-4 w-full text-left break-words">{{ validator.details }}</p>
    <div v-if="validator?.website && validator.website !== ''" class="mt-4 flex items-center w-full">
      <LinkIcon class="mr-2.5 w-3 h-3" />
      <a :href="getProperUrl(validator.website)" class="-text-1 text-link" rel="noopener noreferral" target="_blank"
        >{{ getCleanURL(validator.website) }} ↗️</a
      >
    </div>
    <List class="w-full mt-8">
      <ListItem size="sm" direction="col">
        <ListItem inset size="xs" :label="$t('components.validatorCard.commissionLabel')">
          {{ commission }}
        </ListItem>
        <ListItem inset size="xs" :label="$t('components.validatorCard.maxCommissionLabel')">
          {{ maxCommission }}
        </ListItem>
        <ListItem inset size="xs" :label="$t('components.validatorCard.maxChangeRateLabel')">
          {{ maxChange }}
        </ListItem>
      </ListItem>
      <Button :rounded="false" :disabled="disabled" @click="clicked">Stake</Button>
    </List>
  </section>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';

import LinkIcon from '@/components/common/Icons/LinkIcon.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import Button from '@/components/ui/Button.vue';
import List from '@/components/ui/List/List.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import { getCleanURL, getProperUrl } from '@/utils/basic';

interface Props {
  validator: any;
  disabled?: boolean;
  size: string;
}

const props = withDefaults(defineProps<Props>(), {
  validator: () => {
    return {};
  },
  disabled: false,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'clicked'): void;
}>();

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
</script>
