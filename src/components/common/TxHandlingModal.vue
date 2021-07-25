<template>
  <Modal
    :variant="modalVariant ?? 'full'"
    :class="modalVariant === 'full' ? 'tx-handling--full' : ''"
    :show-close-button="false"
    :body-class="status === 'complete' && modalVariant === 'bottom' ? 'transferred-bg' : ''"
    class="tx-handling"
    @close="emitClose"
  >
    <div class="status">
      <div v-if="iconType" class="status__icon">
        <SpinnerIcon v-if="iconType === 'pending'" :size="2.5" :gradients="['#FFF1C3', '#9B7C3A']" />
        <div v-else-if="iconType === 'warning'" class="status__icon-warning">
          <WarningIcon />
        </div>
        <div v-else class="status__icon-error">
          <ErrorIcon />
        </div>
      </div>
      <div v-else-if="status === 'complete' && tx.name === 'swap'" class="status__icon-swap-result" />
      <div v-else class="status__icon-none" />
      <div class="status__title-sub font-normal text-0">
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
          {{ subTitle }}
        </template>
      </div>

      <div v-if="status.startsWith('complete') && tx.name !== 'swap'" class="transferred-image" />
      <div class="status__title text-2 font-bold">{{ title }}</div>
      <div class="status__detail">
        <template
          v-if="status == 'transacting' || status == 'delay' || status == 'IBC_receive_failed' || status == 'complete'"
        >
          <div
            v-if="status == 'delay' || status == 'IBC_receive_failed'"
            class="status__detail-subtitle-under w-normal s-0"
          >
            {{ subTitleUnder }}
          </div>
          <div
            v-if="status === 'transacting' || status == 'delay' || status == 'IBC_receive_failed'"
            class="status__detail-transferring"
          >
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.from_chain" />
              <div class="arrow">-></div>
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.to_chain" />
            </template>

            <template v-if="tx.name == 'transfer'">
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.chain_name" />
              <div class="arrow">-></div>
              <CircleSymbol :denom="getDenom(tx.data.amount.denom)" :chain-name="tx.data.chain_name" />
            </template>
          </div>

          <div
            v-if="status === 'complete'"
            class="status__detail-detail text-0 font-normal"
            :style="'margin-top: 1rem;'"
          >
            <template v-if="tx.name == 'swap' || tx.name == 'partial-swap'">
              You received
              <span class="font-bold"
                ><AmountDisplay
                  :amount="{ denom: txResult.demandCoinDenom, amount: String(txResult.demandCoinSwappedAmount) }"
              /></span>
              <br />
              on <ChainName :name="'cosmos-hub'" />.
              <div v-if="txResult.swappedPercent < 100" style="margin: 1rem 0">
                <span class="font-bold">
                  <AmountDisplay
                    :amount="{ denom: txResult.offerCoinDenom, amount: String(txResult.remainingOfferCoinAmount) }"
                  />
                </span>
                not swapped
              </div>
            </template>
          </div>
          <div class="status__detail-amount text-0 font-medium">
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward' || tx.name == 'transfer'">
              <AmountDisplay :amount="{ amount: tx.data.amount.amount, denom: getDenom(tx.data.amount.denom) }" />
            </template>
          </div>
          <div
            class="status__detail-path text-0 font-normal"
            :style="status === 'complete' ? 'margin-bottom: 3rem' : ''"
          >
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
              <ChainName :name="tx.data.from_chain" /> -> <ChainName :name="tx.data.to_chain" /> chain
            </template>
            <template v-if="tx.name == 'transfer'"> <ChainName :name="tx.data.chain_name" /> chain </template>
          </div>
        </template>
        <template v-else>
          <a
            v-if="status === 'keplr-reject'"
            href="https://faq.keplr.app"
            target="_blank"
            class="link text-0 font-bold"
          >
            {{ $t('components.txHandlingModal.keplrSupport') }}
          <a v-if="status === 'unknown'" href="https://t.me/EmerisHQ" target="_blank" class="link text-0 font-bold">
            {{ $t('components.txHandlingModal.contactSupport') }}
          </a>
          <div v-if="status === 'keplr-sign'" class="spacer" />
          <div v-if="status === 'keplr-reject'" class="spacer-2" />
          <div v-if="status === 'unknown'" class="spacer-3" />

          <div v-else-if="status === 'failed'" class="status__detail-text-weak">
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
            <Collapse
              v-if="errorDetails"
              label-open="Show details"
              label-hide="Hide details"
              class="status__error-collapse"
            >
              <Alert status="info" :show-icon="false">
                <p v-if="errorDetails.status" class="status__error__item__key">Status</p>
                <p v-if="errorDetails.status" class="status__error__item">{{ errorDetails.status }}</p>
                <p v-if="errorDetails.ticket" class="status__error__item__key">Ticket</p>
                <p v-if="errorDetails.ticket" class="status__error__item">{{ errorDetails.ticket }}</p>
                <p v-if="errorDetails.message" class="status__error__item__key">Error</p>
                <p v-if="errorDetails.message" class="status__error__item">{{ errorDetails.message }}</p>
              </Alert>
            </Collapse>
          </div>
        </template>
      </div>
      <Button
        v-if="whiteButton && tx.name === 'swap' && status === 'complete'"
        :name="whiteButton"
        class="send-another-button"
        :status="'normal'"
        :click-function="
          () => {
            router.push('/send');
          }
        "
        :is-outline="true"
      />
      <Button
        v-if="blackButton"
        :name="blackButton"
        :status="'normal'"
        :click-function="
          () => {
            status == 'keplr-reject' || status == 'failed' ? emitRetry() : isFinal ? emitDone() : emitNext();
          }
        "
        :class="{ 'mb-6': blackButton && whiteButton }"
      />
      {{ router?.pathname }}
      <Button
        v-if="status === 'unknown'"
        :name="$t('components.txHandlingModal.backToPortfolio')"
        :status="'normal'"
        :click-function="unknownHandler"
      />
      <Button
        v-if="whiteButton && tx.name !== 'swap' && status !== 'complete'"
        :name="whiteButton"
        :status="'normal'"
        :click-function="status == 'complete' && isFinal ? emitAnother : emitClose"
        :is-outline="true"
      />
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import ErrorIcon from '@/components/common/Icons/AlertIcon.vue';
import WarningIcon from '@/components/common/Icons/ExclamationIcon.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
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
    WarningIcon,
    ErrorIcon,
    Button,
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
    modalVariant: {
      type: String,
      default: 'full',
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
    const subTitle = ref(t('components.txHandlingModal.openKeplr'));
    const title = ref(t('components.txHandlingModal.signTx'));
    const subTitleUnder = ref('');
    const whiteButton = ref(t('generic_cta.cancel'));
    const blackButton = ref('');
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
            subTitle.value = t('components.txHandlingModal.openKeplr');
            title.value = t('components.txHandlingModal.signTx');
            whiteButton.value = t('generic_cta.cancel');
            blackButton.value = '';
            break;
          case 'keplr-reject':
            subTitle.value = '';
            title.value = t('components.txHandlingModal.signError');
            whiteButton.value = t('generic_cta.cancel');
            blackButton.value = t('components.txHandlingModal.tryAgain');
            break;
          case 'delay':
            title.value = t('components.txHandlingModal.ibcTransferDelayTitle');
            subTitleUnder.value = t('components.txHandlingModal.ibcTransferDelaySubtitle');
            subTitle.value = '';
            break;
          case 'unknown':
            title.value = t('components.txHandlingModal.somethingWentWrong');
            subTitle.value = '';
            break;
          case 'IBC_receive_failed':
            title.value = t('components.txHandlingModal.somethingWentWrong');
            subTitleUnder.value = t('components.txHandlingModal.revertTx');
            blackButton.value = t('components.txHandlingModal.backToPortfolio');
            subTitle.value = '';
            break;
          case 'transacting':
            if ((props.tx as StepTransaction).name.startsWith('ibc')) {
              subTitle.value = t('components.txHandlingModal.ibcTransferSubtitle');
            } else {
              subTitle.value = t('components.txHandlingModal.txProgress');
            }
            whiteButton.value = '';
            blackButton.value = '';
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
            subTitle.value = '';
            if (props.isFinal && !props.hasMore) {
              blackButton.value = t('generic_cta.done');
              if (props.tx.name === 'swap') {
                whiteButton.value = `Send ${
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
                whiteButton.value = t('components.txHandlingModal.reset');
              }
            } else {
              props.hasMore
                ? (blackButton.value = t('components.txHandlingModal.next'))
                : (blackButton.value = t('generic_cta.continue'));
              whiteButton.value = '';
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

            subTitle.value = '';
            whiteButton.value = t('generic_cta.cancel');
            blackButton.value = t('components.txHandlingModal.tryAgain');
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
      subTitle,
      title,
      subTitleUnder,
      whiteButton,
      blackButton,
      router,
      unknownHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.tx-handling {
  &--full {
    position: relative !important;
  }
}

.status {
  text-align: center;

  &__error-collapse {
    align-items: center;
    margin-top: 2rem;
  }

  &__error__item {
    & + &__key {
      margin-top: 1.6rem;
    }
    &__key {
      font-weight: 600;
      display: block;
      margin-bottom: 0.3rem;
    }
  }

  &__title {
    margin-top: 2rem;
  }

  &__title-sub {
    color: var(--muted);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 0;

    &-warning {
      font-size: 2rem;
      color: var(--warning);
    }

    &-error {
      font-size: 2rem;
      color: var(--negative-text);
    }

    &-swap-result {
      background-image: url('../../assets/images/swap-result.png');
      height: 13.125rem;
      transform: translate(-1.5rem, -1.5rem);
      width: 20rem;
    }
  }

  &__detail {
    .link {
      display: block;
      margin-top: 1rem;
    }

    .spacer {
      height: 5.5rem;
    }

    .spacer-2 {
      height: 3rem;
    }

    .spacer-3 {
      height: 2.4rem;
    }

    &-transferring {
      width: 6rem;
      margin: 2rem auto;

      display: flex;
      align-items: center;
      justify-content: space-between;

      .arrow {
        color: var(--inactive);
        font-weight: bold;
      }
    }

    &-subtitle-under {
      margin-top: 8px;
      color: var(--muted);
    }

    &-text,
    &-link {
      padding: 2.5rem 0 2rem;
    }

    &-text {
      color: var(--text);
    }

    &-text-weak {
      color: var(--muted);
      padding: 1rem 0 2rem;
    }

    &-link {
      display: block;
    }

    &-amount {
      margin-top: 0.5rem;
    }

    &-path {
      margin-bottom: 1.5rem;
      color: var(--muted);
    }
  }
}

.transferred-image {
  background-image: url('~@/assets/images/blue-surfer-1.png');
  background-repeat: no-repeat;
  background-position: center;
  width: 188px;
  height: 177px;
  display: block;
  margin: 0 auto;
}

.send-another-button {
  @import '@/assets/scss/_elevation.scss';
  margin-top: -1.5rem;
  margin-bottom: 0.75rem;
  border-radius: $border-radius;
  background-color: var(--surface);
}
</style>
