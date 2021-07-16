<template>
  <div class="transfer-to-hub" :class="`transfer-to-hub--${action}`">
    <div class="transfer-to-hub__header">
      <h2 class="transfer-to-hub__title">{{ title }}</h2>

      <img src="@/assets/images/transfer-to-hub.png" class="transfer-to-hub__img" />
    </div>

    <p class="transfer-to-hub__description">
      {{ description }}
    </p>

    <a v-if="action !== 'addliquidity'" href="#" target="_blank" class="transfer-to-hub__link">
      {{ $t('generic_cta.learnMore') }} <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
    </a>

    <Button :name="$t('generic_cta.continue')" class="transfer-to-hub__button" @click="emitContinue" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { Step, TransferData } from '@/types/actions';
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler';

export default defineComponent({
  components: {
    Button,
    Icon,
  },
  props: {
    action: {
      type: String as PropType<'swap' | 'addliquidity'>,
      default: 'swap',
    },
    step: {
      type: Object as PropType<Step>,
      required: true,
    },
  },

  emits: ['continue'],

  setup(props, { emit }) {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });
    const denoms = ref([]);

    const hasMultiple = computed(() => props.step.transactions.length > 1);

    const title = computed(() => {
      return {
        addliquidity: t('components.transferToHub.addLiquidity'),
        swap: t('components.transferToHub.swap'),
      }[props.action];
    });

    const description = computed(() => {
      let description = '';

      debugger;
      if (!denoms.value.length) {
        return description;
      }
      switch (props.action) {
        case 'addliquidity':
          if (hasMultiple.value) {
            description = t('components.transferToHub.addLiquidityDescriptionMultiple', {
              denomA: denoms.value[0],
              denomB: denoms.value[1],
            });
          } else {
            description = t('components.transferToHub.addLiquidityDescription', { denom: denoms.value[0] });
          }
          break;
        case 'swap':
          description = t('components.transferToHub.swapDescription', { denom: denoms.value[0] });
          break;
      }

      return description;
    });

    const emitContinue = () => {
      emit('continue');
    };

    watch(
      props.step,
      async () => {
        denoms.value = await Promise.all(
          props.step.transactions.map(async (transaction) => {
            const denom = await getBaseDenom((transaction.data as TransferData).amount.denom);
            const displayDenom = await getDisplayName(denom, store.getters['demeris/getDexChain']);
            return displayDenom;
          }),
        );
      },
      { immediate: true },
    );

    return {
      title,
      description,
      emitContinue,
    };
  },
});
</script>

<style lang="scss" scoped>
.transfer-to-hub {
  display: flex;
  flex-direction: column;
  align-items: center;

  &--swap &__header {
    flex-direction: column-reverse;
  }

  &--swap &__title {
    margin-top: 2.4rem;
    margin-bottom: 0;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__title {
    font-weight: 700;
    font-size: 2.8rem;
    padding: 0 2.4rem;
    text-align: center;
    line-height: 1.4;
    white-space: pre-line;
    margin-bottom: 2.4rem;
  }

  &__description {
    color: var(--muted);
    text-align: center;
    line-height: 1.6;
    padding: 0 2.4rem;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    width: 100%;
    padding: 1.6rem;
    margin-top: 2.4rem;
  }

  &__button {
    width: 100%;
    margin-top: 4rem;
  }

  .external-icon {
    transform: rotate(45deg);
  }
}
</style>
