<template>
  <Modal
    :variant="'full'"
    :show-close-button="false"
    :body-class="status === 'complete' ? 'transferred-bg' : ''"
    @close="emitClose"
  >
    <div class="status">
      <div v-if="iconType" class="status__icon">
        <SpinnerIcon v-if="iconType === 'pending'" :size="3.2" />
        <div v-else-if="iconType === 'warning'" class="status__icon-warning">
          <WarningIcon />
        </div>
        <div v-else class="status__icon-error">
          <ErrorIcon />
        </div>
      </div>
      <div v-else class="status__icon-none" />
      <div class="status__title-sub w-normal s-0">
        <template v-if="status == 'failed'">
          <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
            <ChainName :name="tx.data.from_chain" /> -> <ChainName :name="tx.data.to_chain" />
          </template>
          <template v-if="tx.name == 'transfer'">
            <Denom :name="tx.data.amount.denom" /> (<ChainName :name="tx.data.chain_name" />)
          </template>
          <template v-if="tx.name == 'swap'">
            <Denom :name="tx.data.from.denom" /> -> <Denom :name="tx.data.to.denom" />
          </template>
          <template v-if="tx.name == 'addliquidity'">
            <Denom :name="tx.data.coinA.denom" /> / <Denom :name="tx.data.coinB.denom" /> Pool
          </template>
          <template v-if="tx.name == 'createpool'">
            <Denom :name="tx.data.coinA.denom" /> / <Denom :name="tx.data.coinB.denom" /> Pool
          </template>
          <template v-if="tx.name == 'withdrawliquidity'">
            <Denom :name="tx.data.poolCoin.denom" />
          </template>
        </template>
        <template v-else>
          {{ subTitle }}
        </template>
      </div>
      <div v-if="status.startsWith('transfer')" class="transferred-image" />
      <div class="status__title s-2 w-bold">{{ title }}</div>
      <div class="status__detail">
        <template v-if="status == 'transacting' || status == 'complete'">
          <div v-if="status === 'transacting'" class="status__detail-transferring">
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
              <CoinImageWithRing :coin-data="{ denom: tx.data.amount.denom, on_chain: tx.data.from_chain }" />
              <div class="arrow">-></div>
              <CoinImageWithRing :coin-data="{ denom: tx.data.amount.denom, on_chain: tx.data.to_chain }" />
            </template>
            <template v-if="tx.name == 'transfer'">
              <CoinImageWithRing :coin-data="{ denom: tx.data.amount.denom, on_chain: tx.data.chain_name }" />
              <div class="arrow">-></div>
              <CoinImageWithRing :coin-data="{ denom: tx.data.amount.denom, on_chain: tx.data.chain_name }" />
            </template>
          </div>
          <div class="status__detail-amount s-0 w-medium">
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward' || tx.name == 'transfer'">
              <AmountDisplay :amount="tx.data.amount" />
            </template>
          </div>
          <div class="status__detail-path s-0 w-normal" :style="status === 'complete' ? 'margin-bottom: 4.8rem' : ''">
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
              <ChainName :name="tx.data.from_chain" /> -> <ChainName :name="tx.data.to_chain" /> chain
            </template>
            <template v-if="tx.name == 'transfer'"> <ChainName :name="tx.data.chain_name" /> chain </template>
          </div>
        </template>
        <template v-else>
          <div v-if="status === 'keplr-sign'" class="spacer" />
          <div v-else-if="status === 'failed'" class="status__detail-text-weak">
            <template v-if="tx.name == 'ibc_forward' || tx.name == 'ibc_backward'">
              Your <AmountDisplay :amount="tx.data.amount" /> on <ChainName :name="tx.data.from_chain" /> could not be
              transferred to <ChainName :name="tx.data.to_chain" />
            </template>
            <template v-if="tx.name == 'transfer'">
              Your <AmountDisplay :amount="tx.data.amount" /> on <ChainName :name="tx.data.chain_name" /> could not be
              transferred.
            </template>
            <template v-if="tx.name == 'swap'">
              Your <AmountDisplay :amount="tx.data.from" /> could not be swapped to
              <Denom :name="tx.data.to.denom" /> on the Cosmos Hub.
            </template>
            <template v-if="tx.name == 'addliquidity'">
              Could not add liquidity to the <Denom :name="tx.data.coinA.denom" /> /
              <Denom :name="tx.data.coinB.denom" /> pool on the Cosmos Hub.
            </template>
            <template v-if="tx.name == 'createpool'">
              Could not create a <Denom :name="tx.data.coinA.denom" /> / <Denom :name="tx.data.coinB.denom" /> pool on
              the Cosmos Hub.
            </template>
            <template v-if="tx.name == 'withdrawliquidity'">
              Could not withdraw liquidity from the <Denom :name="tx.data.poolCoin.denom" /> on the Cosmos Hub.
            </template>
          </div>
        </template>
      </div>
      <Button
        v-if="blackButton"
        :name="blackButton"
        :status="'normal'"
        :click-function="
          () => {
            status == 'keplr-reject'
              ? emitRetry()
              : status == 'failed'
                ? emitClose()
                : isFinal
                  ? emitDone()
                  : emitNext();
          }
        "
        :style="{ marginBottom: `${blackButton && whiteButton ? '2.4rem' : ''}` }"
      />
      <Button
        v-if="whiteButton"
        :name="whiteButton"
        :status="'normal'"
        :click-function="status == 'complete' && isFinal ? emitAnother : emitClose"
        :is-outline="true"
      />
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CoinImageWithRing from '@/components/common/CoinImageWithRing.vue';
import Denom from '@/components/common/Denom.vue';
import ErrorIcon from '@/components/common/Icons/AlertIcon.vue';
import WarningIcon from '@/components/common/Icons/ExclamationIcon.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import SpinnerIcon from '@/components/ui/Spinner.vue';
import { StepTransaction } from '@/types/actions';

