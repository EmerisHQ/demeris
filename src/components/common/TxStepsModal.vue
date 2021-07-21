<template>
  <div class="denom-select-modal-wrapper" :class="{ 'elevation-panel': asWidget, 'tx-steps--widget': asWidget }">
    <GobackWithClose v-if="asWidget" @goback="emitHandler('goback')" @close="emitHandler('close')" />

    <template v-if="isTransferConfirmationOpen">
      <TransferInterstitialConfirmation
        :action="actionName"
        :step="data[0]"
        @continue="isTransferConfirmationOpen = false"
      />
    </template>

    <template v-else>
      <div class="title s-2 w-bold">
        {{ currentData.title }}
      </div>

      <div v-if="currentData && currentData.fees" class="detail">
        <PreviewSwap v-if="currentData.data.name === 'swap'" :step="currentData.data" :fees="currentData.fees" />
        <PreviewAddLiquidity
          v-else-if="['addliquidity', 'createpool'].includes(currentData.data.name)"
          :step="currentData.data"
          :fees="currentData.fees"
        />
        <PreviewWithdrawLiquidity
          v-else-if="currentData.data.name === 'withdrawliquidity'"
          :step="currentData.data"
          :fees="currentData.fees"
        />
        <PreviewRedeem
          v-else-if="currentData.data.name === 'redeem'"
          :step="currentData.data"
          :fees="currentData.fees"
        />
        <PreviewTransfer v-else :step="currentData.data" :fees="currentData.fees" />
      </div>

      <div class="warn s-minus w-normal" :class="currentData.isSwap ? '' : 'warn-transfer'">
        Non-revertable transactions. Prices not guaranteed etc.
      </div>

      <div class="button-wrapper">
        <Button :name="'Confirm and continue'" :status="'normal'" :click-function="confirm" />
      </div>
    </template>

    <TxHandlingModal
      v-if="true || isTxHandlingModalOpen"
      :modal-variant="asWidget ? 'bottom' : 'full'"
      :status="'transacting' || txstatus"
      :has-more="hasMore"
      :tx="{ name: 'swap' } || transaction"
      :is-final="isFinal"
      @next="nextTx"
      @retry="
        () => {
          retry = true;
          nextTx();
        }
      "
      @close="
        () => {
          nextTx();
          toggleTxHandlingModal();
        }
      "
      @done="
        () => {
          if (transaction.name == 'swap') {
            emitHandler('reset');
          } else {
            nextTx();
            goBack();
          }
        }
      "
      @reset="emitHandler('reset')"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
import TxHandlingModal from '@/components/common/TxHandlingModal.vue';
import Button from '@/components/ui/Button.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewRedeem from '@/components/wizard/previews/PreviewRedeem.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';
import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { GasPriceLevel, Step } from '@/types/actions';
import { Amount } from '@/types/base';
import { feeForStep, feeForStepTransaction, msgFromStepTransaction } from '@/utils/actionHandler';

export default defineComponent({
  name: 'TxStepsModal',
  components: {
    GobackWithClose,
    PreviewTransfer,
    PreviewRedeem,
    PreviewAddLiquidity,
    PreviewWithdrawLiquidity,
    PreviewSwap,
    Button,
    TxHandlingModal,
    TransferInterstitialConfirmation,
  },
  props: {
    actionName: {
      type: String,
      required: true,
    },
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
  emits: ['goback', 'close', 'transacting', 'failed', 'complete', 'reset', 'finish'],
  setup(props: any, { emit }) {
    const router = useRouter();
    const goBack = () => {
      router.go(-1);
    };
    const fees = ref([]);
    const retry = ref(false);
    const store = useStore();
    const hasMore = ref(false);
    const isFinal = ref(false);
    const isTransferConfirmationOpen = ref(false);

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
    console.log(fees);
    const txToResolve = ref({});
    const isTxHandlingModalOpen = ref(false);
    const toggleTxHandlingModal = () => {
      isTxHandlingModalOpen.value = !isTxHandlingModalOpen.value;
    };
    const transaction = ref({});
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
          modifiedData.title = 'Review your withdraw liquidity details';
          break;
        case 'createpool':
          modifiedData.title = 'Review your pool liquidity details';
          break;
      }
      modifiedData.fees = fees.value[currentStep.value];
      return modifiedData;
    });
    const confirm = async () => {
      let abort = false;

      for (let [i, stepTx] of currentData.value.data.transactions.entries()) {
        if (!abort) {
          if (currentStep.value == (props.data as Step[]).length - 1) {
            isFinal.value = true;
          }
          do {
            retry.value = false;
            transaction.value = stepTx;
            if (currentData.value.data.transactions.length > i + 1) {
              hasMore.value = true;
            } else {
              hasMore.value = false;
            }
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
            let tx;
            try {
              tx = await store.dispatch(GlobalDemerisActionTypes.SIGN_WITH_KEPLR, {
                msgs: [res.msg],
                chain_name: res.chain_name,
                fee,
                registry: res.registry,
                memo: 'a memo',
              });
            } catch (e) {
              txstatus.value = 'keplr-reject';
              await txToResolve.value['promise'];
              continue;
            }
            if (tx) {
              emit('transacting');
              txstatus.value = 'transacting';
              let result;
              try {
                result = await store.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, tx);
              } catch (e) {
                emit('failed');
                txstatus.value = 'failed';
                await txToResolve.value['promise'];
                abort = true;
                continue;
              }
              try {
                let status = await store.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
                  subscribe: true,
                  params: { chain_name: res.chain_name, ticket: result.ticket },
                });

                while (
                  status != 'complete' &&
                  status != 'failed' &&
                  status != 'IBC_receive_success' &&
                  status != 'Tokens_unlocked_timeout' &&
                  status != 'Tokens_unlocked_ack'
                ) {
                  console.log(status);
                  status = await store.getters['demeris/getTxStatus']({
                    chain_name: res.chain_name,
                    ticket: result.ticket,
                  });
                }
                // TODO: deal with status here
                console.log(status);
                emit('complete');
                txstatus.value = 'complete';

                await txToResolve.value['promise'];
              } catch (e) {
                console.log(e);
                emit('failed');
                txstatus.value = 'failed';
                await txToResolve.value['promise'];
                abort = true;
                continue;
              }
            }
          } while (retry.value);
        }
        isTxHandlingModalOpen.value = false;
      }
      if (currentStep.value == (props.data as Step[]).length - 1) {
        // At the end, emit completion
        emit('finish');
      } else {
        currentStep.value = currentStep.value + 1;
      }
    };
    const emitHandler = (event) => {
      emit(event);
    };

    watch(
      props,
      () => {
        let shouldOpenConfirmation = false;

        if (props.actionName === 'move') {
          shouldOpenConfirmation = true;
        } else if (props.actionName === 'transfer') {
          if (props.data?.[0]?.transactions[0]?.name.includes('ibc')) {
            shouldOpenConfirmation = true;
          }
        } else if (['swap', 'addliquidity'].includes(props.actionName)) {
          shouldOpenConfirmation = props.data.length > 1;
        }

        isTransferConfirmationOpen.value = shouldOpenConfirmation;
      },
      { immediate: true },
    );

    return {
      isTransferConfirmationOpen,
      emitHandler,
      txstatus,
      confirm,
      toggleTxHandlingModal,
      currentData,
      goBack,
      isTxHandlingModalOpen,
      nextTx,
      transaction,
      retry,
      hasMore,
      isFinal,
    };
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
