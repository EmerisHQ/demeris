<template>
  <div class="denom-select-modal-wrapper" :class="{ 'elevation-panel': asWidget, 'tx-steps--widget': asWidget }">
    <GobackWithClose v-if="asWidget" @goback="emitHandler('goback')" @close="emitHandler('close')" />

    <div class="title s-2 w-bold">
      {{ currentData.title }}
    </div>

    <template v-if="['transfer', 'move', 'redeem', 'swap', 'addliquidity'].includes(currentData.data.name)">
      <div v-if="currentData && currentData.fees" class="detail">
        <PreviewSwap v-if="currentData.data.name === 'swap'" :step="currentData.data" :fees="currentData.fees" />
        <PreviewAddLiquidity
          v-else-if="currentData.data.name === 'addliquidity'"
          :step="currentData.data"
          :fees="currentData.fees"
        />
        <PreviewTransfer v-else :step="currentData.data" :fees="currentData.fees" />
      </div>
    </template>

    <!-- TODO: Refactor -->
    <template v-else>
      <div class="amount-info">
        <div class="amount-info__type s-minus w-bold">{{ currentData.isSwap ? 'Pay' : 'Send' }}</div>
        <div class="amount-info__detail">
          <div class="amount-info__detail__coin">
            <img class="amount-info__detail__coin-image" :src="require(`@/assets/coins/atom.png`)" alt="pay coin" />
            <div class="amount-info__detail__coin-amount s-0 w-medium">500.2</div>
            <div class="amount-info__detail__coin-denom s-0 w-medium">ATOM</div>
          </div>
          <div class="amount-info__detail-chain s-minus">{{ currentData.isSwap ? '' : 'on' }} Cosmos Hub</div>
        </div>
      </div>

      <div v-if="!currentData.isSwap">
        <div class="divider" />

        <div v-if="!currentData.isSwap" class="detail-transfer">
          <div class="detail__title s-minus w-bold">
            <div>
              {{ currentData.data.transactions.length }}
              {{ currentData.data.transactions.length == 1 ? 'transaction' : 'transactions' }} to sign
            </div>
            <div class="icon"><HintIcon /></div>
          </div>
          {{ currentData.data.fees }}
          <template v-for="(fee, chain) in currentData.fees" :key="'fee' + chain">
            <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
              <div class="detail__row s-minus w-normal">
                <div class="detail__row-key">Fee ({{ chain }})</div>
                <div class="detail__row-value">
                  <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" />
                </div>
              </div>
            </template>
          </template>
        </div>

        <div class="divider" style="margin-bottom: 1.6rem" />
      </div>

      <div class="amount-info">
        <div class="amount-info__type s-minus w-bold">
          Receive
          <div v-show="currentData.isSwap" class="amount-info__type-subtitle w-normal">(estimated)</div>
        </div>
        <div class="amount-info__detail">
          <div class="amount-info__detail__coin">
            <img class="amount-info__detail__coin-image" :src="require(`@/assets/coins/luna.png`)" alt="receive coin" />
            <div class="amount-info__detail__coin-amount s-0 w-medium">500.2</div>
            <div class="amount-info__detail__coin-denom s-0 w-medium">ATOM</div>
          </div>
          <div class="amount-info__detail-chain s-minus">Cosmos Hub</div>
        </div>
      </div>

      <div v-if="currentData.isSwap" class="divider" />

      <div v-if="currentData.isSwap" class="detail">
        <div class="detail__title s-minus w-bold">Price</div>
        <div class="detail__row s-minus w-normal">
          <div class="detail__row-key">
            <div>Min. received<br />(if 100% swapped)</div>
            <tippy :max-width="192">
              <HintIcon />

              <template #content> Minimum total received if your entire swap is fulfilled. </template>
            </tippy>
          </div>
          <div class="detail__row-value">995.54 LUNA</div>
        </div>
        <div class="detail__row s-minus w-normal">
          <div class="detail__row-key">
            <div>Limit price</div>
            <tippy :max-width="192">
              <HintIcon />

              <template #content> Assets will not be swapped at a higher rate than the limit rate. </template>
            </tippy>
          </div>
          <div class="detail__row-value">1 ATOM = 1.91 LUNA</div>
        </div>
      </div>

      <div v-if="currentData.isSwap" class="divider" />

      <div v-if="currentData.isSwap" class="detail">
        <div class="detail__title s-minus w-bold">Fees</div>
        <div class="detail__row s-minus w-normal">
          <div class="detail__row-key">Transaction fee</div>
          <div class="detail__row-value">0.02 ATOM</div>
        </div>
        <div class="detail__row s-minus w-normal">
          <div class="detail__row-key">Swap fee</div>
          <div class="detail__row-value">0.02 ATOM</div>
        </div>
      </div>
    </template>

    <div class="warn s-minus w-normal" :class="currentData.isSwap ? '' : 'warn-transfer'">
      Non-revertable transactions. Prices not guaranteed etc.
    </div>

    <div class="button-wrapper">
      <Button :name="'Confirm and continue'" :status="'normal'" :click-function="confirm" />
    </div>

    <TxHandlingModal
      v-if="isTxHandlingModalOpen"
      :modal-variant="asWidget ? 'bottom' : 'full'"
      :status="txstatus"
      :black-button-func="nextTx"
      @close="toggleTxHandlingModal"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';
import TxHandlingModal from '@/components/common/TxHandlingModal.vue';
import Button from '@/components/ui/Button.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { GasPriceLevel, Step } from '@/types/actions';
import { Amount } from '@/types/base';
import { feeForStep, feeForStepTransaction, msgFromStepTransaction } from '@/utils/actionHandler';

