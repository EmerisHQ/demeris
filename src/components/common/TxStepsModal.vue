<template>
  <div
    class="tx-steps denom-select-modal-wrapper"
    :class="{ 'elevation-panel tx-steps--widget': variant === 'widget' }"
  >
    <GobackWithClose v-if="variant === 'widget'" @goback="emitHandler('goback')" @close="emitHandler('close')" />
    <template v-if="isTransferConfirmationOpen">
      <TransferInterstitialConfirmation
        :action="actionName"
        :step="data[0]"
        @continue="isTransferConfirmationOpen = false"
      />
    </template>

    <template v-else>
      <div v-show="!isTxHandlingModalOpen || variant === 'widget'" class="tx-steps__content">
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
      </div>
    </template>

    <TxHandlingModal
      v-if="isTxHandlingModalOpen"
      :modal-variant="variant === 'widget' ? 'bottom' : 'full'"
      :status="txstatus"
      :tx-result="txResult"
      :has-more="hasMore"
      :tx="transaction"
      :is-final="isFinal"
      :error-details="errorDetails"
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
            if (!hasMore) {
              goBack();
            }
          }
        }
      "
      @reset="emitHandler('reset')"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';
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
    backRoute: {
      type: [Object, String] as PropType<RouteLocationRaw>,
      default: undefined,
    },
    variant: {
      type: String as PropType<'default' | 'widget'>,
      default: 'default',
    },
  },
  emits: ['goback', 'close', 'transacting', 'failed', 'complete', 'reset', 'finish'],
  setup(props: any, { emit }) {
    const router = useRouter();
    const goBack = () => {
      if (props.backRoute) {
        router.push(props.backRoute);
        return;
      }
      router.go(-1);
    };
    const fees = ref([]);
    const retry = ref(false);
    const store = useStore();
    const hasMore = ref(false);
    const isFinal = ref(false);
    const isTransferConfirmationOpen = ref(false);
    const txResult = ref(null);

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
    const errorDetails = ref(undefined);

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
          if (i == currentData.value.data.transactions.length - 1) {
            isFinal.value = true;
          } else {
            isFinal.value = false;
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
              console.error(e);
              txstatus.value = 'keplr-reject';
              await txToResolve.value['promise'];
              continue;
            }
            if (tx) {
              errorDetails.value = undefined;
              emit('transacting');
              txstatus.value = 'transacting';
              let result;
              try {
                result = await store.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, tx);
              } catch (e) {
                console.error(e);
                errorDetails.value = {
                  message: e.message,
                  ticket: result.ticket,
                };
                emit('failed');
                txstatus.value = 'failed';
                await txToResolve.value['promise'];
                abort = true;
                continue;
              }
              try {
                let txResultData = await store.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
                  subscribe: true,
                  params: { chain_name: res.chain_name, ticket: result.ticket },
                });

                while (
                  txResultData.status != 'complete' &&
                  txResultData.status != 'failed' &&
                  txResultData.status != 'IBC_receive_success' &&
                  txResultData.status != 'Tokens_unlocked_timeout' &&
                  txResultData.status != 'Tokens_unlocked_ack'
                ) {
                  txResultData = await store.getters['demeris/getTxStatus']({
                    chain_name: res.chain_name,
                    ticket: result.ticket,
                  });
                  console.log(txResultData.status);
                }

                if (!['IBC_receive_success', 'complete'].includes(txResultData.status)) {
                  const details = {
                    status: txResultData.status,
                    ticket: result.ticket,
                  };

                  if (txResultData.error) {
                    details['message'] = txResultData.error;
                  }
                  errorDetails.value = details;
                  throw new Error(txResultData.error || txResultData.status);
                }

                errorDetails.value = undefined;

                if (currentData.value.data.name === 'swap') {
                  const result = {
                    swappedPercent: 0,
                    demandCoinSwappedAmount: 0,
                    demandCoinDenom: '',
                    remainingOfferCoinAmount: 0,
                    offerCoinDenom: '',
                  };

                  //Get end block events
                  let endBlockEvent = await store.dispatch(GlobalDemerisActionTypes.GET_END_BLOCK_EVENTS, {
                    height: txResultData.height,
                  });

                  result.demandCoinDenom = endBlockEvent.demand_coin_denom;
                  result.swappedPercent =
                    (Number(endBlockEvent.exchanged_offer_coin_amount) /
                      (Number(endBlockEvent.remaining_offer_coin_amount) +
                        Number(endBlockEvent.exchanged_offer_coin_amount))) *
                    100;
                  result.demandCoinSwappedAmount = endBlockEvent.exchanged_demand_coin_amount;
                  result.remainingOfferCoinAmount = endBlockEvent.remaining_offer_coin_amount;
                  result.offerCoinDenom = endBlockEvent.offer_coin_denom;
                  txResult.value = result;
                  console.log('swap result', result);
                }
                if (currentData.value.data.name === 'swap') {
                  console.log('txResultData', txResultData);
                  //Get end block events
                  let endBlockEvent = await store.dispatch(GlobalDemerisActionTypes.GET_END_BLOCK_EVENTS, {
                    height: txResultData.height,
                  });

                  const result = {
                    swappedPercent: 0,
                    demandCoinSwappedAmount: 0,
                    demandCoinDenom: '',
                    remainingOfferCoinAmount: 0,
                    offerCoinDenom: '',
                  };

                  console.log('endBlockEvent', endBlockEvent);

                  result.demandCoinDenom = endBlockEvent.demand_coin_denom;
                  result.swappedPercent =
                    (Number(endBlockEvent.exchanged_offer_coin_amount) /
                      (Number(endBlockEvent.remaining_offer_coin_amount) +
                        Number(endBlockEvent.exchanged_offer_coin_amount))) *
                    100;
                  result.demandCoinSwappedAmount = endBlockEvent.exchanged_demand_coin_amount;
                  result.remainingOfferCoinAmount = endBlockEvent.remaining_offer_coin_amount;
                  result.offerCoinDenom = endBlockEvent.offer_coin_denom;
                  txResult.value = result;
                  console.log('swap result', result);
                }

                // TODO: deal with status here
                emit('complete');
                txstatus.value = 'complete';

                await txToResolve.value['promise'];
              } catch (e) {
                console.error(e);
                if (errorDetails.value === undefined) {
                  errorDetails.value = e.message;
                }
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
          shouldOpenConfirmation = props.data?.length > 1;
        }

        isTransferConfirmationOpen.value = shouldOpenConfirmation;
      },
      { immediate: true },
    );

    return {
      isTransferConfirmationOpen,
      emitHandler,
      txstatus,
      txResult,
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
      errorDetails,
    };
  },
});
</script>

<style lang="scss" scoped>
.tx-steps {
  &--widget &__content {
    max-height: 50rem;
    overflow: scroll;
  }
}

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
