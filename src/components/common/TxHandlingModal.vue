<template>
  <component
    :is="variant === 'step' ? 'div' : 'Modal'"
    :variant="variant === 'modal' ? 'bottom' : null"
    :show-close-button="variant === 'modal' ? false : null"
    class="text-center m-auto w-full max-w-lg"
    :body-class="
      variant === 'modal' ? [{ 'bg-brand dark:theme-inverse text-text': status === 'complete' }, 'p-6'] : null
    "
    @close="emitClose"
  >
    <div v-if="iconType" class="flex items-center justify-center my-6">
      <SpinnerIcon v-if="iconType === 'pending'" :size="3" />
      <Icon v-else-if="iconType === 'warning'" name="ExclamationIcon" :icon-size="3" class="text-warning" />
      <Icon v-else name="WarningTriangleIcon" :icon-size="3" class="text-negative" />
    </div>
    <div
      v-else-if="status === 'complete' && tx.name === 'swap'"
      class="swapped-image bg-center bg-no-repeat bg-cover -mt-6 -mx-6"
    />
    <div class="text-muted">
      <template v-if="status == 'failed' || status == 'unknown'">
        <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
          <ChainName :name="getDenom(tx.data.from_chain)" /> &rarr; <ChainName :name="tx.data.to_chain" />
        </template>
        <template v-if="tx.name == 'transfer'">
          <Denom :name="getDenom(tx.data.amount.denom)" /> (<ChainName :name="tx.data.chain_name" />)
        </template>
        <template v-if="tx.name == 'swap'">
          <Denom :name="getDenom(tx.data.from.denom)" /> &rarr; <Denom :name="getDenom(tx.data.to.denom)" />
        </template>
        <template v-if="tx.name == 'addliquidity'">
          <Denom :name="getDenom(tx.data.coinA.denom)" /> &middot; <Denom :name="getDenom(tx.data.coinB.denom)" /> pool
        </template>
        <template v-if="tx.name == 'createpool'">
          <Denom :name="getDenom(tx.data.coinA.denom)" /> &middot; <Denom :name="getDenom(tx.data.coinB.denom)" /> pool
        </template>
        <template v-if="tx.name == 'withdrawliquidity'">
          <Denom :name="getDenom(tx.data.poolCoin.denom)" />
        </template>
      </template>
      <template v-else>
        {{ overline }}
      </template>
    </div>

    <div
      v-if="status.startsWith('complete') && tx.name !== 'swap'"
      class="transferred-image block mx-auto bg-no-repeat bg-center bg-contain bg w-60 h-60 mb-8 mt-4"
    />
    <div class="font-bold mt-2 mb-3" :class="variant === 'modal' ? 'text-2' : 'text-3'">{{ title }}</div>
    <div v-if="status == 'transacting' || status == 'delay' || status == 'IBC_receive_failed' || status == 'complete'">
      <div
        v-if="status == 'delay' || status == 'IBC_receive_failed'"
        class="mx-auto max-w-sm leading-copy text-muted mt-2"
      >
        {{ subtitle }}
      </div>
      <div
        v-if="status === 'transacting' || status == 'delay' || status == 'IBC_receive_failed'"
        class="w-full max-w-lg flex items-center justify-center -space-x-8"
      >
        <template v-if="tx.name == 'addliquidity'">
          <CircleSymbol size="lg" :denom="getDenom(tx.data.coinA.denom)" />
          <EphemerisSpinner class="-my-6 flex-grow max-w-xs" />
          <CircleSymbol size="lg" :denom="getDenom(tx.data.coinB.denom)" />
        </template>

        <template v-if="tx.name == 'withdrawliquidity'">
          <CircleSymbol size="lg" :denom="getDenom(tx.data.pool.reserve_coin_denoms[0])" />
          <EphemerisSpinner class="flex-grow max-w-xs" />
          <CircleSymbol size="lg" :denom="getDenom(tx.data.pool.reserve_coin_denoms[1])" />
        </template>

        <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
          <CircleSymbol size="lg" variant="chain" :chain-name="tx.data.from_chain" />
          <EphemerisSpinner class="-my-6 flex-grow max-w-xs" />
          <div class="animate-lr absolute left-1/2 -ml-5 transition transform">
            <CircleSymbol size="lg" :denom="getDenom(tx.data.amount.denom)" />
          </div>
          <CircleSymbol size="lg" variant="chain" :chain-name="tx.data.to_chain" />
        </template>

        <template v-if="tx.name == 'transfer'">
          <EphemerisSpinner class="-my-6 flex-grow max-w-xs" />
          <div class="animate-lr absolute left-1/2 -ml-5 transition transform">
            <CircleSymbol size="lg" :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.chain_name" />
          </div>
        </template>
      </div>
      <div v-if="status === 'complete'" class="status__detail-detail mt-4 leading-copy">
        <template v-if="tx.name == 'swap' || tx.name == 'partial-swap'">
          You received
          <span class="font-bold"><AmountDisplay
            :amount="{ denom: txResult?.demandCoinDenom, amount: String(txResult?.demandCoinSwappedAmount) }"
          /></span>
          <br />
          on <ChainName :name="'cosmos-hub'" />.
          <div v-if="txResult.swappedPercent < 100" style="margin: 1.6rem 0">
            <span class="font-bold">
              <AmountDisplay
                :amount="{ denom: txResult?.offerCoinDenom, amount: String(txResult?.remainingOfferCoinAmount) }"
              />
            </span>
            not swapped
          </div>
        </template>
        <template v-else-if="tx.name === 'addliquidity' || tx.name === 'createpool'">
          <PreviewAddLiquidity :response="txResult" :fees="txResult.fees" />
        </template>
        <template v-else-if="tx.name === 'withdrawliquidity'">
          <PreviewWithdrawLiquidity :response="txResult" :fees="txResult.fees" />
        </template>
        <template
          v-else-if="isFinal && (tx.name === 'ibc_forward' || tx.name === 'ibc_backward' || tx.name === 'transfer')"
        >
          <PreviewTransfer :response="txResult" :fees="txResult.fees" />
        </template>
      </div>
      <template v-if="status !== 'complete' || !isFinal">
        <div class="status__detail-amount mt-6 font-medium text-1">
          <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward' || tx.name == 'transfer'">
            <AmountDisplay :amount="{ amount: tx.data.amount.amount, denom: getDenom(tx.data.amount.denom) }" />
          </template>
        </div>
        <div class="status__detail-path mt-0.5 mb-6 text-muted" :class="{ 'mb-12': status === 'complete' }">
          <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
            <ChainName :name="tx.data.from_chain" /> &rarr; <ChainName :name="tx.data.to_chain" /> chain
          </template>
          <template v-if="tx.name == 'transfer'"> <ChainName :name="tx.data.chain_name" /> chain </template>
        </div>
      </template>
    </div>

    <div v-else>
      <p v-if="status === 'keplr-reject'" class="mt-4">
        <a href="https://faq.keplr.app" target="_blank" class="font-medium text-link hover:text-link-hover">
          {{ $t('components.txHandlingModal.keplrSupport') }}
        </a>
      </p>

      <p v-if="status === 'unknown'" class="mt-4">
        <a href="https://t.me/EmerisHQ" target="_blank" class="font-medium text-link hover:text-link-hover">
          {{ $t('components.txHandlingModal.contactSupport') }}
        </a>
      </p>
      <div v-if="status === 'failed'" class="mx-auto max-w-sm leading-copy text-muted mt-2 mb-8">
        <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
          Your
          <AmountDisplay :amount="{ amount: tx.data.amount.amount, denom: getDenom(tx.data.amount.denom) }" /> on
          <ChainName :name="tx.data.from_chain" /> could not be transferred to
          <ChainName :name="tx.data.to_chain" />
        </template>
        <template v-if="tx.name == 'transfer'">
          Your
          <AmountDisplay :amount="{ amount: tx.data.amount.amount, denom: getDenom(tx.data.amount.denom) }" /> on
          <ChainName :name="tx.data.chain_name" /> could not be transferred.
        </template>
        <template v-if="tx.name == 'swap'">
          Your
          <AmountDisplay :amount="{ amount: tx.data.from.amount, denom: getDenom(tx.data.from.denom) }" /> could not be
          swapped to <Denom :name="getDenom(tx.data.to.denom)" /> on the Cosmos Hub.
        </template>
        <template v-if="tx.name == 'addliquidity'">
          Could not add liquidity to the <Denom :name="getDenom(tx.data.coinA.denom)" /> &middot;
          <Denom :name="getDenom(tx.data.coinB.denom)" /> pool on the Cosmos Hub.
        </template>
        <template v-if="tx.name == 'createpool'">
          Could not create a <Denom :name="getDenom(tx.data.coinA.denom)" /> /
          <Denom :name="getDenom(tx.data.coinB.denom)" /> pool on the Cosmos Hub.
        </template>
        <template v-if="tx.name == 'withdrawliquidity'">
          Could not withdraw liquidity from the <Denom :name="getDenom(tx.data.poolCoin.denom)" /> on the Cosmos Hub.
        </template>
        <Collapse
          v-if="errorDetails"
          label-open="Show details"
          label-hide="Hide details"
          class="mt-8 items-center text-left"
        >
          <Alert status="info" :show-icon="false">
            <ul class="space-y-3">
              <li v-if="errorDetails.status">
                <h5 class="font-medium text-text">Status</h5>
                <p class="mt-0.5">{{ errorDetails.status }}</p>
              </li>
              <li v-if="errorDetails.ticket">
                <h5 class="font-medium text-text">Ticket</h5>
                <p class="mt-0.5">{{ errorDetails.ticket }}</p>
              </li>
              <li v-if="errorDetails.message">
                <h5 class="font-medium text-text">Error</h5>
                <p class="mt-0.5">{{ errorDetails.message }}</p>
              </li>
            </ul>
          </Alert>
        </Collapse>
      </div>
    </div>
    <div
      v-if="secondaryButton || primaryButton"
      class="max-w-sm mx-auto mt-10 gap-y-6 w-full flex flex-col items-stretch"
    >
      <Button
        v-if="primaryButton"
        :name="primaryButton"
        variant="primary"
        :click-function="
          () => {
            status == 'keplr-reject' || status == 'failed' ? emitRetry() : isFinal ? emitDone() : emitNext();
          }
        "
      />
      {{ router?.pathname }}
      <Button
        v-if="status === 'unknown'"
        variant="link"
        :name="$t('components.txHandlingModal.backToPortfolio')"
        :click-function="unknownHandler"
      />
      <Button
        v-if="secondaryButton && tx.name === 'swap' && status !== 'complete'"
        :name="secondaryButton"
        variant="link"
        :click-function="status == 'complete' && isFinal ? emitAnother : emitClose"
        class="mb-4"
      />
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import EphemerisSpinner from '@/components/ui/EphemerisSpinner.vue';
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import SpinnerIcon from '@/components/ui/Spinner.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';
import { useStore } from '@/store';
import {
  AddLiquidityData,
  CreatePoolData,
  IBCForwardsData,
  StepTransaction,
  SwapData,
  WithdrawLiquidityData,
} from '@/types/actions';
import { getDisplayName } from '@/utils/actionHandler';
import { getBaseDenom } from '@/utils/actionHandler';

