<template>
  <component
    :is="variant === 'step' ? 'div' : 'Modal'"
    :variant="variant === 'modal' ? bottom : null"
    :show-close-button="variant === 'modal' ? false : null"
    :body-class="{ 'bg-brand': status === 'complete' && variant === 'modal' }"
    @close="emitClose"
  >
    <div class="text-center">
      <div v-if="iconType" class="flex items-center justify-center mt-12 mb-6">
        <SpinnerIcon v-if="iconType === 'pending'" :size="3" />
        <Icon v-else-if="iconType === 'warning'" name="ExclamationIcon" :icon-size="3" class="text-warning" />
        <Icon v-else name="ErrorIcon" size="3" class="text-negative" />
      </div>
      <div v-else-if="status === 'complete' && tx.name === 'swap'" class="status__icon-swap-result -mt-6 -ml-6 w-5" />
      <div class="text-muted">
        <template v-if="status == 'failed' || status == 'unknown'">
          <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
            <ChainName :name="getDenom(tx.data.from_chain)" /> -> <ChainName :name="tx.data.to_chain" />
          </template>
          <template v-if="tx.name == 'transfer'">
            <Denom :name="getDenom(tx.data.amount.denom)" /> (<ChainName :name="tx.data.chain_name" />)
          </template>
          <template v-if="tx.name == 'swap'">
            <Denom :name="getDenom(tx.data.from.denom)" /> -> <Denom :name="getDenom(tx.data.to.denom)" />
          </template>
          <template v-if="tx.name == 'addliquidity'">
            <Denom :name="getDenom(tx.data.coinA.denom)" /> / <Denom :name="getDenom(tx.data.coinB.denom)" /> Pool
          </template>
          <template v-if="tx.name == 'createpool'">
            <Denom :name="getDenom(tx.data.coinA.denom)" /> / <Denom :name="getDenom(tx.data.coinB.denom)" /> Pool
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
        class="transferred-image block mx-auto bg-no-repeat bg-center mb-8"
      />
      <div class="font-bold mt-2" :class="variant === 'modal' ? 'text-2' : 'text-3'">{{ title }}</div>
      <div>
        <template v-if="status == 'transacting' || status == 'delay' || status == 'IBC_receive_failed' || status == 'complete'">
          <div v-if="status == 'delay' || status == 'IBC_receive_failed'">
            {{ subtitle }}
          </div>
          <div
            v-if="status === 'transacting' || status == 'delay' || status == 'IBC_receive_failed'"
            class="w-24 my-8 mx-auto flex items-center justify-between"
          >
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.from_chain" />
              <div class="text-inactive font-bold">-></div>
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.to_chain" />
            </template>

            <template v-if="tx.name == 'transfer'">
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.chain_name" />
              <div class="text-inactive font-bold">-></div>
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.chain_name" />
            </template>
          </div>

          <div v-if="status === 'complete'" class="mt-4 leading-copy">
            <template v-if="tx.name == 'swap' || tx.name == 'partial-swap'">
              You received
              <span class="font-bold"><AmountDisplay
                :amount="{
                  denom: txResult.demandCoinDenom,
                  amount: String(txResult.demandCoinSwappedAmount),
                }"
              /></span><br />
              on <ChainName :name="'cosmos-hub'" />.
              <div v-if="txResult.swappedPercent < 100" class="my-4">
                <span class="font-bold">
                  <AmountDisplay
                    :amount="{ denom: txResult.offerCoinDenom, amount: String(txResult.remainingOfferCoinAmount) }"
                  />
                </span>
                not swapped
              </div>
            </template>
          </div>
          <div class="mt-2 font-medium">
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward' || tx.name == 'transfer'">
              <AmountDisplay :amount="{ amount: tx.data.amount.amount, denom: getDenom(tx.data.amount.denom) }" />
            </template>
          </div>
          <div class="mb-6 text-muted" :class="{ 'mb-12': status === 'complete' }">
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
              <ChainName :name="tx.data.from_chain" /> -> <ChainName :name="tx.data.to_chain" />
            </template>
            <template v-if="tx.name == 'transfer'"> <ChainName :name="tx.data.chain_name" /></template>
          </div>
        </template>
        <template v-else>
          <a
            v-if="status === 'keplr-reject'"
            href="https://faq.keplr.app"
            target="_blank"
            class="mt-4 text-0 font-medium"
          >
            {{ $t('components.txHandlingModal.keplrSupport') }}
          <a v-if="status === 'unknown'" href="https://t.me/EmerisHQ" target="_blank" class="link text-0 font-bold">
            {{ $t('components.txHandlingModal.contactSupport') }}
          </a>
          <div v-if="status === 'keplr-sign'" class="h-14" />
          <div v-if="status === 'keplr-reject'" class="h-8" />
          <div v-if="status === 'unknown'" class="h-6" />
          <div v-else-if="status === 'failed'" class="text-muted mt-4 mb-8">
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
              <AmountDisplay :amount="{ amount: tx.data.from.amount, denom: getDenom(tx.data.from.denom) }" /> could not
              be swapped to <Denom :name="getDenom(tx.data.to.denom)" /> on the Cosmos Hub.
            </template>
            <template v-if="tx.name == 'addliquidity'">
              Could not add liquidity to the <Denom :name="getDenom(tx.data.coinA.denom)" /> /
              <Denom :name="getDenom(tx.data.coinB.denom)" /> pool on the Cosmos Hub.
            </template>
            <template v-if="tx.name == 'createpool'">
              Could not create a <Denom :name="getDenom(tx.data.coinA.denom)" /> /
              <Denom :name="getDenom(tx.data.coinB.denom)" /> pool on the Cosmos Hub.
            </template>
            <template v-if="tx.name == 'withdrawliquidity'">
              Could not withdraw liquidity from the <Denom :name="getDenom(tx.data.poolCoin.denom)" /> on the Cosmos
              Hub.
            </template>
            <Collapse v-if="errorDetails" label-open="Show details" label-hide="Hide details" class="mt-8 items-center">
              <Alert status="info" :show-icon="false">
                <p v-if="errorDetails.status" class="font-medium block mb-1">Status</p>
                <p v-if="errorDetails.status">{{ errorDetails.status }}</p>
                <p v-if="errorDetails.ticket" class="font-medium block mb-1 mt-4">Ticket</p>
                <p v-if="errorDetails.ticket">{{ errorDetails.ticket }}</p>
                <p v-if="errorDetails.message" class="font-medium block mb-1 mt-4">Error</p>
                <p v-if="errorDetails.message">{{ errorDetails.message }}</p>
              </Alert>
            </Collapse>
          </div>
        </template>
      </div>
      <div v-if="secondaryButton || primaryButton" class="max-w-sm mx-auto mt-8 space-y-6">
        <Button
          v-if="secondaryButton && tx.name === 'swap' && status === 'complete'"
          :name="secondaryButton"
          variant="link"
          :click-function="
            () => {
              router.push('/send');
            }
          "
        />
        <Button
          v-if="primaryButton"
          :name="primaryButton"
          variant="primary"
          :click-function="
            () => {
              status == 'keplr-reject' || status == 'failed' ? emitRetry() : isFinal ? emitDone() : emitNext();
            }
          "
          :class="{ 'mb-6': primaryButton && secondaryButton }"
        />
        {{ router?.pathname }}
        <Button
          v-if="status === 'unknown'"
          :name="$t('components.txHandlingModal.backToPortfolio')"
          :click-function="unknownHandler"
        />
        <Button
          v-if="secondaryButton && tx.name !== 'swap' && status !== 'complete'"
          :name="secondaryButton"
          variant="link"
          :click-function="status == 'complete' && isFinal ? emitAnother : emitClose"
        />
      </div>
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
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import SpinnerIcon from '@/components/ui/Spinner.vue';
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
    Modal,
    SpinnerIcon,
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
      type: Object as PropType<Result>,
      default: () => {
        return {
          swappedPercent: 0,
          demandCoinSwappedAmount: 0,
          demandCoinDenom: '',
          offerCoinDenom: '',
          remainingOfferCoinAmount: 0,
        };
      },
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
              if (props.tx.name === 'swap') {
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
                } ${await getDisplayName(props.txResult.demandCoinDenom, store.getters['demeris/getDexChain'])} ->`;
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
.status {
  &__icon {
    &-swap-result {
      background-image: url('../../assets/images/swap-result.png');
      height: 13.125rem;
    }
  }
}

.transferred-image {
  background-image: url('~@/assets/images/blue-surfer-1.png');
  width: 188px;
  height: 177px;
}
</style>
