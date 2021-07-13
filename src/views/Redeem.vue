<template>
  <div class="redeem">
    <header class="redeem__header">
      <button class="redeem__header__button" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.6" />
      </button>

      <nav v-if="!state.showInstruction" class="redeem__steps">
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
      <div v-if="state.showInstruction" class="redeem__instruction">
        <h2 class="redeem__title s-2">Redeeming assets</h2>

        <div class="redeem__content">
          <div class="redeem__instruction__placeholder" />

          <p class="redeem__instruction__description">
            You hold assets with a transfer history that is not supported by Demeris. If you wish to use these assets
            with Demeris, you must first redeem them.
          </p>

          <a
            class="redeem__instruction__link"
            href="https://docs.starport.network/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about redeeming ↗️
          </a>

          <div class="redeem__controls">
            <Button name="Continue" @click="closeInstruction" />
          </div>
        </div>
      </div>

      <template v-else-if="state.step === 'assets'">
        <h2 class="redeem__title s-2">Select an asset to redeem</h2>

        <div class="redeem__content assets-content">
          <ul class="redeem__list">
            <li v-for="asset in augmentedBalances" :key="asset.ibc.hash" class="redeem__list__item">
              <div class="redeem__list__item__icon" />

              <div class="redeem__list__item__asset">
                <p class="redeem__list__item__asset__amount w-bold">
                  <AmountDisplay :amount="parseCoins(asset.amount)[0]" />
                </p>
                <span class="redeem__list__item__asset__route s-minus">
                  <template v-for="(hop, index) in asset.hops" :key="asset.ibc.hash + '_' + index">
                    <template v-if="index != 0"> -> </template>
                    <ChainName :name="hop" />
                  </template>
                </span>
              </div>

              <div class="redeem__list__item__fees">
                <FeeLevelSelector v-if="asset.steps" v-model:gasPriceLevel="gasPrice" :steps="asset.steps" />
                <!--<p class="redeem__list__item__fees__label s-minus">Fees</p>
                <span class="redeem__list__item__fees__amount">0.08 ATOM</span>//-->
              </div>

              <div class="redeem__list__item__controls">
                <Button name="Redeem" @click="selectAsset(asset)" />
              </div>
            </li>
          </ul>
        </div>
      </template>

      <template v-else-if="state.step === 'review'">
        <div class="redeem__content">
          <TxStepsModal :data="state.selectedAsset.steps" :gas-price-level="gasPrice" @complete="goToStep(complete)" />
        </div>
      </template>

      <template v-else-if="state.step === 'transfer'">
        <h2 class="redeem__title s-2">Transfer</h2>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { GasPriceLevel } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'Redeem',

  components: { Button, Icon, AmountDisplay, ChainName, FeeLevelSelector, TxStepsModal },

  setup() {
    const router = useRouter();
    const { redeemableBalances } = useAccount();
    const steps = ['assets', 'review', 'transfer', 'redeemed'];
    const store = useStore();

    store.dispatch(GlobalDemerisActionTypes.SET_SESSION_DATA, { data: { hasSeenRedeem: true } });
    const gasPrice = ref(store.getters['demeris/getPreferredGasPriceLevel']);
    const state = reactive({
      step: 'assets',
      selectedAsset: undefined,
      showInstruction: true,
    });
    const augmentedBalances = ref([]);
    watch(
      () => redeemableBalances.value,
      async (newBalances) => {
        augmentedBalances.value = await Promise.all(
          newBalances.map(async (newBalance) => {
            let balance = { ...newBalance };
            balance.hops = [];
            const verifyTrace =
              store.getters['demeris/getVerifyTrace']({
                chain_name: balance.on_chain,
                hash: balance.ibc.hash,
              }) ??
              (await store.dispatch(
                'demeris/GET_VERIFY_TRACE',
                {
                  subscribe: false,
                  params: {
                    chain_name: balance.on_chain,
                    hash: balance.ibc.hash,
                  },
                },
                { root: true },
              ));
            for (let hop of verifyTrace.trace) {
              balance.hops.unshift(hop.counterparty_name);
            }
            balance.steps = await actionHandler({
              name: 'redeem',
              params: [
                {
                  amount: parseCoins(balance.amount)[0],
                  chain_name: balance.on_chain,
                },
              ],
            });

            return balance;
          }),
        );
      },
      { immediate: true },
    );
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
    const getRoute = (hash, chain_name) => {
      const verifyTrace = store.getters['demeris/getVerifyTrace']({
        chain_name,
        hash,
      });
      const hops = [];
      for (let hop of verifyTrace.trace) {
        hops.unshift(hop.counterparty_name);
      }
      return hops;
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

    const closeInstruction = () => {
      state.showInstruction = false;
    };

    return {
      assets,
      augmentedBalances,
      steps,
      state,
      closeInstruction,
      selectAsset,
      onClose,
      goBack,
      goToStep,
      parseCoins,
      gasPrice,
      getRoute,
      GasPriceLevel,
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

  &__instruction {
    margin-top: -3rem;
    text-align: center;

    &__placeholder {
      background: var(--fg-trans);
      width: 36rem;
      height: 15rem;
      margin-top: 3.4rem;
      border-radius: 1rem;
    }

    &__link {
      margin-top: 3.2rem;
      font-weight: 600;
    }

    &__description {
      color: var(--muted);
      line-height: 1.8;
      margin-top: 3.4rem;
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