export default defineComponent({
  name: 'TxStepsModal',
  components: {
    GobackWithClose,
    PreviewTransfer,
    PreviewAddLiquidity,
    PreviewSwap,
    Button,
    HintIcon,
    TxHandlingModal,
    AmountDisplay,
  },
  props: {
    data: {
      type: Array as PropType<Step[]>,
      required: true,
    },
    gasPriceLevel: {
      type: String as PropType<GasPriceLevel>,
      required: true,
    },
    asWidget: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['goback', 'close'],
  setup(props, { emit }) {
    console.log('modalProps', props.data);
    const fees = ref([]);
    const store = useStore();
    onMounted(async () => {
      fees.value = await Promise.all(
        (props.data as Step[]).map(async (step) => {
          return await feeForStep(step, props.gasPriceLevel as GasPriceLevel);
        }),
      );
    });
    watch(
      () => props.data,
      async (newData) => {
        fees.value = await Promise.all(
          (newData as Step[]).map(async (step) => {
            return await feeForStep(step, props.gasPriceLevel as GasPriceLevel);
          }),
        );
      },
    );
    const txToResolve = ref({});
    const isTxHandlingModalOpen = ref(false);
    const toggleTxHandlingModal = () => {
      isTxHandlingModalOpen.value = !isTxHandlingModalOpen.value;
    };
    const nextTx = () => {
      txToResolve.value['resolver']();
    };
    const currentStep = ref(0);
    const txstatus = ref('keplr-sign');
    const currentData = computed(() => {
      const currentStepData = props.data[currentStep.value];
      const modifiedData = {
        isSwap: false,
        title: '',
        fees: [],
        data: currentStepData,
      } as { isSwap: boolean; title: string; fees: Array<Amount>; data: Step };
      switch (currentStepData.name) {
        case 'swap':
          modifiedData.isSwap = true;
          modifiedData.title = 'Review your swap details';
          break;
        case 'transfer':
          modifiedData.isSwap = false;
          modifiedData.title = 'Review your transfer details';
          break;
        case 'redeem':
          break;
        case 'addliquidity':
          modifiedData.title = 'Review your pool liquidity details';
          break;
        case 'withdrawliquidity':
          break;
        case 'createpool':
          break;
      }
      modifiedData.fees = fees.value[currentStep.value];
      return modifiedData;
    });
    const confirm = async () => {
      for (let stepTx of currentData.value.data.transactions) {
        isTxHandlingModalOpen.value = true;
        txstatus.value = 'keplr-sign';
        let txToResolveResolver;
        const txToResolvePromise = {
          promise: new Promise((resolve) => {
            txToResolveResolver = resolve;
          }),
          resolver: txToResolveResolver,
        };

        txToResolve.value = txToResolvePromise;
        let res = await msgFromStepTransaction(stepTx);
        const feeOptions = await feeForStepTransaction(stepTx);
        const fee = {
          amount: [
            {
              amount: '' + parseFloat(feeOptions[0].amount[props.gasPriceLevel as GasPriceLevel]) * 300000,
              denom: feeOptions[0].denom,
            },
          ],
          gas: '300000',
        };
        let tx = await store.dispatch(GlobalDemerisActionTypes.SIGN_WITH_KEPLR, {
          msgs: [res.msg],
          chain_name: res.chain_name,
          fee,
          registry: res.registry,
          memo: 'a memo',
        });
        txstatus.value = 'transferring';
        let result = await store.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, tx);

        const txPromise = store.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
          subscribe: true,
          params: { chain_name: res.chain_name, ticket: result.ticket },
        });
        await txPromise;
        txstatus.value = 'transferred';
        console.log(txToResolve);
        await txToResolve.value['promise'];
        isTxHandlingModalOpen.value = false;
      }
    };
    const emitHandler = (event) => {
      emit(event);
    };
    return { emitHandler, txstatus, confirm, toggleTxHandlingModal, currentData, isTxHandlingModalOpen, nextTx };
  },
});
</script>

<style lang="scss" scoped>
.denom-select-modal-wrapper {
  position: relative;
  width: 100%;
  /* height: 55.8rem; */

  margin-bottom: 5rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  &.tx-steps--widget > .title {
    text-align: left;
  }

  .title {
    padding: 0 2.4rem 2.4rem;
    text-align: center;
  }

  .amount-info {
    display: flex;
    justify-content: space-between;

    color: var(--text);

    padding: 0 2.4rem;
    margin-bottom: 1.6rem;
    &__type {
      &-subtitle {
        color: var(--muted);
      }
    }
    &__detail {
      color: var(--text);
      &__coin {
        display: flex;
        align-items: center;
        &-image {
          width: 2rem;
          height: 2rem;
        }
        &-amount {
          padding: 0 0.8rem;
        }
      }
      &-chain {
        text-align: right;
      }
    }
  }

  .divider {
    margin: 0 2.4rem;
    height: 1px;
    background-color: var(--border-trans);
  }

  .detail {
    padding: 0 2.4rem;
    &__title {
      color: var(--text);
      padding: 1.6rem 0;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      padding-bottom: 1.6rem;

      &-key {
        display: flex;
        align-items: center;
        color: var(--muted);

        div {
          margin-right: 0.4rem;
        }
      }
    }
  }

  .detail-transfer {
    @extend .detail;

    .detail__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .icon {
      font-size: 1.6rem;
      color: var(--muted);
    }
  }

  .warn {
    margin: 0 2.4rem;
    padding: 1.2rem;
    border: 1px solid var(--border-trans);
    color: var(--muted);
    border-radius: 8px;
  }

  .warn-transfer {
    border: none;
    padding: 0;
  }

  .button-wrapper {
    padding: 2.8rem 2.4rem 2.4rem;
  }
}
</style>
