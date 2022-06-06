<template>
  <div class="redeem">
    <header class="redeem__header">
      <button class="redeem__header__button" :disabled="state.step === 'transfer'" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1" />
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
        <Icon name="CloseIcon" :icon-size="1" />
      </button>
    </header>

    <main class="redeem__wrapper">
      <div v-if="state.showInstruction" class="redeem__instruction">
        <h2 class="redeem__title text-2">{{ $t('pages.redeem.title') }}</h2>

        <div class="redeem__content">
          <div class="redeem__instruction__placeholder" />

          <p class="redeem__instruction__description">
            {{ $t('pages.redeem.instructions') }}
          </p>

          <a
            class="redeem__instruction__link"
            href="https://docs.starport.network/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('pages.redeem.learnMore') }} ↗️
          </a>

          <div class="redeem__controls">
            <Button :name="$t('generic_cta.continue')" @click="closeInstruction" />
          </div>
        </div>
      </div>

      <template v-else-if="state.step === 'assets'">
        <h2 class="redeem__title text-2">{{ $t('pages.redeem.select') }}</h2>

        <div class="redeem__content assets-content">
          <ul class="redeem__list">
            <li v-for="asset in augmentedBalances" :key="asset.ibc.hash" class="redeem__list__item">
              <div class="redeem__list__item__icon" />

              <div class="redeem__list__item__asset">
                <p class="redeem__list__item__asset__amount font-bold">
                  <AmountDisplay :amount="parseCoins(asset.amount)[0]" :chain="asset.on_chain" />
                </p>
                <span class="redeem__list__item__asset__route -text-1">
                  <template v-for="(hop, index) in asset.hops" :key="asset.ibc.hash + '_' + index">
                    <template v-if="index != 0"> -> </template>
                    <ChainName :name="hop" />
                  </template>
                </span>
              </div>

              <div class="redeem__list__item__fees">
                <FeeLevelSelector v-if="asset.steps" :steps="asset.steps" />
                <!--<p class="redeem__list__item__fees__label -text-1">Fees</p>
                <span class="redeem__list__item__fees__amount">0.08 ATOM</span>//-->
              </div>

              <div class="redeem__list__item__controls">
                <Button :name="$t('pages.redeem.cta')" @click="selectAsset(asset)" />
              </div>
            </li>
          </ul>
        </div>
      </template>

      <template v-else>
        <div class="redeem__content"></div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable max-lines */
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { event, pageview } from '@/utils/analytics';
import { parseCoins } from '@/utils/basic';

const router = useRouter();
const { redeemableBalances } = useAccount();
const steps = ['assets', 'review', 'transfer', 'redeemed'];
const typedstore = useStore() as RootStoreTyped;

pageview({ page_title: 'Redeem', page_path: '/redeem' });
typedstore.dispatch(GlobalActionTypes.USER.SET_SESSION_DATA, { data: { hasSeenRedeem: true } });
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
          typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({
            chain_name: balance.on_chain,
            hash: balance.ibc.hash,
          }) ??
          (await typedstore.dispatch(
            GlobalActionTypes.API.GET_VERIFY_TRACE,
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
              ...parseCoins(balance.amount)[0],
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
  event('review_tx', { event_label: 'Reviewing redeem tx', event_category: 'transactions' });
  goToStep('review');
};

const closeInstruction = () => {
  state.showInstruction = false;
};
</script>

<style lang="scss" scoped>
.redeem {
  position: relative;
  padding-bottom: 1.25rem;

  &__controls {
    width: 100%;
    margin-top: 2rem;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2.5rem;
    background: var(--bg);

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      padding: 0.375rem;

      &:disabled {
        cursor: not-allowed;
        color: var(--inactive);
      }
    }

    .close-button {
      margin-left: auto;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
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
        margin-left: 3rem;
      }
      &--active {
        color: var(--text);
      }
    }
  }

  &__content {
    width: 100%;
    max-width: 22.5rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.assets-content {
      max-width: 40rem;
    }
  }

  &__instruction {
    margin-top: -2rem;
    text-align: center;

    &__placeholder {
      background: var(--fg);
      width: 22.5rem;
      height: 9.375rem;
      margin-top: 2rem;
      border-radius: 0.625rem;
    }

    &__link {
      margin-top: 2rem;
      font-weight: 600;
    }

    &__description {
      color: var(--muted);
      line-height: 1.8;
      margin-top: 2rem;
    }
  }

  &__list {
    margin-top: 3.75rem;
    width: 100%;

    &__item {
      display: flex;
      align-items: center;

      &__icon {
        width: 2rem;
        height: 2rem;
        border-radius: 1.5rem;
        background: rgba(0, 0, 0, 0.1);
        margin-right: 0.75rem;
        shrink: 0;
      }

      &__asset {
        flex: 1 1 0%;
        margin-right: 1.5rem;

        &__route {
          margin-top: 0.125rem;
          color: var(--muted);
        }
      }

      &__fees {
        margin-right: 1.5rem;

        &__label {
          margin-bottom: 0.125rem;
          color: var(--muted);
          text-align: right;
        }
      }

      & + & {
        margin-top: 3rem;
      }
    }
  }
}
</style>