type Status = 'keplr-sign' | 'keplr-reject' | 'transacting' | 'failed' | 'complete';

export default defineComponent({
  name: 'TxHandlingModal',
  components: {
    Modal,
    SpinnerIcon,
    WarningIcon,
    ErrorIcon,
    Button,
    CoinImageWithRing,
    AmountDisplay,
    ChainName,
    Denom,
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
  },
  emits: ['close', 'next', 'retry', 'reset', 'done'],
  setup(props, { emit }) {
    // Set Icon from status
    const iconType = computed(() => {
      if (props.status == 'keplr-sign') {
        return 'pending';
      }
      if (props.status == 'keplr-reject') {
        return 'warning';
      }
      if (props.status == 'failed') {
        return 'error';
      }
      return null;
    });

    //Set default texts
    const subTitle = ref('Opening Keplr');
    const title = ref('Sign transaction');
    const whiteButton = ref('Cancel');
    const blackButton = ref('');

    // Watch for status changes
    watch(
      () => props.status,
      (newStatus) => {
        switch (newStatus) {
          case 'keplr-sign':
            subTitle.value = 'Opening Keplr';
            title.value = 'Sign transaction';
            whiteButton.value = 'Cancel';
            blackButton.value = '';
            break;
          case 'keplr-reject':
            subTitle.value = '';
            title.value = 'Transaction not signed!';
            whiteButton.value = 'Cancel';
            blackButton.value = 'Try again';
            break;
          case 'transacting':
            subTitle.value = 'Please wait';
            whiteButton.value = '';
            blackButton.value = '';
            switch ((props.tx as StepTransaction).name) {
              //'ibc_forward' | 'ibc_backward' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool';
              case 'ibc_forward':
                title.value = 'Transferring';
                break;
              case 'ibc_backward':
                title.value = 'Transferring';
                break;
              case 'transfer':
                title.value = 'Transferring';
                break;
              case 'swap':
                title.value = 'Swapping';
                break;
              case 'addliquidity':
                title.value = 'Adding liquidity';
                break;
              case 'withdrawliquidity':
                title.value = 'Withdrawing';
                break;
              case 'createpool':
                title.value = 'Creating pool';
                break;
            }
            break;
          case 'complete':
            subTitle.value = '';
            if (props.isFinal) {
              blackButton.value = 'Done';
              whiteButton.value = 'Send another';
            } else {
              props.hasMore ? (blackButton.value = 'Next transaction') : (blackButton.value = 'Continue');
              whiteButton.value = '';
            }
            switch ((props.tx as StepTransaction).name) {
              //'ibc_forward' | 'ibc_backward' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool';
              case 'ibc_forward':
                title.value = 'Transferred';
                break;
              case 'ibc_backward':
                title.value = 'Transferred';
                break;
              case 'transfer':
                title.value = 'Transferred';
                break;
              case 'swap':
                title.value = 'Swapped';
                break;
              case 'addliquidity':
                title.value = 'Liquidity added';
                break;
              case 'withdrawliquidity':
                title.value = 'Liquidity withdrawn';
                break;
              case 'createpool':
                title.value = 'Pool created';
                break;
            }
            break;
          case 'failed':
            title.value = 'Transaction failed';
            whiteButton.value = '';
            subTitle.value = '';
            blackButton.value = 'Cancel';
            break;
        }
      },
    );

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
    return {
      emitNext,
      emitRetry,
      emitClose,
      emitAnother,
      emitDone,
      iconType,
      subTitle,
      title,
      whiteButton,
      blackButton,
    };
  },
});
</script>

<style lang="scss" scoped>
.status {
  text-align: center;

  &__title-sub {
    color: var(--muted);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2.4rem 0;

    &-warning {
      font-size: 4.2rem;
      color: var(--warning);
    }

    &-error {
      font-size: 3.2rem;
      color: var(--negative-text);
    }

    &-none {
      height: 2.4rem;
    }
  }

  &__detail {
    .spacer {
      height: 8.8rem;
    }

    &-transferring {
      width: 9.6rem;
      margin: 3.2rem auto;

      display: flex;
      align-items: center;
      justify-content: space-between;

      .arrow {
        color: var(--inactive);
        font-weight: bold;
      }
    }

    &-text,
    &-link {
      padding: 4rem 0 3.2rem;
    }

    &-text {
      color: var(--text);
    }

    &-text-weak {
      color: var(--muted);
      padding: 1.6rem 0 3.2rem;
    }

    &-link {
      display: block;
    }

    &-amount {
      margin-top: 0.8rem;
    }

    &-path {
      margin-bottom: 2.4rem;
      color: var(--muted);
    }
  }
}

.transferred-image {
  background-image: url('~@/assets/images/blue-surfer-1.png');
  background-repeat: no-repeat;
  background-position: center;
  width: 18.8rem;
  height: 17.7rem;
  display: block;
  margin: 0 auto;
}
</style>
