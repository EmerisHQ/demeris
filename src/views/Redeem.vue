<template>
  <div class="redeem">
    <header class="redeem__header">
      <button class="redeem__header__button" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.6" />
      </button>

      <nav class="redeem__steps">
        <span
          v-for="label of steps"
          :key="label"
          class="redeem__steps__item"
          :class="{ 'redeem__steps__item--active': state.step === label }"
        >
          {{ label }}
        </span>
      </nav>

      <button class="redeem__header__button close-button" @click="onClose">
        <Icon name="CloseIcon" :icon-size="1.6" />
      </button>
    </header>

    <main class="redeem__wrapper">
      <template v-if="state.step === 'assets'">
        <h2 class="redeem__title s-2">Select an asset to redeem</h2>

        <div class="redeem__content assets-content">
          <ul class="redeem__list">
            <li v-for="asset of assets" :key="asset.address" class="redeem__list__item">
              <div class="redeem__list__item__icon" />

              <div class="redeem__list__item__asset">
                <p class="redeem__list__item__asset__amount w-bold">
                  {{ asset.amount }} {{ $filters.getCoinName(asset.base_denom) }}
                </p>
                <span class="redeem__list__item__asset__route s-minus">{{ asset.route }}</span>
              </div>

              <div class="redeem__list__item__fees">
                <p class="redeem__list__item__fees__label s-minus">Fees</p>
                <span class="redeem__list__item__fees__amount">0.08 ATOM</span>
              </div>

              <div class="redeem__list__item__controls">
                <Button name="Redeem" @click="selectAsset" />
              </div>
            </li>
          </ul>
        </div>
      </template>

      <template v-if="state.step === 'review'">
        <h2 class="redeem__title s-2">Review your redeem details</h2>

        <div class="redeem__content">
          <div class="redeem__controls">
            <Button name="Confirm and continue" @click="goToStep('transfer')" />
          </div>
        </div>
      </template>

      <template v-if="state.step === 'transfer'">
        <h2 class="redeem__title s-2">Transfer</h2>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'Redeem',

  components: { Button, Icon },

  setup() {
    const router = useRouter();

    const steps = ['assets', 'review', 'transfer', 'redeemed'];

    const state = reactive({
      step: 'assets',
      selectedAsset: undefined,
      showConfirmation: false,
    });

    const assets = computed(() => {
      return [
        {
          address: 'cosmos14pmvh0d4fucylhawvcd0hxkrky99hwcnm0usr5',
          amount: 230,
          base_denom: 'uatom',
          route: 'Terra → (3 chains) → Cosmos Hub',
        },
        {
          address: 'cosmos16sh2ufmrds5zqmuxhzwhdssgau9h0p68dtgfm8',
          amount: 400,
          base_denom: 'ukava',
          route: 'Kava → Terra → Cosmos Hub',
        },
      ];
    });

    const onClose = () => {
      router.push('/pools');
    };

    const goBack = () => {
      const currentStepIndex = steps.findIndex((item) => item === state.step);

      if (currentStepIndex > 0) {
        state.step = steps[currentStepIndex - 1];
        return;
      }

      router.back();
    };

    const goToStep = (step: string) => {
      state.step = step;
    };

    const selectAsset = (asset: Record<string, unknown>) => {
      state.selectedAsset = asset;
      goToStep('review');
    };

    return {
      assets,
      steps,
      state,
      selectAsset,
      onClose,
      goBack,
      goToStep,
    };
  },
});
</script>

<style lang="scss" scoped>
.redeem {
  position: relative;
  padding-bottom: 2rem;

  &__controls {
    width: 100%;
    margin-top: 3.2rem;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 4rem;
    background: var(--bg);

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.8rem;
      padding: 0.6rem;
    }

    .close-button {
      margin-left: auto;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3.1rem;
  }

  &__steps {
    flex: 1 1 0%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__item {
      text-transform: capitalize;
      color: var(--inactive);
      font-weight: 600;
      cursor: default;

      & + & {
        margin-left: 4.8rem;
      }
      &--active {
        color: var(--text);
      }
    }
  }

  &__content {
    width: 100%;
    max-width: 36rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.assets-content {
      max-width: 64rem;
    }
  }

  &__list {
    margin-top: 6rem;
    width: 100%;

    &__item {
      display: flex;
      align-items: center;

      &__icon {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 2.6rem;
        background: rgba(0, 0, 0, 0.1);
        margin-right: 1.2rem;
        flex-shrink: 0;
      }

      &__asset {
        flex: 1 1 0%;
        margin-right: 2.4rem;

        &__route {
          margin-top: 0.2rem;
          color: var(--muted);
        }
      }

      &__fees {
        margin-right: 2.4rem;

        &__label {
          margin-bottom: 0.2rem;
          color: var(--muted);
          text-align: right;
        }
      }

      & + & {
        margin-top: 4.8rem;
      }
    }
  }
}
</style>