type Status =
  | 'keplr-sign'
  | 'keplr-reject'
  | 'transacting'
  | 'delay'
  | 'unknown'
  | 'IBC_receive_failed'
  | 'failed'
  | 'complete';
type Result = {
  demandCoinDenom: string;
  swappedPercent: number;
  demandCoinSwappedAmount: number;
  offerCoinDenom: string;
  remainingOfferCoinAmount: number;
};
export default defineComponent({
  name: 'TxHandlingModal',
  components: {
    PreviewAddLiquidity,
    PreviewWithdrawLiquidity,
    PreviewTransfer,
    Modal,
    SpinnerIcon,
    EphemerisSpinner,
    Button,
    Icon,
    AmountDisplay,
    ChainName,
    Denom,
    CircleSymbol,
    Alert,
    Collapse,
  },
  props: {
    status: {
      type: String as PropType<Status>,
      default: 'keplr-sign',
    },
    variant: {
      type: String as PropType<'step' | 'modal'>,
      default: 'modal',
    },
    tx: {
      type: Object as PropType<StepTransaction>,
      required: true,
    },
    hasMore: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    isFinal: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    errorDetails: {
      type: Object,
      default: undefined,
    },
    txResult: {
      type: Object as PropType<Result | any>,
      default: undefined,
    },
  },
  emits: ['close', 'next', 'retry', 'reset', 'done'],
  setup(props, { emit }) {
    // Set Icon from status
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const store = useStore();
    const iconType = computed(() => {
      if (props.status == 'keplr-sign' || (props.status == 'transacting' && props.tx.name == 'swap')) {
        return 'pending';
      }
      if (props.status == 'keplr-reject') {
        return 'warning';
      }
      if (props.status == 'failed' || props.status == 'unknown') {
        return 'error';
      }
      return null;
    });

    //Set default texts
    const overline = ref(t('components.txHandlingModal.openKeplr'));
    const title = ref(t('components.txHandlingModal.signTx'));
    const subtitle = ref('');
    const secondaryButton = ref(t('generic_cta.cancel'));
    const primaryButton = ref('');
    const baseDenoms = reactive({});

    const isIBC = computed(() => {
      return ['ibc_forward', 'ibc_backward'].includes(props.tx.name);
    });

    const getDenom = (denom: string) => {
      return baseDenoms[denom] || denom;
    };

    // Watch for status changes
    watch(
      () => props.status,
      async (newStatus) => {
        switch (newStatus) {
          case 'keplr-sign':
            overline.value = t('components.txHandlingModal.openKeplr');
            title.value = t('components.txHandlingModal.signTx');
            secondaryButton.value = t('generic_cta.cancel');
            primaryButton.value = '';
            break;
          case 'keplr-reject':
            overline.value = '';
            title.value = t('components.txHandlingModal.signError');
            secondaryButton.value = t('generic_cta.cancel');
            primaryButton.value = t('components.txHandlingModal.tryAgain');
            break;
          case 'delay':
            title.value = t('components.txHandlingModal.ibcTransferDelayTitle');
            subtitle.value = t('components.txHandlingModal.ibcTransferDelaySubtitle');
            overline.value = '';
            primaryButton.value = '';
            secondaryButton.value = '';
            break;
          case 'unknown':
            title.value = t('components.txHandlingModal.somethingWentWrong');
            overline.value = '';
            break;
          case 'IBC_receive_failed':
            title.value = t('components.txHandlingModal.somethingWentWrong');
            subtitle.value = t('components.txHandlingModal.revertTx');
            primaryButton.value = t('components.txHandlingModal.backToPortfolio');
            overline.value = '';
            break;
          case 'transacting':
            if ((props.tx as StepTransaction).name.startsWith('ibc')) {
              overline.value = t('components.txHandlingModal.ibcTransferSubtitle');
            } else {
              overline.value = t('components.txHandlingModal.txProgress');
            }
            secondaryButton.value = '';
            primaryButton.value = '';
            switch ((props.tx as StepTransaction).name) {
              //'ibc_forward' | 'ibc_backward' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool';
              case 'ibc_forward':
                title.value = t('components.txHandlingModal.transferAction');
                break;
              case 'ibc_backward':
                title.value = t('components.txHandlingModal.transferAction');
                break;
              case 'transfer':
                title.value = t('components.txHandlingModal.transferAction');
                break;
              case 'swap':
                title.value = t('components.txHandlingModal.pleaseWait');
                break;
              case 'addliquidity':
                title.value = t('components.txHandlingModal.addLiqAction');
                break;
              case 'withdrawliquidity':
                title.value = t('components.txHandlingModal.withdrawing');
                break;
              case 'createpool':
                title.value = t('components.txHandlingModal.createPoolAction');
                break;
            }
            break;
          case 'complete':
            overline.value = '';
            if (props.isFinal && !props.hasMore) {
              primaryButton.value = t('generic_cta.done');
              if (props.tx.name === 'swap' && props.txResult) {
                secondaryButton.value = `Send ${
                  Math.trunc(
                    (Number(props.txResult.demandCoinSwappedAmount) * 100) /
                      Math.pow(
                        10,
                        store.getters['demeris/getDenomPrecision']({
                          name: await getBaseDenom(props.txResult.demandCoinDenom),
                        }),
                      ),
                  ) / 100
                } ${await getDisplayName(props.txResult.demandCoinDenom, store.getters['demeris/getDexChain'])} \u2192`;
              } else {
                secondaryButton.value = t('components.txHandlingModal.reset');
              }
            } else {
              props.hasMore
                ? (primaryButton.value = t('components.txHandlingModal.next'))
                : (primaryButton.value = t('generic_cta.continue'));
              secondaryButton.value = '';
            }
            switch ((props.tx as StepTransaction).name) {
              //'ibc_forward' | 'ibc_backward' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool';
              case 'ibc_forward':
                title.value = t('components.txHandlingModal.transferred');
                break;
              case 'ibc_backward':
                title.value = t('components.txHandlingModal.transferred');
                break;
              case 'transfer':
                title.value = t('components.txHandlingModal.transferred');
                break;
              case 'swap':
                if (props.txResult.swappedPercent !== 100) {
                  title.value = t('components.previews.transfer.swapActionPartiallyComplete', {
                    swappedPercent: parseInt(`${props.txResult.swappedPercent}`),
                  });
                } else {
                  title.value = t('components.txHandlingModal.swapActionComplete');
                }
                break;
              case 'addliquidity':
                title.value = t('components.txHandlingModal.addLiqActionComplete');
                break;
              case 'withdrawliquidity':
                title.value = t('components.txHandlingModal.withdrawLiqActionComplete');
                break;
              case 'createpool':
                title.value = t('components.txHandlingModal.createPoolActionComplete');
                break;
            }
            break;
          case 'failed':
            title.value = t('components.txHandlingModal.txFail');
            switch ((props.tx as StepTransaction).name) {
              //'ibc_forward' | 'ibc_backward' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool';
              case 'swap':
                title.value = t('components.txHandlingModal.swapActionFail');
                break;
              case 'addliquidity':
                title.value = t('components.txHandlingModal.addLiqActionFail');
                break;
              case 'withdrawliquidity':
                title.value = t('components.txHandlingModal.withdrawLiqActionFail');
                break;
              case 'createpool':
                title.value = t('components.txHandlingModal.createPoolActionFail');
                break;
            }

            overline.value = '';
            secondaryButton.value = t('generic_cta.cancel');
            primaryButton.value = t('components.txHandlingModal.tryAgain');
            break;
        }
      },
    );
    onMounted(async () => {
      let denoms = [];
      let chain = undefined;

      if (isIBC.value) {
        denoms.push((props.tx.data as IBCForwardsData).amount.denom);
        chain = (props.tx.data as IBCForwardsData).from_chain;
      } else if (props.tx.name === 'swap') {
        denoms.push((props.tx.data as SwapData).from.denom);
      } else if (props.tx.name === 'addliquidity') {
        denoms.push((props.tx.data as AddLiquidityData).coinA.denom);
        denoms.push((props.tx.data as AddLiquidityData).coinB.denom);
      } else if (props.tx.name === 'createpool') {
        denoms.push((props.tx.data as CreatePoolData).coinA.denom);
        denoms.push((props.tx.data as CreatePoolData).coinB.denom);
      } else if (props.tx.name === 'withdrawliquidity') {
        denoms.push((props.tx.data as WithdrawLiquidityData).poolCoin.denom);
      }

      if (!denoms.length) {
        return;
      }

      for (const denom of denoms) {
        if (!baseDenoms[denom]) {
          baseDenoms[denom] = await getBaseDenom(denom, chain);
        }
      }
    });
    function emitClose() {
      emit('close');
    }

    function emitAnother() {
      emit('reset');
    }
    function emitRetry() {
      emit('retry');
    }
    function emitNext() {
      emit('next');
    }
    function emitDone() {
      emit('done');
    }

    function unknownHandler() {
      if (location.pathname !== '/') {
        router.push('/');
      } else {
        emitAnother();
      }
    }
    return {
      emitNext,
      emitRetry,
      emitClose,
      emitAnother,
      emitDone,
      getDenom,
      iconType,
      overline,
      title,
      subtitle,
      secondaryButton,
      primaryButton,
      router,
      unknownHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.swapped-image {
  background-image: url('~@/assets/images/swap-result.png');
  height: 13rem;
}

.transferred-image {
  background-image: url('~@/assets/images/silver-surfer-1-light.png');
}

@media (prefers-color-scheme: dark) {
  .transferred-image {
    background-image: url('~@/assets/images/silver-surfer-1-dark.png');
  }
}

.animate-lr {
  animation: animate-lr 2s infinite cubic-bezier(0.33, 1, 0.68, 1);
}

@keyframes animate-lr {
  0% {
    transform: translateX(-300%) rotate(0deg);
    opacity: 0;
  }
  40%,
  70% {
    opacity: 1;
  }
  100% {
    transform: translateX(350%) rotate(360deg);
    opacity: 0;
  }
}
</style>
