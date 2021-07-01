<template>
  <div class="denom-select-modal-wrapper elevation-panel">
    <GobackWithClose @goback="emitHandler('goback')" @close="emitHandler('close')" />

    <div class="title s-2 w-bold">
      {{ currentData.title }}
    </div>

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

    <div class="warn s-minus w-normal" :class="currentData.isSwap ? '' : 'warn-transfer'">
      Non-revertable transactions. Prices not guaranteed etc.
    </div>

    <div class="button-wrapper">
      <Button :name="'Confirm and continue'" :status="'normal'" :click-function="setStep" />
    </div>
    <TxHandlingModal v-if="isTxHandlingModalOpen" :status="currentData.txstatus" @close="toggleTxHandlingModal" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';
import TxHandlingModal from '@/components/common/TxHandlingModal.vue';
import Button from '@/components/ui/Button.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { GasPriceLevel, Step } from '@/types/actions';
import { Amount } from '@/types/base';
import { feeForStep, feeForStepTransaction, msgFromStepTransaction } from '@/utils/actionHandler';

export default defineComponent({
  name: 'TxStepsModal',
  components: {
    GobackWithClose,
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
    const processData = reactive({
      currentStep: 0,
      currentData: computed(() => {
        const currentStepData = props.data[processData.currentStep];
        const modifiedData = {
          isSwap: false,
          title: '',
          fees: [],
          data: currentStepData,
          txstatus: 'keplr-sign',
        } as { isSwap: boolean; title: string; fees: Array<Amount>; data: Step; txstatus: string };
        console.log('currentStepData', currentStepData);
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
            break;
          case 'withdrawliquidity':
            break;
          case 'createpool':
            break;
        }
        modifiedData.fees = fees.value[processData.currentStep];
        return modifiedData;
      }),
      emitHandler: (event) => {
        emit(event);
      },
      setStep: async () => {
        processData.isTxHandlingModalOpen = true;
        for (let stepTx of processData.currentData.data.transactions) {
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
          processData.currentData.txstatus = 'keplr-sign';
          console.log({
            msgs: [res.msg],
            chain_name: res.chain_name,
            fee,
            registry: res.registry,
            memo: 'a memo',
          });
          let tx = await store.dispatch(GlobalDemerisActionTypes.SIGN_WITH_KEPLR, {
            msgs: [res.msg],
            chain_name: res.chain_name,
            fee,
            registry: res.registry,
            memo: 'a memo',
          });
          console.log('Should change?');
          processData.currentData.txstatus = 'transferring';
          let result = await store.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, tx);

          const txPromise = store.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
            subscribe: true,
            params: { chain_name: res.chain_name, ticket: result.ticket },
          });
          await txPromise;
          processData.currentData.txstatus = 'transferred';
        }
        processData.isTxHandlingModalOpen = false;
        processData.currentStep += 1;
      },
      isTxHandlingModalOpen: false,

      toggleTxHandlingModal: () => {
        processData.isTxHandlingModalOpen = !processData.isTxHandlingModalOpen;
      },
    });

    return toRefs(processData);
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

  .title {
    padding: 0 2.4rem 2.4rem;
    text-align: left;
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
    padding: 0 1.2rem;
  }

  .button-wrapper {
    padding: 2.8rem 2.4rem 2.4rem;
  }
}
</style>
