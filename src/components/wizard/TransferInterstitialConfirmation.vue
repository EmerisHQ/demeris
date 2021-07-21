<template>
  <div class="transfer-interstitial" :class="`transfer-interstitial--${currentAction}`">
    <div class="transfer-interstitial__header">
      <h2 class="transfer-interstitial__title">{{ title }}</h2>

      <img src="@/assets/images/transfer-interstitial.png" name="Transfer" class="transfer-interstitial__img" />
    </div>

    <p class="transfer-interstitial__description">
      {{ description }}
    </p>

    <div class="transfer-interstitial__controls">
      <a v-if="action !== 'addliquidity'" href="#" target="_blank" class="transfer-interstitial__link">
        {{ $t('generic_cta.learnMore') }} <Icon name="ArrowUpIcon" :icon-size="1.5" class="external-icon" />
      </a>

      <Button :name="$t('generic_cta.continue')" class="transfer-interstitial__button" @click="emitContinue" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { IBCForwardsData, Step, TransferData } from '@/types/actions';
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler';

export default defineComponent({
  components: {
    Button,
    Icon,
  },
  props: {
    action: {
      type: String as PropType<'swap' | 'addliquidity' | 'move' | 'transfer'>,
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
    const currentAction = computed(() => {
      if (props.action === 'move') {
        return 'transfer';
      }
      return props.action;
    });

    const title = computed(() => {
      let result = '';

      switch (currentAction.value) {
        case 'transfer':
          const data = props.step.transactions[0].data as IBCForwardsData;
          const chainFrom = store.getters['demeris/getDisplayChain']({ name: data.from_chain });
          const chainTo = store.getters['demeris/getDisplayChain']({ name: data.to_chain });
          result = t('components.transferToHub.transfer', { from: chainFrom, to: chainTo });
          break;
        case 'addliquidity':
          result = t('components.transferToHub.addLiquidity');
          break;
        case 'swap':
          result = t('components.transferToHub.swap');
          break;
      }

      return result;
    });

    const description = computed(() => {
      let description = '';

      if (!denoms.value.length) {
        return description;
      }

      switch (currentAction.value) {
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
        case 'transfer':
          description = t('components.transferToHub.transferDescription');
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
      currentAction,
      title,
      description,
      emitContinue,
    };
  },
});
</script>

<style lang="scss" scoped>
.transfer-interstitial {
  display: flex;
  flex-direction: column;
  align-items: center;

  &--swap &__header {
    flex-direction: column-reverse;
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

  &__img {
    margin-bottom: -2rem;
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

  &__controls {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 2.4rem;
  }

  &__button {
    width: 100%;
    margin: 2.4rem 0;
  }

  .external-icon {
    margin-left: 0.4rem;
    transform: rotate(45deg);
  }
}
</style>
